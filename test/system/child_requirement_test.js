const { test, expect } = require('@playwright/test');

test.describe('Child Requirement Tests', () => {
    test('should have at least one child by default', async ({ page }) => {
        await page.goto('/');
        const childForm = await page.waitForSelector('.child-form');
        expect(childForm).toBeTruthy();
    });

    test('should not allow removing the last child', async ({ page }) => {
        await page.goto('/');
        
        // Get initial count of children
        const initialChildren = await page.$$('.child-form');
        expect(initialChildren.length).toBe(1);

        // Try to remove the only child
        const removeButton = await page.$('.remove-child');
        await removeButton.click();

        // Verify the child still exists
        const remainingChildren = await page.$$('.child-form');
        expect(remainingChildren.length).toBe(1);
    });

    test('should allow removing additional children', async ({ page }) => {
        await page.goto('/');
        
        // Add a second child
        const addButton = await page.$('#add-child-button');
        await addButton.click();

        // Verify we have two children
        let children = await page.$$('.child-form');
        expect(children.length).toBe(2);

        // Remove the second child
        const removeButtons = await page.$$('.remove-child');
        await removeButtons[1].click();

        // Verify we're back to one child
        children = await page.$$('.child-form');
        expect(children.length).toBe(1);
    });
}); 