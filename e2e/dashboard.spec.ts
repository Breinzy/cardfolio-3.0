import { test, expect } from "@playwright/test";

test("dashboard renders summary", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByText("Total Cost")).toBeVisible();
});


