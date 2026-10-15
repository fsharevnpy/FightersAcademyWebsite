import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { programs } from "../content/programs";
import { leadMessages, undecidedProgram } from "../lib/leads";

const facebook = "https://www.facebook.com/profile.php?id=61589039416602";
async function fillForm(page: Page) {
  await page.getByLabel("Tên phụ huynh").fill("Nguyễn Văn A");
  await page.getByLabel("Số điện thoại").fill("+84 901 234 567");
  await page.getByLabel("Tuổi của bé").selectOption("9");
}

test("hero, renamed program, separate electronics prices and official Facebook remain consistent", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-description")).toContainText("Cùng con khám phá robot, lập trình, điện tử và chế tạo qua những trải nghiệm STEM thực tế.");
  await expect(page.locator(".program-card-main h3")).toHaveText(["Rio", "Starter Kit", "Tư duy logic & Lập trình", "Điện tử cơ bản"]);
  const electronics = page.locator(".program-card").last();
  await expect(electronics.locator(".program-age")).toHaveText("7–15 tuổi");
  await expect(electronics.locator(".program-tuition")).toContainText("Khóa học từ 3.500.000");
  await expect(electronics.locator(".program-tuition")).toContainText("Chuyên đề từ 3.000.000");
  await expect(electronics.locator(".program-tuition")).not.toContainText("khóa hoặc chuyên đề");
  const socialLinks = page.locator('a[href*="facebook.com"]');
  expect(await socialLinks.count()).toBeGreaterThanOrEqual(2);
  for (const link of await socialLinks.all()) {
    await expect(link).toHaveAttribute("href", facebook);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Tư duy logic & Lập trình/);
});

test("electronics has four keyboard-accessible collapsed groups with all 14 modules intact", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Xem chi tiết chương trình Điện tử cơ bản", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const toggles = dialog.locator(".curriculum-group h4 button");
  await expect(toggles).toHaveText([
    "Kỹ sư nhí tập sự3 khóa", "Kỹ sư nhí chính thức4 khóa", "Kỹ sư nhí cao cấp4 khóa", "Kỹ sư nhí chuyên sâu3 chuyên đề",
  ]);
  await expect(dialog.locator(".module-list li")).toHaveCount(14);
  for (const toggle of await toggles.all()) await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Tab");
  await expect(toggles.first()).toBeFocused();
  expect(await toggles.first().evaluate(element => getComputedStyle(element).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(toggles.first()).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.locator(".module-list").first().locator("li")).toHaveCount(3);
  await expect(dialog.locator(".module-list").first()).toBeVisible();
  await page.keyboard.press("Space");
  await expect(dialog.locator(".module-list").first()).not.toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("program card/detail CTAs preselect the one form and hero resets the selection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("form")).toHaveCount(1);
  for (const program of programs) {
    const card = page.locator(".program-card").filter({ has: page.getByRole("heading", { name: program.name, exact: true }) });
    await card.locator(".program-card-bottom > a").click();
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    await expect(page.getByLabel("Tên phụ huynh")).toBeInViewport();
    await expect(page.getByRole("form", { name: "Đăng ký học thử" })).toBeFocused();
    await card.getByRole("button", { name: `Xem chi tiết chương trình ${program.name}`, exact: true }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Đăng ký học thử" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    await expect(page.getByRole("form", { name: "Đăng ký học thử" })).toBeFocused();
  }
  await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
  await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(undecidedProgram);
});

test("required and invalid phone errors are associated with fields and never submit", async ({ page }) => {
  let requests = 0;
  page.on("request", request => { if (request.url().endsWith("/api/leads")) requests++; });
  await page.goto("/");
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByLabel("Tên phụ huynh")).toBeFocused();
  for (const field of ["parentName", "phone", "childAge"]) {
    await expect(page.locator(`#${field}`)).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(`#${field}-error`)).toBeVisible();
  }
  await fillForm(page);
  await page.getByLabel("Số điện thoại").fill("123456");
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByLabel("Số điện thoại")).toBeFocused();
  expect(requests).toBe(0);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("loading prevents duplicate requests; confirmed success resets only after response", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const payloads: unknown[] = [];
  await page.route("**/api/leads", async route => {
    payloads.push(route.request().postDataJSON());
    await pending;
    await route.fulfill({ json: { success: true } });
  });
  await page.goto("/?utm_source=facebook&utm_medium=paid_social&utm_campaign=oct");
  await fillForm(page);
  await page.getByLabel("Chương trình quan tâm").selectOption("Starter Kit");
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByRole("button", { name: "Đang gửi..." })).toBeDisabled();
  await expect(page.getByLabel("Tên phụ huynh")).toHaveValue("Nguyễn Văn A");
  await page.locator("form").evaluate(form => {
    if (!(form instanceof HTMLFormElement)) throw new Error("Expected form element");
    form.requestSubmit(); form.requestSubmit();
  });
  await expect.poll(() => payloads.length).toBe(1);
  await expect(page.getByText(leadMessages.success, { exact: true })).toHaveCount(0);
  expect(payloads[0]).toEqual({
    parentName: "Nguyễn Văn A", phone: "0901234567", childAge: 9, program: "Starter Kit",
    sourcePage: "/", utmSource: "facebook", utmMedium: "paid_social", utmCampaign: "oct", website: "",
  });
  release();
  await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
  await expect(page.getByLabel("Tên phụ huynh")).toHaveValue("");
  await expect(page.getByLabel("Số điện thoại")).toHaveValue("");
  await expect(page.getByLabel("Tuổi của bé")).toHaveValue("");
  await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(undecidedProgram);
  await expect(page).toHaveURL(/utm_campaign=oct/);
  const stored = await page.evaluate(() => JSON.stringify({ session: { ...sessionStorage }, local: { ...localStorage } }));
  expect(stored).not.toContain("Nguyễn");
  expect(stored).not.toContain("0901234567");
});

test("API failure keeps inputs and enables a retry; false success is never accepted", async ({ page }) => {
  let count = 0;
  await page.route("**/api/leads", route => {
    count++;
    return route.fulfill({ status: count === 1 ? 500 : 200, json: { success: count > 2, error: "LEAD_SUBMISSION_FAILED" } });
  });
  await page.goto("/");
  await fillForm(page);
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
    await expect(page.getByText(leadMessages.failure, { exact: true })).toBeVisible();
    await expect(page.getByLabel("Tên phụ huynh")).toHaveValue("Nguyễn Văn A");
    await expect(page.getByLabel("Số điện thoại")).toHaveValue("+84 901 234 567");
    await expect(page.getByLabel("Tuổi của bé")).toHaveValue("9");
    await expect(page.getByRole("link", { name: "Liên hệ Facebook STEM Fighters" })).toHaveAttribute("href", facebook);
  }
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
  expect(count).toBe(3);
});

test("UTM survives same-site navigation and explicit new UTM replaces the previous campaign", async ({ page }) => {
  const payloads: Record<string, unknown>[] = [];
  await page.route("**/api/leads", route => { payloads.push(route.request().postDataJSON()); return route.fulfill({ json: { success: true } }); });
  await page.goto("/?utm_source=facebook&utm_medium=paid_social&utm_campaign=initial");
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("stem-fighters-attribution"))).toContain("initial");
  await page.goto("/#dang-ky");
  await fillForm(page);
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
  expect(payloads[0]).toMatchObject({ sourcePage: "/", utmSource: "facebook", utmMedium: "paid_social", utmCampaign: "initial" });
  await page.goto("/?utm_source=direct-campaign");
  await fillForm(page);
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
  expect(payloads[1]).toMatchObject({ sourcePage: "/", utmSource: "direct-campaign", utmMedium: "", utmCampaign: "" });
});

test("blocked session storage and network errors do not lose visible lead data", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage unavailable"); };
    Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); };
  });
  const warnings: string[] = [];
  page.on("console", message => { if (message.type() === "warning") warnings.push(message.text()); });
  let payload: Record<string, unknown> | undefined;
  await page.route("**/api/leads", route => { payload = route.request().postDataJSON(); return route.abort(); });
  await page.goto("/?utm_source=facebook");
  await fillForm(page);
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByText(leadMessages.failure, { exact: true })).toBeVisible();
  await expect(page.getByLabel("Tên phụ huynh")).toHaveValue("Nguyễn Văn A");
  expect(payload).toMatchObject({ utmSource: "facebook", utmMedium: "", utmCampaign: "" });
  expect(warnings.some(message => message.includes("Attribution"))).toBe(true);
});
