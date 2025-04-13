import { test, expect } from '@playwright/test';

test.describe('Child Requirement Tests', () => {
    test('should always have at least one child by default', async ({ page }) => {
        await page.goto('/');
        
        // Wait for the page to load
        await page.waitForLoadState('networkidle');
        
        // Check that there is exactly one child form
        const childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(1);
        
        // Verify the child form has the expected elements
        const ageSelect = await page.$('#child-age-0');
        const residenceInputs = await page.$$('input[name="child-residence-0"]');
        
        expect(ageSelect).toBeTruthy();
        expect(residenceInputs.length).toBe(4); // vater, mutter, 5050, other
    });

    test('should not allow removing the last child', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Try to remove the only child
        const removeButton = await page.$('.remove-child');
        expect(removeButton).not.toBeNull();
        await removeButton?.click();
        
        // Verify the child still exists
        const childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(1);
    });

    test('should allow adding and removing additional children', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Add two more children
        const addButton = await page.$('#add-child-button');
        expect(addButton).not.toBeNull();
        await addButton?.click();
        await addButton?.click();
        
        // Verify we now have three children
        let childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(3);
        
        // Remove the second child
        const removeButtons = await page.$$('.remove-child');
        await removeButtons[1].click();
        
        // Verify we now have two children
        childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(2);
        
        // Try to remove all children
        for (const button of await page.$$('.remove-child')) {
            await button.click();
        }
        
        // Verify we still have one child
        childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(1);
    });

    test('should persist child data in share URL', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Get the share URL and verify it contains the default child
        const shareUrl = await page.locator('#share-url').inputValue();
        expect(shareUrl).toContain('child-0-age=0');
        expect(shareUrl).toContain('child-0-residence=mutter');
        
        // Add another child
        const addButton = await page.$('#add-child-button');
        expect(addButton).not.toBeNull();
        await addButton?.click();
        
        // Verify the URL now contains both children
        const updatedShareUrl = await page.locator('#share-url').inputValue();
        expect(updatedShareUrl).toContain('child-0-age=0');
        expect(updatedShareUrl).toContain('child-0-residence=mutter');
        expect(updatedShareUrl).toContain('child-1-age=0');
        expect(updatedShareUrl).toContain('child-1-residence=mutter');
    });
}); 