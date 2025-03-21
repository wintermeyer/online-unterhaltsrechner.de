/**
 * System test to verify that child status field is always visible
 * 
 * This test checks that:
 * 1. First child has status field visible by default
 * 2. Status field remains visible when age is changed to different values
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testChildStatusVisibility() {
  console.log('Starting headless browser test for child status visibility...');
  
  // Launch browser in non-headless mode to see what's happening
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // Remove this for production, useful for debugging
    // slowMo: 50
  });
  
  try {
    const page = await browser.newPage();
    
    // Listen for console messages from the page
    page.on('console', message => console.log(`Browser log: ${message.text()}`));
    
    // Get absolute path to index.html
    const indexPath = path.resolve(__dirname, '../index.html');
    
    // Navigate to the local HTML file
    await page.goto(`file://${indexPath}`);
    console.log('Page loaded successfully');

    // Helper function for screenshots - disabled to prevent clutter
    async function takeScreenshot(name) {
      // Screenshot functionality disabled
      console.log(`Screenshot disabled: ${name}`);
      return null;
    }

    // Helper function to get status visibility
    async function getStatusVisibility() {
      return page.evaluate(() => {
        // Find all labels in the first child
        const labels = Array.from(document.querySelectorAll('#kind1 label'));
        // Find the Status label
        const statusLabel = labels.find(label => label.textContent.trim() === 'Status');
        
        if (!statusLabel) return { exists: false, visible: false };
        
        // Get the parent grid container
        const gridContainer = statusLabel.closest('.grid');
        
        if (!gridContainer) return { exists: false, visible: false };
        
        const style = window.getComputedStyle(gridContainer);
        const isVisible = style.display !== 'none' && 
                          style.visibility !== 'hidden' && 
                          style.opacity !== '0';
        
        return { 
          exists: true, 
          visible: isVisible,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          classList: Array.from(gridContainer.classList)
        };
      });
    }

    // Wait for the first child to be added
    await page.waitForSelector('#kind1');
    
    // Step 1: Check the default age of the first child
    const defaultAge = await page.evaluate(() => {
      const ageSelect = document.querySelector('#kind1Alter');
      return ageSelect ? ageSelect.value : null;
    });
    
    console.log(`Default age of first child: ${defaultAge}`);
    
    if (defaultAge !== '1') {
      throw new Error(`First child's default age is not 1 as expected, found: ${defaultAge}`);
    }
    console.log('✅ Default age verification passed');
    
    // Step 2: Check if status field is visible by default
    // Find the status grid by looking for a label with text 'Status'
    const initialVisibility = await page.evaluate(() => {
      // Find all labels in the first child
      const labels = Array.from(document.querySelectorAll('#kind1 label'));
      console.log('All labels in #kind1:', labels.map(l => l.textContent.trim()));
      
      // Find the Status label
      const statusLabel = labels.find(label => label.textContent.trim() === 'Status');
      
      if (!statusLabel) {
        console.log('Status label not found');
        return { exists: false, visible: false };
      }
      
      console.log('Found Status label:', statusLabel.textContent.trim());
      
      // Get the parent grid container
      const gridContainer = statusLabel.closest('.grid');
      
      if (!gridContainer) {
        console.log('Grid container not found');
        return { exists: false, visible: false };
      }
      
      console.log('Grid container HTML:', gridContainer.outerHTML);
      
      const style = window.getComputedStyle(gridContainer);
      const isVisible = style.display !== 'none' && 
                        style.visibility !== 'hidden' && 
                        style.opacity !== '0';
      
      // Check if there are any parent elements that might be hiding this element
      let parent = gridContainer.parentElement;
      let isParentHidden = false;
      let hiddenParent = null;
      
      while (parent && !isParentHidden) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden' || parentStyle.opacity === '0') {
          isParentHidden = true;
          hiddenParent = parent;
        }
        parent = parent.parentElement;
      }
      
      return { 
        exists: true, 
        visible: isVisible && !isParentHidden,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        classList: Array.from(gridContainer.classList),
        isParentHidden: isParentHidden,
        hiddenParentId: hiddenParent ? hiddenParent.id : null,
        hiddenParentClass: hiddenParent ? Array.from(hiddenParent.classList) : null
      };
    });
    
    console.log(`Initial status field visibility:`, initialVisibility);
    
    if (!initialVisibility.visible) {
      throw new Error('Status field should be visible for all ages');
    }
    console.log('✅ Status field correctly visible when age is 1');
    
    // Screenshot disabled
    
    // Step 3: Change age to 14 and check if status field remains visible
    console.log('Changing age to 14...');
    await page.select('#kind1Alter', '14');
    
    // Explicitly trigger the change event to ensure event listeners are called
    await page.evaluate(() => {
      const event = new Event('change');
      document.querySelector('#kind1Alter').dispatchEvent(event);
    });
    
    // Wait for any animations or DOM updates to complete
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
    
    // Check if status field is still visible after age change
    const statusVisibilityAfterAge14 = await getStatusVisibility();
    console.log('Status visibility after age 14:', statusVisibilityAfterAge14);
    
    if (!statusVisibilityAfterAge14.visible) {
      throw new Error('Status field should remain visible when age is 14');
    }
    console.log('✅ Status field correctly visible when age is 14');
    
    // Screenshot disabled
    
    // Step 4: Change age back to 2 and check if status field remains visible
    console.log('Changing age to 2...');
    await page.select('#kind1Alter', '2');
    
    // Explicitly trigger the change event
    await page.evaluate(() => {
      const event = new Event('change');
      document.querySelector('#kind1Alter').dispatchEvent(event);
    });
    
    // Wait for any animations or DOM updates to complete
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
    
    // Check if status field remains visible
    const statusVisibilityAfterAge2 = await getStatusVisibility();
    console.log('Status visibility after age 2:', statusVisibilityAfterAge2);
    
    // Screenshot disabled
    
    if (!statusVisibilityAfterAge2.visible) {
      throw new Error('Status field should remain visible when age is 2');
    }
    console.log('✅ Status field correctly visible when age is 2');
    
    console.log('Test completed successfully! ✅');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    await browser.close();
  }
  
  return true;
}

// Run the test
testChildStatusVisibility().then(success => {
  if (success) {
    console.log('All tests passed!');
    process.exit(0);
  } else {
    console.error('Some tests failed!');
    process.exit(1);
  }
}).catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
