import { expect, test } from "@playwright/test";
import { access, stat } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import AxeBuilder from "@axe-core/playwright";
import { courseMedia, getCourseRepresentative } from "../content/media";
import { getProgramPath, programs } from "../content/programs";
import { leadPrograms, validateLead } from "../lib/leads";

test("representative images and short clips are optimized, with original media retained", async () => {
  for (const program of programs) {
    const representative = getCourseRepresentative(program.id);
    const imagePath = resolve("public", ...representative.src.slice(1).split("/"));
    const metadata = await sharp(imagePath).metadata();
    expect(metadata.width).toBe(representative.width);
    expect(metadata.height).toBe(representative.height);
    expect(metadata.exif).toBeUndefined();
    expect((await stat(imagePath)).size).toBeLessThan(200 * 1024);
    const media = courseMedia[program.id];
    if (!media) continue;
    await access(resolve(...media.representative.original.split("/")));
    await access(resolve(...media.video.original.split("/")));
    expect((await stat(resolve("public", ...media.video.src.slice(1).split("/")))).size).toBeLessThan(1.5 * 1024 * 1024);
    expect((await stat(resolve("public", ...media.video.poster.slice(1).split("/")))).size).toBeLessThan(150 * 1024);
    expect(media.photos.length).toBe(program.id === "rio" ? 3 : 4);
    expect(new Set(media.photos.map(photo => photo.src)).size).toBe(media.photos.length);
    for (const photo of media.photos) {
      await access(resolve(...photo.original.split("/")));
      const photoPath = resolve("public", ...photo.src.slice(1).split("/"));
      const metadata = await sharp(photoPath).metadata();
      expect(metadata.format).toBe("webp");
      expect(Math.max(metadata.width!, metadata.height!)).toBeLessThanOrEqual(1280);
      expect(metadata.exif).toBeUndefined();
      expect((await stat(photoPath)).size).toBeLessThan(200 * 1024);
    }
  }
});

test("legacy names normalize to current names and all previous URLs redirect directly", async ({ request }) => {
  const expected = [
    { name: "Tư duy lập trình STEM", path: "/khoa-hoc/tu-duy-lap-trinh-stem", names: ["Rio", "Khám phá robot"], slugs: ["rio", "kham-pha-robot"] },
    { name: "Kỹ sư Công nghệ STEM nhí", path: "/khoa-hoc/ky-su-cong-nghe-stem-nhi", names: ["Starter Kit", "Sáng tạo & Chế tạo"], slugs: ["starter-kit", "sang-tao-che-tao"] },
    { name: "Lập trình sáng tạo STEM", path: "/khoa-hoc/lap-trinh-sang-tao-stem", names: ["Tư duy logic & Lập trình"], slugs: ["tu-duy-logic-lap-trinh"] },
    { name: "Điện tử & Robot thông minh", path: "/khoa-hoc/dien-tu-robot-thong-minh", names: ["Điện tử cơ bản"], slugs: ["dien-tu-co-ban"] },
  ];
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const course of expected) {
    expect(leadPrograms).toContain(course.name);
    for (const name of course.names) {
      expect(leadPrograms).not.toContain(name);
      const result = validateLead({ parentName: "TEST MIGRATION", phone: "0901234567", childAge: 9, program: name, sourcePage: "/" });
      expect(result.success && result.data.program).toBe(course.name);
    }
    for (const slug of course.slugs) {
      const response = await request.get(`/khoa-hoc/${slug}?utm_source=legacy`, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(response.headers().location).toBe(`${course.path}?utm_source=legacy`);
      expect(sitemap).not.toContain(`/khoa-hoc/${slug}</loc>`);
    }
    expect(sitemap).toContain(`${course.path}</loc>`);
  }
});

for (const program of programs) {
  test(`${program.id}: only confirmed course photos appear, with accessible full-image viewing`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(getProgramPath(program));
    const gallery = page.locator(".course-gallery");
    const media = courseMedia[program.id];
    if (!media) {
      await expect(gallery).toHaveCount(0);
      return;
    }
    await expect(gallery).toHaveCount(1);
    await expect(gallery.locator("figure")).toHaveCount(media.photos.length);
    const triggers = gallery.getByRole("button", { name: /^Phóng to ảnh:/ });
    await expect(triggers).toHaveCount(media.photos.length);
    for (const [index, photo] of media.photos.entries()) {
      const image = triggers.nth(index).locator("img");
      await expect(image).toHaveAttribute("alt", photo.alt);
      await expect(image).toHaveAttribute("loading", "lazy");
      await expect(image).toHaveAttribute("src", new RegExp(encodeURIComponent(photo.src)));
    }
    await expect(page.locator(".course-practice-photo")).toHaveCount(0);
    await triggers.first().scrollIntoViewIfNeeded();
    const previousOverflow = await page.locator("body").evaluate(body => body.style.overflow);
    await triggers.first().focus();
    await expect(triggers.first()).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    const viewer = page.getByRole("dialog", { name: `Hình ảnh hoạt động: ${program.name}`, exact: true });
    await expect(viewer).toBeVisible();
    const close = viewer.getByRole("button", { name: "Đóng ảnh", exact: true });
    await expect(close).toBeFocused();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await expect(page.locator(".mobile-cta")).toBeHidden();
    const fullImage = viewer.locator("img");
    await expect(fullImage).toHaveCSS("object-fit", "contain");
    await expect(fullImage).toHaveAttribute("alt", media.photos[0].alt);
    await expect.poll(() => fullImage.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
    await page.keyboard.press("Shift+Tab");
    await expect(viewer.getByRole("button", { name: "Ảnh tiếp theo", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(fullImage).toHaveAttribute("alt", media.photos.at(-1)!.alt);
    await viewer.getByRole("button", { name: "Ảnh tiếp theo", exact: true }).click();
    await expect(fullImage).toHaveAttribute("alt", media.photos[0].alt);
    await page.keyboard.press("ArrowRight");
    await expect(fullImage).toHaveAttribute("alt", media.photos[1].alt);
    await expect(viewer.locator("figcaption")).toContainText(`2/${media.photos.length}`);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(viewer).not.toBeVisible();
    await expect(triggers.first()).toBeFocused();
    expect(await page.locator("body").evaluate(body => body.style.overflow)).toBe(previousOverflow);
    await triggers.last().click();
    await expect(fullImage).toHaveAttribute("alt", media.photos.at(-1)!.alt);
    await close.click();
    await expect(triggers.last()).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-dialog-open", "true");
    expect(errors).toEqual([]);
  });

  test(`${program.id}: representative matches the course and playback only starts on demand`, async ({ page }) => {
    const requests: string[] = [];
    const errors: string[] = [];
    page.on("request", request => { if (request.url().includes("/videos/")) requests.push(request.url()); });
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(getProgramPath(program));
    await expect(page.locator("h1")).toHaveText(program.name);
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    const representative = getCourseRepresentative(program.id);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new RegExp(representative.src.replaceAll(".", "\\.") + "$"));
    const media = courseMedia[program.id];
    if (!media) {
      await expect(page.locator(".course-art svg")).toHaveCount(1);
      await expect(page.locator("video")).toHaveCount(0);
      return;
    }
    await expect(page.locator(".course-art img")).toHaveAttribute("alt", media.representative.alt);
    const button = page.getByRole("button", { name: `Xem video: ${media.video.caption}`, exact: true });
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    await expect(page.locator(".course-example video")).toHaveCount(0);
    const video = page.locator("video");
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).not.toHaveAttribute("src", /.+/);
    expect(requests).toEqual([]);
    await button.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(video).toHaveAttribute("src", media.video.src);
    await expect(video).toBeFocused();
    await expect.poll(() => video.evaluate(element => element instanceof HTMLVideoElement && element.currentTime > 0 && !element.paused)).toBe(true);
    const info = await video.evaluate(element => {
      if (!(element instanceof HTMLVideoElement)) throw new Error("Expected video");
      return { duration: element.duration, width: element.videoWidth, muted: element.muted, controls: element.controls, autoplay: element.autoplay, loop: element.loop, playsInline: element.playsInline };
    });
    expect(info.duration).toBeCloseTo(media.video.duration, 0);
    expect(info.width).toBeLessThanOrEqual(960);
    expect(info).toMatchObject({ muted: true, controls: true, autoplay: false, loop: false, playsInline: true });
    await video.evaluate(element => { if (element instanceof HTMLVideoElement) element.pause(); });
    await expect.poll(() => video.evaluate(element => element instanceof HTMLVideoElement && element.paused)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("video failure is visible and offers a real file link", async ({ page }) => {
  await page.route("**/videos/*.mp4", route => route.fulfill({ status: 404, body: "Not found" }));
  await page.goto(getProgramPath(programs[0]));
  await page.locator(".practice-video-start").click();
  await expect(page.locator(".practice-video").getByRole("alert")).toContainText("Không phát được video.");
  await expect(page.getByRole("link", { name: "Mở video trực tiếp", exact: true })).toHaveAttribute("href", courseMedia.rio!.video.src);
});

test("four equally sized representatives and course media fit phone, tablet and desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One six-width sweep");
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const representatives = page.locator(".program-card > .program-visual");
    await expect(representatives).toHaveCount(4);
    const boxes = await representatives.evaluateAll(elements => elements.map(element => ({ width: Math.round(element.getBoundingClientRect().width), height: element.getBoundingClientRect().height })));
    expect(new Set(boxes.map(box => box.height)).size).toBe(1);
    expect(new Set(boxes.map(box => box.width)).size).toBe(1);
    expect(boxes[0].height).toBe(140);
    await expect(page.locator(".program-card img")).toHaveCount(2);
    await expect(page.locator(".program-card svg.program-art")).toHaveCount(2);
    await expect(page.locator("#hoat-dong figure")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([390, 768, 1440].includes(width)) await page.locator("#chuong-trinh").screenshot({ path: `test-results/course-cards-${width}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
    for (const program of programs.filter(program => courseMedia[program.id])) {
      await page.goto(getProgramPath(program));
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if ([390, 768, 1440].includes(width)) {
        await page.locator(".course-gallery").screenshot({ path: `test-results/gallery-${program.id}-${width}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
        await page.locator(".course-hero").screenshot({ path: `test-results/media-${program.id}-${width}-hero.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
        await page.locator(".course-intro-grid").screenshot({ path: `test-results/media-${program.id}-${width}-practice.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
      }
    }
  }
});
