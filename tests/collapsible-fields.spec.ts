import { test, expect } from '@playwright/test';

test.describe('Collapsible Fields Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Increase timeout for slower CI environments
        test.setTimeout(30000);
        
        // Wait for page to be ready
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should auto-expand fields when URL contains additional parameters', async ({ page }) => {
        // Navigate with parameters and wait for load
        await page.goto('/?vater-sonstige=100&mutter-wohnvorteil=200&vater-schulden=300');
        await page.waitForLoadState('networkidle');
        
        // Wait for critical elements
        const additionalFields = page.locator('#additional-fields');
        await additionalFields.waitFor({ state: 'attached' });
        
        // Check if expanded
        await expect(additionalFields).not.toHaveClass(/hidden/);
        
        // Verify values
        await expect(page.locator('#vater-sonstige')).toHaveValue('100');
        await expect(page.locator('#mutter-wohnvorteil')).toHaveValue('200');
        await expect(page.locator('#vater-schulden')).toHaveValue('300');
    });

    test('should keep fields collapsed when URL has no additional parameters', async ({ page }) => {
        // Navigate with only basic parameters
        await page.goto('/?vater-netto=2000&mutter-netto=2500');
        await page.waitForLoadState('networkidle');
        
        // Wait for critical elements
        const additionalFields = page.locator('#additional-fields');
        await additionalFields.waitFor({ state: 'attached' });
        
        // Verify collapsed state
        await expect(additionalFields).toHaveClass(/hidden/);
        
        // Verify basic values
        await expect(page.locator('#vater-netto')).toHaveValue('2000');
        await expect(page.locator('#mutter-netto')).toHaveValue('2500');
        
        // Verify additional fields are empty
        const additionalInputs = [
            '#vater-sonstige',
            '#mutter-wohnvorteil',
            '#vater-schulden',
            '#mutter-schulden',
            '#vater-wohnvorteil',
            '#mutter-sonstige'
        ];
        
        for (const selector of additionalInputs) {
            await expect(page.locator(selector)).toHaveValue('');
        }
    });

    test('should handle manual toggle and maintain state', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const toggleButton = page.locator('#toggle-additional-fields');
        const additionalFields = page.locator('#additional-fields');
        
        await toggleButton.waitFor({ state: 'visible' });
        
        // Initially collapsed
        await expect(additionalFields).toHaveClass(/hidden/);
        
        // Test expand
        await toggleButton.click();
        await expect(additionalFields).not.toHaveClass(/hidden/);
        
        // Add value and verify it stays expanded
        await page.locator('#vater-sonstige').fill('150');
        await expect(additionalFields).not.toHaveClass(/hidden/);
        
        // Test collapse
        await toggleButton.click();
        await expect(additionalFields).toHaveClass(/hidden/);
        
        // Reload and verify state is maintained through value
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check if the value is still present
        await expect(page.locator('#vater-sonstige')).toHaveValue('150');
        
        // The presence of a value should cause the section to be expanded
        await expect(additionalFields).not.toHaveClass(/hidden/);
    });

    test('should handle multiple field interactions', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const toggleButton = page.locator('#toggle-additional-fields');
        const additionalFields = page.locator('#additional-fields');
        
        // Expand section
        await toggleButton.click();
        
        // Fill multiple fields
        const fieldValues = {
            '#vater-sonstige': '100',
            '#mutter-wohnvorteil': '200',
            '#vater-schulden': '300',
            '#mutter-sonstige': '400'
        };
        
        for (const [selector, value] of Object.entries(fieldValues)) {
            await page.locator(selector).fill(value);
            await expect(additionalFields).not.toHaveClass(/hidden/);
        }
        
        // Verify all values persist after reload
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check if values are still present
        for (const [selector, value] of Object.entries(fieldValues)) {
            await expect(page.locator(selector)).toHaveValue(value);
        }
        
        // The presence of values should cause the section to be expanded
        await expect(additionalFields).not.toHaveClass(/hidden/);
    });
}); 