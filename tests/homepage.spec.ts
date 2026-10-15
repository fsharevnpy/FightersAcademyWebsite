import { expect, test } from "@playwright/test";

test("homepage loads all four programs without overflow or broken images", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/STEM Fighters/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".program-card")).toHaveCount(4);
  for (const name of ["Rio", "Starter Kit", "Lập trình", "Điện tử cơ bản"]) {
    await expect(page.locator(".program-card").getByRole("heading", { name, exact: true })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
  expect(errors).toEqual([]);
  await page.evaluate(async () => { await document.fonts.ready; window.scrollTo({ top: 0, behavior: "instant" }); });
  await expect(page.locator("h1")).toBeInViewport();
  await page.screenshot({ path: `test-results/hero-${testInfo.project.name}.png` });
  await page.screenshot({ path: `test-results/homepage-${testInfo.project.name}.png`, fullPage: true });
});

test("layout fits small phones, tablet and desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Viewport sweep uses the desktop browser");
  await page.goto("/");
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow at ${width}px`).toBe(true);
  }
});

test("each program opens its own curriculum and closes accessibly", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Rio", "Starter Kit", "Lập trình", "Điện tử cơ bản"]) {
    const trigger = page.getByRole("button", { name: `Khám phá chương trình ${name}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(dialog.locator(".module-list li").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("FAQ reveals answers and the trial CTA reaches honest pending information", async ({ page }) => {
  await page.goto("/");
  const question = page.getByText("Con chưa từng học lập trình có thể bắt đầu từ đâu?", { exact: true });
  await question.click();
  await expect(page.locator("details[open]")).toContainText("Không yêu cầu kiến thức trước", { ignoreCase: true });
  await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
  await expect(page).toHaveURL(/#dang-ky$/);
  await expect(page.getByRole("heading", { name: "Thông tin đăng ký học thử" })).toBeInViewport();
  await expect(page.locator("#dang-ky")).toContainText("[CẦN BỔ SUNG]");
  await expect(page.locator("form")).toHaveCount(0);
});

test("mobile menu and sticky CTA behave correctly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "Collapsed navigation only");
  await page.goto("/");
  await expect(page.locator(".mobile-cta")).not.toBeVisible();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("navigation", { name: "Điều hướng di động" })).toBeVisible();
  await page.getByRole("navigation", { name: "Điều hướng di động" }).getByRole("link", { name: "Chương trình học" }).click();
  await expect(page.getByRole("button", { name: "Mở menu" })).toHaveAttribute("aria-expanded", "false");
  // Wait for anchor smooth scrolling to finish before opening the sticky menu again.
  const anchorOffset = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  await expect.poll(() => page.locator("#chuong-trinh").evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThanOrEqual(anchorOffset + 2);
  if (testInfo.project.name === "mobile") await expect(page.locator(".mobile-cta")).toBeVisible();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.locator(".mobile-cta")).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Mở menu" })).toBeFocused();
  if (testInfo.project.name === "mobile") {
    await page.locator(".mobile-cta").getByRole("link").click();
  } else {
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.getByRole("navigation", { name: "Điều hướng di động" }).getByRole("link", { name: "Đăng ký học thử" }).click();
  }
  await expect(page.getByRole("heading", { name: "Thông tin đăng ký học thử" })).toBeInViewport();
  await expect(page.locator(".mobile-cta")).not.toBeVisible();
});
