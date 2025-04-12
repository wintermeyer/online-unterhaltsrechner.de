const { test, expect } = require('@playwright/test');

function generateRandomIncome() {
    return Math.floor(Math.random() * 10000) + 1000;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value || 0);
}

test.describe('URL Sharing Tests', () => {
    test('should correctly share and load values via URL', async ({ page, context }) => {
        // Generate random test values
        const vaterValue = generateRandomIncome();
        const mutterValue = generateRandomIncome();

        // First page: Enter values and get share URL
        await page.goto('http://localhost:3000');
        
        // Enter values
        await page.fill('#vater-netto', vaterValue.toString());
        await page.fill('#mutter-netto', mutterValue.toString());
        
        // Wait for calculations to complete
        await page.waitForTimeout(100);

        // Get the generated share URL
        const shareUrl = await page.inputValue('#share-url');
        console.log(`Generated share URL: ${shareUrl}`);
        console.log(`Original values - Vater: ${formatCurrency(vaterValue)}, Mutter: ${formatCurrency(mutterValue)}`);

        // Open new page with the share URL
        const newPage = await context.newPage();
        await newPage.goto(shareUrl);

        // Wait for values to load
        await newPage.waitForTimeout(100);

        // Get loaded values
        const loadedVaterValue = await newPage.inputValue('#vater-netto');
        const loadedMutterValue = await newPage.inputValue('#mutter-netto');
        console.log(`Loaded values - Vater: ${formatCurrency(parseFloat(loadedVaterValue))}, Mutter: ${formatCurrency(parseFloat(loadedMutterValue))}`);

        // Verify values match
        expect(parseFloat(loadedVaterValue)).toBe(vaterValue);
        expect(parseFloat(loadedMutterValue)).toBe(mutterValue);

        // Verify calculations
        const vaterNettoResult = await newPage.textContent('#vater-netto-result');
        const mutterNettoResult = await newPage.textContent('#mutter-netto-result');

        expect(vaterNettoResult).toBe(formatCurrency(vaterValue));
        expect(mutterNettoResult).toBe(formatCurrency(mutterValue));
    });

    test('should handle multiple random value sets', async ({ page, context }) => {
        // Test with multiple random value sets
        for (let i = 0; i < 5; i++) {
            const vaterValue = generateRandomIncome();
            const mutterValue = generateRandomIncome();

            await page.goto('http://localhost:3000');
            await page.fill('#vater-netto', vaterValue.toString());
            await page.fill('#mutter-netto', mutterValue.toString());
            await page.waitForTimeout(100);

            const shareUrl = await page.inputValue('#share-url');
            console.log(`\nTest ${i + 1}:`);
            console.log(`Generated share URL: ${shareUrl}`);
            console.log(`Original values - Vater: ${formatCurrency(vaterValue)}, Mutter: ${formatCurrency(mutterValue)}`);

            const newPage = await context.newPage();
            await newPage.goto(shareUrl);
            await newPage.waitForTimeout(100);

            const loadedVaterValue = await newPage.inputValue('#vater-netto');
            const loadedMutterValue = await newPage.inputValue('#mutter-netto');
            console.log(`Loaded values - Vater: ${formatCurrency(parseFloat(loadedVaterValue))}, Mutter: ${formatCurrency(parseFloat(loadedMutterValue))}`);

            expect(parseFloat(loadedVaterValue)).toBe(vaterValue);
            expect(parseFloat(loadedMutterValue)).toBe(mutterValue);

            await newPage.close();
        }
    });

    test('should handle edge cases', async ({ page, context }) => {
        const testCases = [
            { vater: 1000, mutter: 1000, desc: 'Minimum values' },
            { vater: 99999, mutter: 99999, desc: 'Very high values' },
            { vater: 1500, mutter: 0, desc: 'Zero value' },
            { vater: 2500, mutter: 2500, desc: 'Equal values' }
        ];

        for (const testCase of testCases) {
            await page.goto('http://localhost:3000');
            await page.fill('#vater-netto', testCase.vater.toString());
            await page.fill('#mutter-netto', testCase.mutter.toString());
            await page.waitForTimeout(100);

            const shareUrl = await page.inputValue('#share-url');
            console.log(`\n${testCase.desc}:`);
            console.log(`Generated share URL: ${shareUrl}`);
            console.log(`Original values - Vater: ${formatCurrency(testCase.vater)}, Mutter: ${formatCurrency(testCase.mutter)}`);

            const newPage = await context.newPage();
            await newPage.goto(shareUrl);
            await newPage.waitForTimeout(100);

            const loadedVaterValue = await newPage.inputValue('#vater-netto');
            const loadedMutterValue = await newPage.inputValue('#mutter-netto');
            console.log(`Loaded values - Vater: ${formatCurrency(parseFloat(loadedVaterValue))}, Mutter: ${formatCurrency(parseFloat(loadedMutterValue))}`);

            expect(parseFloat(loadedVaterValue)).toBe(testCase.vater);
            expect(parseFloat(loadedMutterValue)).toBe(testCase.mutter);

            await newPage.close();
        }
    });
}); 