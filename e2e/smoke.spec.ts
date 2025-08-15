import { test, expect } from "@playwright/test";

test("dashboard shows value cards only", async ({ page }) => {
	await page.goto("http://localhost:3000/");
	await expect(page.getByText("Total Cost")).toBeVisible();
	await expect(page.getByText("Est Value")).toBeVisible();
	await expect(page.getByText("P/L")).toBeVisible();
});

test("portfolio grid renders tiles", async ({ page }) => {
	await page.goto("http://localhost:3000/portfolio");
	// Look for the grid container
	await expect(page.locator("div.grid")).toBeVisible();
});


