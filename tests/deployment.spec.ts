import { expect, test } from "@playwright/test";

test("public HTTP redirects to HTTPS while preserving attribution", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "HTTP behavior is independent of viewport");
  const response = await request.get("/?utm_source=qa&utm_campaign=homepage", {
    headers: { host: "fightersacademy.com.vn", "x-forwarded-proto": "http" },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(308);
  expect(new URL(response.headers().location).toString()).toBe("https://fightersacademy.com.vn/?utm_source=qa&utm_campaign=homepage");
  const secureResponse = await request.get("/", {
    headers: { host: "fightersacademy.com.vn", "x-forwarded-proto": "https" },
    maxRedirects: 0,
  });
  expect(secureResponse.status()).toBe(200);
});
