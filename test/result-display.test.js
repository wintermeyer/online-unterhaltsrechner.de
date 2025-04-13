const { test, expect } = require('@playwright/test');

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value || 0);
}

test.describe('Result Display Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should correctly display father results', async ({ page }) => {
        // Set values for father
        await page.fill('#vater-netto', '6000');
        await page.click('#toggle-additional-fields');
        await page.fill('#vater-sonstige', '1000');
        await page.fill('#vater-wohnvorteil', '500');
        await page.fill('#vater-schulden', '200');

        // Verify displayed values
        await expect(page.locator('#vater-netto-result')).toHaveText('6.000,00 €');
        await expect(page.locator('#vater-aufwände-result')).toHaveText('-150,00 €');
        await expect(page.locator('#vater-sonstige-result')).toHaveText('1.000,00 €');
        await expect(page.locator('#vater-wohnvorteil-result')).toHaveText('500,00 €');
        await expect(page.locator('#vater-schulden-result')).toHaveText('-200,00 €');
        await expect(page.locator('#vater-bereinigt-result')).toHaveText('7.150,00 €');
    });

    test('should correctly display mother results', async ({ page }) => {
        // Set values for mother
        await page.fill('#mutter-netto', '1000');
        await page.click('#toggle-additional-fields');
        await page.fill('#mutter-sonstige', '500');
        await page.fill('#mutter-wohnvorteil', '300');
        await page.fill('#mutter-schulden', '100');

        // Verify displayed values
        await expect(page.locator('#mutter-netto-result')).toHaveText('1.000,00 €');
        await expect(page.locator('#mutter-aufwände-result')).toHaveText('-50,00 €');
        await expect(page.locator('#mutter-sonstige-result')).toHaveText('500,00 €');
        await expect(page.locator('#mutter-wohnvorteil-result')).toHaveText('300,00 €');
        await expect(page.locator('#mutter-schulden-result')).toHaveText('-100,00 €');
        await expect(page.locator('#mutter-bereinigt-result')).toHaveText('1.650,00 €');
    });

    test('should handle zero values correctly', async ({ page }) => {
        // Set some values to zero
        await page.fill('#vater-netto', '0');
        await page.fill('#mutter-netto', '0');
        await page.click('#toggle-additional-fields');
        await page.fill('#vater-sonstige', '0');
        await page.fill('#mutter-sonstige', '0');

        // Verify zero values are not displayed
        await expect(page.locator('#vater-netto-result').locator('..')).toHaveCSS('display', 'none');
        await expect(page.locator('#mutter-netto-result').locator('..')).toHaveCSS('display', 'none');
        await expect(page.locator('#vater-sonstige-result').locator('..')).toHaveCSS('display', 'none');
        await expect(page.locator('#mutter-sonstige-result').locator('..')).toHaveCSS('display', 'none');
    });

    test('should update both parents results simultaneously', async ({ page }) => {
        // Set values for both parents
        await page.fill('#vater-netto', '3000');
        await page.fill('#mutter-netto', '2000');
        await page.click('#toggle-additional-fields');
        await page.fill('#vater-sonstige', '500');
        await page.fill('#mutter-sonstige', '300');

        // Verify both results are updated
        await expect(page.locator('#vater-netto-result')).toHaveText('3.000,00 €');
        await expect(page.locator('#mutter-netto-result')).toHaveText('2.000,00 €');
        await expect(page.locator('#vater-aufwände-result')).toHaveText('-150,00 €');
        await expect(page.locator('#mutter-aufwände-result')).toHaveText('-100,00 €');
        await expect(page.locator('#vater-sonstige-result')).toHaveText('500,00 €');
        await expect(page.locator('#mutter-sonstige-result')).toHaveText('300,00 €');
        await expect(page.locator('#vater-bereinigt-result')).toHaveText('3.350,00 €');
        await expect(page.locator('#mutter-bereinigt-result')).toHaveText('2.200,00 €');
    });
}); 