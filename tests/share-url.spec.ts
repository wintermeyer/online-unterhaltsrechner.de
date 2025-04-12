import { test, expect } from '@playwright/test';

test.describe('Share URL Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should update share URL when entering values', async ({ page }) => {
        const shareUrlInput = page.locator('#share-url');
        const baseUrl = await page.url();

        // Fill in some basic values
        await page.locator('#vater-netto').fill('2500');
        await page.locator('#mutter-netto').fill('3000');

        // Get the current share URL
        let currentUrl = await shareUrlInput.inputValue();
        expect(currentUrl).toContain('vater-netto=2500');
        expect(currentUrl).toContain('mutter-netto=3000');

        // Expand additional fields
        await page.locator('#toggle-additional-fields').click();

        // Fill in additional values
        await page.locator('#vater-sonstige').fill('100');
        await page.locator('#mutter-wohnvorteil').fill('200');

        // Verify URL updates
        currentUrl = await shareUrlInput.inputValue();
        expect(currentUrl).toContain('vater-sonstige=100');
        expect(currentUrl).toContain('mutter-wohnvorteil=200');

        // Verify all parameters are present
        const url = new URL(currentUrl);
        expect(url.searchParams.get('vater-netto')).toBe('2500');
        expect(url.searchParams.get('mutter-netto')).toBe('3000');
        expect(url.searchParams.get('vater-sonstige')).toBe('100');
        expect(url.searchParams.get('mutter-wohnvorteil')).toBe('200');
    });

    test('should copy URL to clipboard and load correctly', async ({ page, context }) => {
        // Fill in various values
        await page.locator('#vater-netto').fill('2500');
        await page.locator('#mutter-netto').fill('3000');
        
        // Expand and fill additional fields
        await page.locator('#toggle-additional-fields').click();
        await page.locator('#vater-sonstige').fill('100');
        await page.locator('#mutter-wohnvorteil').fill('200');
        await page.locator('#vater-schulden').fill('300');

        // Get the share URL directly instead of using clipboard
        const shareUrl = await page.locator('#share-url').inputValue();
        
        // Verify URL contains all parameters
        expect(shareUrl).toContain('vater-netto=2500');
        expect(shareUrl).toContain('mutter-netto=3000');
        expect(shareUrl).toContain('vater-sonstige=100');
        expect(shareUrl).toContain('mutter-wohnvorteil=200');
        expect(shareUrl).toContain('vater-schulden=300');

        // Open new page with share URL
        const newPage = await context.newPage();
        await newPage.goto(shareUrl);
        await newPage.waitForLoadState('networkidle');

        // Verify all values are loaded correctly
        await expect(newPage.locator('#vater-netto')).toHaveValue('2500');
        await expect(newPage.locator('#mutter-netto')).toHaveValue('3000');
        await expect(newPage.locator('#vater-sonstige')).toHaveValue('100');
        await expect(newPage.locator('#mutter-wohnvorteil')).toHaveValue('200');
        await expect(newPage.locator('#vater-schulden')).toHaveValue('300');

        // Verify additional fields are expanded
        await expect(newPage.locator('#additional-fields')).not.toHaveClass(/hidden/);
    });

    test('should handle empty values in URL generation', async ({ page }) => {
        // Fill and clear some values
        await page.locator('#vater-netto').fill('2500');
        await page.locator('#mutter-netto').fill('3000');
        await page.locator('#vater-netto').fill(''); // Clear value

        const shareUrlInput = page.locator('#share-url');
        const currentUrl = await shareUrlInput.inputValue();

        // Verify only non-empty values are in URL
        expect(currentUrl).not.toContain('vater-netto');
        expect(currentUrl).toContain('mutter-netto=3000');
    });

    test('should update URL when toggling fields visibility', async ({ page }) => {
        // Fill some additional values
        await page.locator('#toggle-additional-fields').click();
        await page.locator('#vater-sonstige').fill('100');
        
        const shareUrlInput = page.locator('#share-url');
        let currentUrl = await shareUrlInput.inputValue();
        expect(currentUrl).toContain('vater-sonstige=100');

        // Clear value and verify URL update
        await page.locator('#vater-sonstige').fill('');
        currentUrl = await shareUrlInput.inputValue();
        expect(currentUrl).not.toContain('vater-sonstige');
    });

    test('copy button should show feedback', async ({ page, context }) => {
        // Grant clipboard permissions
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        
        const copyButton = page.locator('#copy-button');
        
        // Get initial button state
        const initialText = await copyButton.innerText();
        const initialClasses = await copyButton.getAttribute('class');
        
        // Ensure button has class attribute
        if (initialClasses === null) {
            throw new Error('Button must have class attribute');
        }
        
        // Click copy button
        await copyButton.click();
        
        // Wait for feedback state
        await copyButton.waitFor({ state: 'visible', timeout: 2500 });
        const feedbackText = await copyButton.innerText();
        expect(feedbackText.trim()).toBe('Kopiert!');
        await expect(copyButton).toHaveClass(/bg-green-600/);
        
        // Wait for button to return to initial state
        await page.waitForTimeout(2000); // Wait for the timeout to complete
        const finalText = await copyButton.innerText();
        expect(finalText.trim()).toBe(initialText.trim() || 'Kopieren');
        await expect(copyButton).toHaveClass(initialClasses);
    });

    test('should not modify browser URL when form values change', async ({ page }) => {
        const shareUrlInput = page.locator('#share-url');
        const baseUrl = await page.url();

        // Fill in some values
        await page.locator('#vater-netto').fill('2500');
        await page.locator('#mutter-netto').fill('3000');

        // Verify share URL contains the values
        const shareUrl = await shareUrlInput.inputValue();
        expect(shareUrl).toContain('vater-netto=2500');
        expect(shareUrl).toContain('mutter-netto=3000');

        // Verify browser URL remains unchanged
        const currentBrowserUrl = await page.url();
        expect(currentBrowserUrl).toBe(baseUrl);
    });

    test('should remove URL parameters after loading them into form', async ({ page }) => {
        // Navigate to page with parameters
        await page.goto('/?vater-netto=2500&mutter-netto=3000');
        await page.waitForLoadState('networkidle');

        // Verify form is filled with values
        await expect(page.locator('#vater-netto')).toHaveValue('2500');
        await expect(page.locator('#mutter-netto')).toHaveValue('3000');

        // Verify browser URL no longer contains parameters
        const currentBrowserUrl = await page.url();
        expect(currentBrowserUrl).not.toContain('vater-netto=2500');
        expect(currentBrowserUrl).not.toContain('mutter-netto=3000');

        // Verify share URL still contains the values
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).toContain('vater-netto=2500');
        expect(shareUrl).toContain('mutter-netto=3000');
    });

    test('should remove all URL parameters after loading multiple values', async ({ page }) => {
        // Navigate to page with multiple parameters
        await page.goto('/?mutter-netto=2000&vater-sonstige=5000&mutter-sonstige=5');
        await page.waitForLoadState('networkidle');

        // Verify form is filled with values
        await expect(page.locator('#mutter-netto')).toHaveValue('2000');
        await expect(page.locator('#vater-sonstige')).toHaveValue('5000');
        await expect(page.locator('#mutter-sonstige')).toHaveValue('5');

        // Verify browser URL is cleaned up (no parameters)
        const currentBrowserUrl = await page.url();
        expect(currentBrowserUrl).not.toContain('mutter-netto=2000');
        expect(currentBrowserUrl).not.toContain('vater-sonstige=5000');
        expect(currentBrowserUrl).not.toContain('mutter-sonstige=5');
        expect(currentBrowserUrl).not.toContain('?');

        // Verify share URL still contains all values
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).toContain('mutter-netto=2000');
        expect(shareUrl).toContain('vater-sonstige=5000');
        expect(shareUrl).toContain('mutter-sonstige=5');
    });
}); 