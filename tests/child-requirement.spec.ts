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
        
        // Wait for the DOM to be fully loaded
        await page.waitForTimeout(1000);
        
        // Check if the remove button exists but may not be visible
        const buttonExists = await page.evaluate(() => {
            return document.querySelector('.remove-child') !== null;
        });
        expect(buttonExists).toBeTruthy();
        
        // Try to remove the only child using JavaScript to bypass visibility issues
        await page.evaluate(() => {
            const button = document.querySelector('.remove-child');
            if (button) {
                (button as HTMLElement).click();
            }
        });
        
        // Wait for any potential DOM updates
        await page.waitForTimeout(1000);
        
        // Verify the child still exists
        const childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(1);
    });

    test('should allow adding and removing additional children', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Add two more children
        const addButton = await page.waitForSelector('#add-child-button', { state: 'visible' });
        await addButton.click();
        await page.waitForTimeout(500); // Add wait time between clicks
        await addButton.click();
        
        // Wait for children to be added and fully rendered
        await page.waitForTimeout(1000);
        
        // Verify we now have three children
        let childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(3);
        
        // Wait for remove buttons to be visible
        await page.waitForSelector('.remove-child:visible');
        
        // Remove the second child using JavaScript to avoid visibility issues
        await page.evaluate(() => {
            const removeButtons = Array.from(document.querySelectorAll('.remove-child'))
                .filter(button => window.getComputedStyle(button).display !== 'none');
            if (removeButtons.length > 0) {
                (removeButtons[1] as HTMLElement).click();
            }
        });
        
        // Wait for removal to complete
        await page.waitForTimeout(1000);
        
        // Verify we now have two children
        childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(2);
        
        // Try to remove all remaining children
        await page.evaluate(() => {
            const removeButtons = Array.from(document.querySelectorAll('.remove-child'))
                .filter(button => window.getComputedStyle(button).display !== 'none');
            if (removeButtons.length > 0) {
                (removeButtons[0] as HTMLElement).click();
            }
        });
        
        // Wait for removal to complete
        await page.waitForTimeout(1000);
        
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