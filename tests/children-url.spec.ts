import { test, expect } from '@playwright/test';

test.describe('Children URL Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should handle URL with no children', async ({ page }) => {
        // Set some parent values
        await page.fill('#vater-netto', '3000');
        await page.fill('#mutter-netto', '2000');

        // Get share URL and verify it doesn't contain child parameters
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).not.toContain('child-0-age');
        expect(shareUrl).not.toContain('child-0-residence');
    });

    test('should handle URL with one child', async ({ page }) => {
        // Add one child
        await page.click('#add-child-button');
        await page.selectOption('#child-age-0', '5');
        await page.check('#child-residence-vater-0');

        // Set some parent values
        await page.fill('#vater-netto', '3000');
        await page.fill('#mutter-netto', '2000');

        // Get and verify share URL
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).toContain('child-0-age=5');
        expect(shareUrl).toContain('child-0-residence=vater');

        // Load the URL and verify child data
        await page.goto(shareUrl);
        await expect(page.locator('#child-age-0')).toHaveValue('5');
        await expect(page.locator('#child-residence-vater-0')).toBeChecked();
    });

    test('should handle URL with multiple children', async ({ page }) => {
        // Add three children with different ages and residences
        await page.click('#add-child-button');
        await page.selectOption('#child-age-0', '3');
        await page.check('#child-residence-mutter-0');

        await page.click('#add-child-button');
        await page.selectOption('#child-age-1', '7');
        await page.check('#child-residence-5050-1');

        await page.click('#add-child-button');
        await page.selectOption('#child-age-2', '12');
        await page.check('#child-residence-other-2');

        // Set some parent values
        await page.fill('#vater-netto', '4000');
        await page.fill('#mutter-netto', '3000');

        // Get and verify share URL contains all children
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).toContain('child-0-age=3');
        expect(shareUrl).toContain('child-0-residence=mutter');
        expect(shareUrl).toContain('child-1-age=7');
        expect(shareUrl).toContain('child-1-residence=5050');
        expect(shareUrl).toContain('child-2-age=12');
        expect(shareUrl).toContain('child-2-residence=other');

        // Load the URL and verify all children data
        await page.goto(shareUrl);
        
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
        // Add two children
        await page.click('#add-child-button');
        await page.click('#add-child-button');

        // Set some values
        await page.selectOption('#child-age-0', '4');
        await page.selectOption('#child-age-1', '6');

        // Get URL with two children
        const urlWithTwoChildren = await page.locator('#share-url').inputValue();
        expect(urlWithTwoChildren).toContain('child-0-age=4');
        expect(urlWithTwoChildren).toContain('child-1-age=6');

        // Remove second child
        await page.locator('.child-form >> nth=1 >> .remove-child').click();

        // Get URL with one child
        const urlWithOneChild = await page.locator('#share-url').inputValue();
        expect(urlWithOneChild).toContain('child-0-age=4');
        expect(urlWithOneChild).not.toContain('child-1-age=6');
    });

    test('should update URL immediately when adding or removing children', async ({ page }) => {
        // Get initial URL
        const initialUrl = await page.locator('#share-url').inputValue();
        expect(initialUrl).not.toContain('child-0-age');
        expect(initialUrl).not.toContain('child-0-residence');

        // Add first child and verify URL updates immediately
        await page.click('#add-child-button');
        const urlAfterFirstChild = await page.locator('#share-url').inputValue();
        expect(urlAfterFirstChild).toContain('child-0-age=0'); // Default age is 0
        expect(urlAfterFirstChild).toContain('child-0-residence=mutter'); // Default residence is mutter

        // Add second child and verify URL updates immediately
        await page.click('#add-child-button');
        const urlAfterSecondChild = await page.locator('#share-url').inputValue();
        expect(urlAfterSecondChild).toContain('child-0-age=0');
        expect(urlAfterSecondChild).toContain('child-0-residence=mutter');
        expect(urlAfterSecondChild).toContain('child-1-age=0');
        expect(urlAfterSecondChild).toContain('child-1-residence=mutter');

        // Change values for second child and verify URL updates
        await page.selectOption('#child-age-1', '5');
        await page.check('#child-residence-vater-1');
        const urlAfterChanges = await page.locator('#share-url').inputValue();
        expect(urlAfterChanges).toContain('child-1-age=5');
        expect(urlAfterChanges).toContain('child-1-residence=vater');

        // Remove first child and verify URL updates immediately
        await page.locator('.child-form >> nth=0 >> .remove-child').click();
        const urlAfterRemoval = await page.locator('#share-url').inputValue();
        expect(urlAfterRemoval).not.toContain('child-0-age=0');
        expect(urlAfterRemoval).not.toContain('child-0-residence=mutter');
        expect(urlAfterRemoval).toContain('child-0-age=5'); // Second child becomes first
        expect(urlAfterRemoval).toContain('child-0-residence=vater');
        expect(urlAfterRemoval).not.toContain('child-1-'); // No second child anymore
    });
}); 