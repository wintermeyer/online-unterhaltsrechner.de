import { test, expect } from '@playwright/test';

test.describe('Bereinigtes Einkommen Display Tests', () => {
    test('should always display both Bereinigtes Einkommen fields with zero values', async ({ page }) => {
        // Navigate to the application
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // No need to set values, should be visible by default
        await page.waitForTimeout(200); // Allow time for initial rendering

        // Verify both Bereinigtes Einkommen fields are visible with default zero values
        const vaterBereinigtElement = page.locator('#vater-bereinigt-result').locator('..');
        const mutterBereinigtElement = page.locator('#mutter-bereinigt-result').locator('..');

        await expect(vaterBereinigtElement).toBeVisible();
        await expect(mutterBereinigtElement).toBeVisible();
        
        // Check text content of labels
        await expect(vaterBereinigtElement.locator('p').first()).toHaveText('Bereinigtes Einkommen:');
        await expect(mutterBereinigtElement.locator('p').first()).toHaveText('Bereinigtes Einkommen:');
        
        // Verify values show zero
        const vaterBereinigtValue = await page.locator('#vater-bereinigt-result').textContent();
        const mutterBereinigtValue = await page.locator('#mutter-bereinigt-result').textContent();
        
        expect(vaterBereinigtValue).toContain('0,00');
        expect(mutterBereinigtValue).toContain('0,00');
    });

    test('should display Bereinigtes Einkommen fields with different value combinations', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test case 1: Only father has income
        await page.fill('#vater-netto', '1000');
        await page.fill('#mutter-netto', '0');
        await page.waitForTimeout(200); // Allow time for calculations
        
        // Both fields should always be visible
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
        
        // Check mother's field has zero value
        const mutterBereinigtValue1 = await page.locator('#mutter-bereinigt-result').textContent();
        expect(mutterBereinigtValue1).toContain('0,00');
        
        // Test case 2: Only mother has income
        await page.fill('#vater-netto', '0');
        await page.fill('#mutter-netto', '1000');
        await page.waitForTimeout(200);
        
        // Both fields should always be visible
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
        
        // Check father's field has zero value
        const vaterBereinigtValue2 = await page.locator('#vater-bereinigt-result').textContent();
        expect(vaterBereinigtValue2).toContain('0,00');

        // Test case 3: Both have income
        await page.fill('#vater-netto', '2000');
        await page.fill('#mutter-netto', '3000');
        await page.waitForTimeout(200);
        
        // Both fields should be visible
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
        
        // Both should have non-zero values
        const vaterBereinigtValue3 = await page.locator('#vater-bereinigt-result').textContent() || '';
        const mutterBereinigtValue3 = await page.locator('#mutter-bereinigt-result').textContent() || '';
        
        expect(parseFloat(vaterBereinigtValue3.replace(/[^0-9,-]/g, '').replace(',', '.'))).toBeGreaterThan(0);
        expect(parseFloat(mutterBereinigtValue3.replace(/[^0-9,-]/g, '').replace(',', '.'))).toBeGreaterThan(0);
    });

    test('should display Bereinigtes Einkommen fields with various income types', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // First check default zero state
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();

        // Open additional fields section
        await page.click('#toggle-additional-fields');
        await page.waitForTimeout(200);
        
        // Test case 1: Income only from Sonstige Einkommen
        await page.fill('#vater-netto', '0');
        await page.fill('#vater-sonstige', '500');
        await page.fill('#mutter-netto', '0');
        await page.fill('#mutter-sonstige', '600');
        await page.waitForTimeout(200);
        
        // Both fields should be visible
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
        
        // Test case 2: Income only from Wohnvorteil
        await page.fill('#vater-sonstige', '0');
        await page.fill('#mutter-sonstige', '0');
        await page.fill('#vater-wohnvorteil', '300');
        await page.fill('#mutter-wohnvorteil', '400');
        await page.waitForTimeout(200);
        
        // Both fields should be visible
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
        
        // Test case 3: Mixed income types
        await page.fill('#vater-netto', '1500');
        await page.fill('#vater-sonstige', '300');
        await page.fill('#vater-wohnvorteil', '200');
        await page.fill('#vater-schulden', '100');
        
        await page.fill('#mutter-netto', '2500');
        await page.fill('#mutter-sonstige', '200');
        await page.fill('#mutter-wohnvorteil', '300');
        await page.fill('#mutter-schulden', '150');
        
        await page.waitForTimeout(200);
        
        // Both fields should be visible
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
    });
    
    test('should display Bereinigtes Einkommen fields after reset', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Fill in some values
        await page.fill('#vater-netto', '2000');
        await page.fill('#mutter-netto', '3000');
        await page.waitForTimeout(200);
        
        // Verify non-zero values before reset
        const vaterBereinigtValueBefore = await page.locator('#vater-bereinigt-result').textContent() || '';
        const mutterBereinigtValueBefore = await page.locator('#mutter-bereinigt-result').textContent() || '';
        
        expect(parseFloat(vaterBereinigtValueBefore.replace(/[^0-9,-]/g, '').replace(',', '.'))).toBeGreaterThan(0);
        expect(parseFloat(mutterBereinigtValueBefore.replace(/[^0-9,-]/g, '').replace(',', '.'))).toBeGreaterThan(0);
        
        // Reset the form
        await page.click('#reset-button');
        await page.waitForTimeout(200);
        
        // Verify both fields are still visible after reset
        await expect(page.locator('#vater-bereinigt-result').locator('..')).toBeVisible();
        await expect(page.locator('#mutter-bereinigt-result').locator('..')).toBeVisible();
        
        // Verify values are reset to zero
        const vaterBereinigtValueAfter = await page.locator('#vater-bereinigt-result').textContent();
        const mutterBereinigtValueAfter = await page.locator('#mutter-bereinigt-result').textContent();
        
        expect(vaterBereinigtValueAfter).toContain('0,00');
        expect(mutterBereinigtValueAfter).toContain('0,00');
    });
}); 