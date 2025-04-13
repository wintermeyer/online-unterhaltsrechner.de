const puppeteer = require('puppeteer');

describe('Child Deletion Functionality', () => {
    let browser;
    let page;
    
    jest.setTimeout(60000); // Increase timeout to 60 seconds

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        
        // Listen for console messages
        page.on('console', message => {
            console.log('Browser console:', message.text());
        });
        
        // Listen for errors
        page.on('pageerror', error => {
            console.error('Browser error:', error);
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        // Navigate to the page and wait for it to be fully loaded
        await page.goto('http://localhost:3000', { 
            waitUntil: ['networkidle0', 'domcontentloaded', 'load']
        });

        // Wait for the JavaScript to initialize by checking for the children container
        await page.waitForSelector('#children-container');
        
        // Wait for the initial child to be added
        await page.waitForSelector('.child-form');
        
        // Add some debugging
        const childCount = await page.evaluate(() => document.querySelectorAll('.child-form').length);
        console.log('Initial child count:', childCount);
    });

    test('should not show delete button for single child', async () => {
        // Check that there is exactly one child form
        const childForms = await page.$$('.child-form');
        expect(childForms.length).toBe(1);
        
        // Verify that there is no delete button visible
        const deleteButtons = await page.$$eval('.remove-child', buttons => 
            buttons.filter(button => window.getComputedStyle(button).display !== 'none').length
        );
        expect(deleteButtons).toBe(0);
    });

    test('should show delete buttons when multiple children are present', async () => {
        try {
            // Wait for the add button
            await page.waitForSelector('#add-child-button');
            
            // Click the button using JavaScript
            await page.evaluate(() => {
                const button = document.querySelector('#add-child-button');
                button.click();
            });
            
            // Add debugging
            console.log('Button clicked, waiting for second child...');
            
            // Wait for the second child to be added with a custom timeout
            await page.waitForFunction(() => {
                const forms = document.querySelectorAll('.child-form');
                console.log('Current child count:', forms.length);
                return forms.length === 2;
            }, { timeout: 5000 });
            
            // Add more debugging
            const childCount = await page.evaluate(() => document.querySelectorAll('.child-form').length);
            console.log('Child count after click:', childCount);
            
            // Check that there are exactly two child forms
            const childForms = await page.$$('.child-form');
            expect(childForms.length).toBe(2);
            
            // Verify that there are two visible delete buttons
            const visibleDeleteButtons = await page.$$eval('.remove-child', buttons => {
                const visible = buttons.filter(button => window.getComputedStyle(button).display !== 'none');
                console.log('Visible delete buttons:', visible.length);
                return visible.length;
            });
            expect(visibleDeleteButtons).toBe(2);
        } catch (error) {
            // Add more detailed error logging
            console.error('Test failed with error:', error);
            
            // Log the current state
            const childCount = await page.evaluate(() => document.querySelectorAll('.child-form').length);
            console.error('Final child count:', childCount);
            
            const buttonExists = await page.evaluate(() => !!document.querySelector('#add-child-button'));
            console.error('Add button exists:', buttonExists);
            
            throw error;
        }
    });

    test('should not allow deletion of last child', async () => {
        try {
            // Wait for the add button
            await page.waitForSelector('#add-child-button');
            
            // Click the button using JavaScript
            await page.evaluate(() => {
                const button = document.querySelector('#add-child-button');
                button.click();
            });
            
            // Wait for the second child to be added and delete buttons to be visible
            await page.waitForFunction(() => {
                const forms = document.querySelectorAll('.child-form');
                const visibleDeleteButtons = Array.from(document.querySelectorAll('.remove-child'))
                    .filter(button => window.getComputedStyle(button).display !== 'none');
                return forms.length === 2 && visibleDeleteButtons.length === 2;
            }, { timeout: 5000 });
            
            // Find and click the delete button using JavaScript
            await page.evaluate(() => {
                const deleteButtons = Array.from(document.querySelectorAll('.remove-child'))
                    .filter(button => window.getComputedStyle(button).display !== 'none');
                if (deleteButtons.length >= 2) {
                    deleteButtons[1].click(); // Click the second delete button
                } else {
                    throw new Error(`Expected 2 visible delete buttons, found ${deleteButtons.length}`);
                }
            });
            
            // Wait for the deletion to complete and delete buttons to update
            await page.waitForFunction(() => {
                const forms = document.querySelectorAll('.child-form');
                const visibleDeleteButtons = Array.from(document.querySelectorAll('.remove-child'))
                    .filter(button => window.getComputedStyle(button).display !== 'none');
                return forms.length === 1 && visibleDeleteButtons.length === 0;
            }, { timeout: 5000 });
            
            // Verify that there is only one child form
            const childForms = await page.$$('.child-form');
            expect(childForms.length).toBe(1);
            
            // Verify that there are no visible delete buttons
            const visibleDeleteButtons = await page.$$eval('.remove-child', buttons => 
                buttons.filter(button => window.getComputedStyle(button).display !== 'none').length
            );
            expect(visibleDeleteButtons).toBe(0);
        } catch (error) {
            // Add more detailed error logging
            console.error('Test failed with error:', error);
            
            // Log the current state
            const childCount = await page.evaluate(() => document.querySelectorAll('.child-form').length);
            console.error('Final child count:', childCount);
            
            const deleteButtonCount = await page.evaluate(() => {
                const buttons = document.querySelectorAll('.remove-child');
                const visibleButtons = Array.from(buttons)
                    .filter(button => window.getComputedStyle(button).display !== 'none');
                return {
                    total: buttons.length,
                    visible: visibleButtons.length
                };
            });
            console.error('Delete buttons:', deleteButtonCount);
            
            throw error;
        }
    });
}); 