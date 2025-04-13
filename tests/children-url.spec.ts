import { test, expect } from '@playwright/test';

test.describe('Children URL Tests', () => {
    test('should always include at least one child in URL', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Set some values but don't add any children (one should be there by default)
        await page.fill('#vater-netto', '3000');
        await page.fill('#mutter-netto', '2000');

        // Get share URL and verify it contains the default child parameters
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).toContain('child-0-age=0');
        expect(shareUrl).toContain('child-0-residence=mutter');
    });

    test('should handle URL with one child', async ({ page }) => {
        // Navigate to URL with one child
        await page.goto('/?vater-netto=3000&mutter-netto=2000&child-0-age=5&child-0-residence=vater');
        await page.waitForLoadState('networkidle');

        // Verify child form is populated correctly
        const ageSelect = await page.locator('#child-age-0');
        const residenceInput = await page.locator('#child-residence-vater-0');

        await expect(ageSelect).toHaveValue('5');
        await expect(residenceInput).toBeChecked();
    });

    test('should handle URL with multiple children', async ({ page }) => {
        // Navigate to URL with multiple children
        await page.goto('/?vater-netto=4000&mutter-netto=3000&child-0-age=3&child-0-residence=mutter&child-1-age=7&child-1-residence=5050&child-2-age=12&child-2-residence=other');
        await page.waitForLoadState('networkidle');

        // Verify all child forms are present
        const childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(3);

        // Verify first child
        await expect(page.locator('#child-age-0')).toHaveValue('3');
        await expect(page.locator('#child-residence-mutter-0')).toBeChecked();

        // Verify second child
        await expect(page.locator('#child-age-1')).toHaveValue('7');
        await expect(page.locator('#child-residence-5050-1')).toBeChecked();

        // Verify third child
        await expect(page.locator('#child-age-2')).toHaveValue('12');
        await expect(page.locator('#child-residence-other-2')).toBeChecked();
    });

    test('should update URL when removing children', async ({ page }) => {
        // Start with multiple children
        await page.goto('/?child-0-age=3&child-0-residence=mutter&child-1-age=7&child-1-residence=5050&child-2-age=12&child-2-residence=other');
        await page.waitForLoadState('networkidle');

        // Remove the second child
        const removeButtons = await page.$$('.remove-child');
        await removeButtons[1].click();

        // Get updated URL
        const updatedUrl = await page.locator('#share-url').inputValue();
        expect(updatedUrl).toContain('child-0-age=3');
        expect(updatedUrl).toContain('child-0-residence=mutter');
        expect(updatedUrl).toContain('child-1-age=12');
        expect(updatedUrl).toContain('child-1-residence=other');
        expect(updatedUrl).not.toContain('child-2-age');
    });

    test('should update URL immediately when adding or removing children', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Get initial URL and verify it has the default child
        const initialUrl = await page.locator('#share-url').inputValue();
        expect(initialUrl).toContain('child-0-age=0');
        expect(initialUrl).toContain('child-0-residence=mutter');

        // Add a second child and verify URL updates immediately
        const addButton = await page.$('#add-child-button');
        expect(addButton).not.toBeNull();
        await addButton?.click();

        const urlAfterAdd = await page.locator('#share-url').inputValue();
        expect(urlAfterAdd).toContain('child-0-age=0');
        expect(urlAfterAdd).toContain('child-0-residence=mutter');
        expect(urlAfterAdd).toContain('child-1-age=0');
        expect(urlAfterAdd).toContain('child-1-residence=mutter');

        // Remove the second child and verify URL updates immediately
        const removeButtons = await page.$$('.remove-child');
        await removeButtons[1].click();

        const urlAfterRemove = await page.locator('#share-url').inputValue();
        expect(urlAfterRemove).toContain('child-0-age=0');
        expect(urlAfterRemove).toContain('child-0-residence=mutter');
        expect(urlAfterRemove).not.toContain('child-1-age');
        expect(urlAfterRemove).not.toContain('child-1-residence');
    });
}); 