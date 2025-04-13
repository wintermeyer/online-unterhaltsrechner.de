import { test, expect } from '@playwright/test';

test.describe('Child Age Fields Tests', () => {
    test('should show additional fields when child age is 14 or older', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Get the age select element
        const ageSelect = await page.locator('#child-age-0');
        
        // Set age to 14
        await ageSelect.selectOption('14');
        
        // Verify additional fields are visible
        const additionalFields = await page.locator('.additional-fields-14');
        await expect(additionalFields).toBeVisible();
        
        // Verify all additional fields are present
        await expect(page.locator('#child-status-0')).toBeVisible();
        await expect(page.locator('#child-netto-0')).toBeVisible();
        await expect(page.locator('#child-sonstige-0')).toBeVisible();
    });

    test('should hide additional fields when child age is below 14', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // First set age to 14 to show fields
        const ageSelect = await page.locator('#child-age-0');
        await ageSelect.selectOption('14');
        
        // Then set age back to 13
        await ageSelect.selectOption('13');
        
        // Verify additional fields are hidden
        const additionalFields = await page.locator('.additional-fields-14');
        await expect(additionalFields).toBeHidden();
    });

    test('should include additional fields in share URL when child is 14 or older', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Set age to 14
        const ageSelect = await page.locator('#child-age-0');
        await ageSelect.selectOption('14');

        // Fill in additional fields
        await page.locator('#child-status-0').selectOption('student');
        await page.locator('#child-netto-0').fill('500');
        await page.locator('#child-sonstige-0').fill('100');

        // Get share URL
        const shareUrl = await page.locator('#share-url').inputValue();
        
        // Verify URL contains all fields
        expect(shareUrl).toContain('child-0-age=14');
        expect(shareUrl).toContain('child-0-status=student');
        expect(shareUrl).toContain('child-0-netto=500');
        expect(shareUrl).toContain('child-0-sonstige=100');
    });

    test('should not include additional fields in share URL when child is below 14', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Set age to 13
        const ageSelect = await page.locator('#child-age-0');
        await ageSelect.selectOption('13');

        // Get share URL
        const shareUrl = await page.locator('#share-url').inputValue();
        
        // Verify URL only contains basic fields
        expect(shareUrl).toContain('child-0-age=13');
        expect(shareUrl).not.toContain('child-0-status');
        expect(shareUrl).not.toContain('child-0-netto');
        expect(shareUrl).not.toContain('child-0-sonstige');
    });

    test('should load additional fields from URL when child is 14 or older', async ({ page }) => {
        // Navigate to URL with a 14-year-old child and additional fields
        await page.goto('/?child-0-age=14&child-0-residence=mutter&child-0-status=student&child-0-netto=500&child-0-sonstige=100');
        await page.waitForLoadState('networkidle');

        // Verify additional fields are visible and populated
        const additionalFields = await page.locator('.additional-fields-14');
        await expect(additionalFields).toBeVisible();
        
        await expect(page.locator('#child-status-0')).toHaveValue('student');
        await expect(page.locator('#child-netto-0')).toHaveValue('500');
        await expect(page.locator('#child-sonstige-0')).toHaveValue('100');
    });

    test('should not show additional fields when loading URL with child below 14', async ({ page }) => {
        // Navigate to URL with a 13-year-old child
        await page.goto('/?child-0-age=13&child-0-residence=mutter');
        await page.waitForLoadState('networkidle');

        // Verify additional fields are hidden
        const additionalFields = await page.locator('.additional-fields-14');
        await expect(additionalFields).toBeHidden();
    });
}); 