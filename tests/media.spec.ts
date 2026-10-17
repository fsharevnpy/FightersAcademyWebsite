import { expect, test } from "@playwright/test";
import { access, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { activityPhotos, learningExamplePhoto, learningProcessPhotos } from "../content/media";

test("selected activity photos retain originals and use compact local assets", async () => {
  const selected = [...activityPhotos, learningExamplePhoto];
  expect(new Set(selected.map(photo => photo.src)).size).toBe(7);
  let totalBytes = 0;
  for (const photo of selected) {
    await access(resolve(...photo.original.split("/")));
    expect(photo.src).toMatch(/^\/images\/activity-[a-z-]+\.webp$/);
    const asset = await stat(resolve("public", ...photo.src.slice(1).split("/")));
    expect(asset.size).toBeLessThan(200 * 1024);
    totalBytes += asset.size;
  }
  expect(totalBytes).toBeLessThan(800 * 1024);
});

test("general activity gallery stays compact with responsive columns and lazy photos", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const gallery = page.locator("#hoat-dong");
  await expect(gallery.getByRole("heading", { name: "Hoạt động tại STEM Fighters", exact: true })).toBeVisible();
  await expect(gallery).toContainText("Một vài khoảnh khắc trong các lớp học, hoạt động trải nghiệm và quá trình thực hành của học viên tại STEM Fighters.");
  await expect(gallery).not.toContainText(/workshop|giải thưởng|cuộc thi/i);
  await expect(gallery.locator("figure")).toHaveCount(6);
  await expect(gallery.getByRole("button")).toHaveCount(0);
  for (const photo of activityPhotos) {
    const image = gallery.getByRole("img", { name: photo.alt, exact: true });
    await expect(image).toHaveAttribute("loading", "lazy");
    await expect(image).toHaveAttribute("sizes", /768px/);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  }
  const layout = await gallery.locator(".activity-grid").evaluate(element => ({
    columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
    height: element.getBoundingClientRect().height,
    width: window.innerWidth,
  }));
  expect(layout.columns).toBe(layout.width < 768 ? 2 : 3);
  expect(layout.height).toBeLessThan(layout.width < 768 ? 560 : 700);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("real learning photos stay separate from course curriculum examples", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const examples = page.getByRole("region", { name: "Học để làm được" });
  await expect(examples.getByRole("img", { name: learningExamplePhoto.alt, exact: true })).toHaveAttribute("loading", "lazy");
  await expect(examples.locator(".example-photo")).toContainText("Ảnh hoạt động tại STEM Fighters, không gắn với ví dụ giáo trình cụ thể.");
  await expect(examples.locator(".example-card")).toHaveCount(0);
  await expect(examples).toContainText("Khám phá ví dụ thực hành và lộ trình tại trang chi tiết của từng chương trình.");
  await expect(page.locator("#cach-hoc .process-step")).toHaveCount(4);
  await expect(page.locator("#cach-hoc img")).toHaveCount(2);
  for (const photo of learningProcessPhotos) {
    await expect(page.locator("#cach-hoc").getByRole("img", { name: photo.alt, exact: true })).toHaveAttribute("loading", "lazy");
  }
  await expect(page.locator(".program-card img")).toHaveCount(2);
  await expect(page.locator(".program-card .program-visual svg")).toHaveCount(2);
  await expect(page.locator(".hero img")).toHaveCount(1);
  await expect(page.locator(".hero img")).toHaveAttribute("loading", "eager");
  if (page.viewportSize()!.width >= 1024) {
    expect(await page.locator("#cach-hoc").evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(850);
    expect(await examples.evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(900);
  }
});
