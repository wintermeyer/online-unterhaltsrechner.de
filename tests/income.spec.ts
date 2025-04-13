import { test, expect } from '@playwright/test';

test.describe('Income Tests', () => {
    test('should update income group display for father', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test different income values and verify the displayed group
        const testCases = [
            { income: '2000', expected: '0 bis 2.100 €' },
            { income: '2300', expected: '2.101 - 2.500 €' },
            { income: '3500', expected: '3.301 - 3.700 €' },
            { income: '5000', expected: '4.901 - 5.300 €' },
            { income: '12000', expected: 'Über 11.200 €' }
        ];

        for (const { income, expected } of testCases) {
            // Enter income
            await page.fill('#vater-netto', income);
            
            // Verify income group display
            const groupText = await page.locator('#vater-netto-range').textContent();
            expect(groupText).toBe(expected);
        }
    });

    test('should update income group display for mother', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test different income values and verify the displayed group
        const testCases = [
            { income: '2000', expected: '0 bis 2.100 €' },
            { income: '2300', expected: '2.101 - 2.500 €' },
            { income: '3500', expected: '3.301 - 3.700 €' },
            { income: '5000', expected: '4.901 - 5.300 €' },
            { income: '12000', expected: 'Über 11.200 €' }
        ];

        for (const { income, expected } of testCases) {
            // Enter income
            await page.fill('#mutter-netto', income);
            
            // Verify income group display
            const groupText = await page.locator('#mutter-netto-range').textContent();
            expect(groupText).toBe(expected);
        }
    });

    test('should handle empty and zero income values', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test empty value
        await page.fill('#vater-netto', '');
        let groupText = await page.locator('#vater-netto-range').textContent();
        expect(groupText).toBe('0 bis 2.100 €');

        // Test zero value
        await page.fill('#vater-netto', '0');
        groupText = await page.locator('#vater-netto-range').textContent();
        expect(groupText).toBe('0 bis 2.100 €');

        // Test negative value (should be prevented by input type="number" min="0")
        await page.fill('#vater-netto', '-1');
        groupText = await page.locator('#vater-netto-range').textContent();
        expect(groupText).toBe('0 bis 2.100 €');
    });

    test('should update income groups immediately on input', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Create a test case that requires typing multiple digits
        const testValue = '4500';
        
        // Type each digit and verify the group updates
        for (let i = 0; i < testValue.length; i++) {
            const partialValue = testValue.substring(0, i + 1);
            await page.fill('#vater-netto', partialValue);
            
            // Get the expected group for the partial value
            const expectedGroup = getExpectedGroup(parseInt(partialValue));
            const groupText = await page.locator('#vater-netto-range').textContent();
            expect(groupText).toBe(expectedGroup);
        }
    });
});

// Helper function to determine expected group
function getExpectedGroup(income: number): string {
    if (!income || income <= 2100) return '0 bis 2.100 €';
    if (income <= 2500) return '2.101 - 2.500 €';
    if (income <= 2900) return '2.501 - 2.900 €';
    if (income <= 3300) return '2.901 - 3.300 €';
    if (income <= 3700) return '3.301 - 3.700 €';
    if (income <= 4100) return '3.701 - 4.100 €';
    if (income <= 4500) return '4.101 - 4.500 €';
    if (income <= 4900) return '4.501 - 4.900 €';
    if (income <= 5300) return '4.901 - 5.300 €';
    if (income <= 5700) return '5.301 - 5.700 €';
    if (income <= 6400) return '5.701 - 6.400 €';
    if (income <= 7200) return '6.401 - 7.200 €';
    if (income <= 8200) return '7.201 - 8.200 €';
    if (income <= 9700) return '8.201 - 9.700 €';
    if (income <= 11200) return '9.701 - 11.200 €';
    return 'Über 11.200 €';
} 