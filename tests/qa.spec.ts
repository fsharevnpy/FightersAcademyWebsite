import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";

test("QA: runtime, accessibility, images, layout and performance", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.addInitScript(() => {
    const metrics = { cls: 0, lcp: 0 };
    Object.assign(window, { qaMetrics: metrics });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) metrics.cls += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main")).toHaveCount(1);
  const findings = [];
  findings.push({ state: "homepage", result: await new AxeBuilder({ page }).options({ rules: { "label-content-name-mismatch": { enabled: true } } }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze() });
  for (const selector of [".hero", "#chuong-trinh", "#cach-hoc", "#hoat-dong", "#cau-hoi", "#dang-ky", "footer"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
  const images = await page.locator("img").evaluateAll(images => images.filter((img): img is HTMLImageElement => img instanceof HTMLImageElement).map(img => ({ alt: img.alt, src: img.currentSrc, width: img.clientWidth, height: img.clientHeight, loading: img.loading })));
  const metrics = await page.evaluate(() => ({
    ...(window as Window & { qaMetrics?: { cls: number; lcp: number } }).qaMetrics,
    scripts: performance.getEntriesByType("resource").filter(entry => (entry as PerformanceResourceTiming).initiatorType === "script").map(entry => ({ url: entry.name, bytes: (entry as PerformanceResourceTiming).encodedBodySize })),
  }));
  await page.getByRole("button", { name: "Khám phá chương trình Rio", exact: true }).click();
  findings.push({ state: "dialog", result: await new AxeBuilder({ page }).options({ rules: { "label-content-name-mismatch": { enabled: true } } }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze() });
  await page.keyboard.press("Escape");
  if (testInfo.project.name !== "desktop") {
    await page.getByRole("button", { name: "Mở menu" }).click();
    findings.push({ state: "menu", result: await new AxeBuilder({ page }).options({ rules: { "label-content-name-mismatch": { enabled: true } } }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze() });
    await page.keyboard.press("Escape");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  expect(await page.locator(".program-card").first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/qa-${testInfo.project.name}.png`, fullPage: true });
  for (const [name, selector] of [["hero", ".hero"], ["programs", "#chuong-trinh"], ["footer", "footer"]]) {
    await page.locator(selector).screenshot({ path: `test-results/qa-${testInfo.project.name}-${name}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
  }
  const violations = findings.flatMap(({ state, result }) => result.violations.map(v => ({ state, rule: v.id, impact: v.impact, nodes: v.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })));
  await writeFile(`test-results/qa-${testInfo.project.name}.json`, JSON.stringify({ metrics, images, errors, violations }, null, 2));
  expect(errors).toEqual([]);
  expect(metrics.cls).toBeLessThanOrEqual(0.1);
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("QA: keyboard navigation, focus containment and hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Chuyển đến nội dung chính" })).toBeFocused();
  await page.keyboard.press("Enter");
  const trigger = page.getByRole("button", { name: "Khám phá chương trình Starter Kit", exact: true });
  await trigger.focus();
  expect(await trigger.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Đóng thông tin chương trình" })).toBeFocused();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.locator(".faq-list summary").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faq-list details").first()).toHaveAttribute("open", "");
  const button = page.locator("#hero-actions .button--primary");
  await button.hover();
  expect(await button.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(6, 75, 194)");
});
