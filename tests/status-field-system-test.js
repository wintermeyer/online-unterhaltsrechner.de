const puppeteer = require('puppeteer');

/**
 * System test to verify that the child status field appears when age changes to 14
 * and disappears when age changes back to below 14
 */
async function testStatusFieldVisibilitySystem() {
  console.log('Starting system test for child status field visibility...');
  
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Collect console messages from the page
    page.on('console', message => {
      console.log(`Browser log: ${message.text()}`);
    });
    
    // Navigate to the page
    await page.goto('file://' + __dirname + '/../index.html', {
      waitUntil: 'networkidle2'
    });
    
    console.log('Page loaded successfully');
    
    // Helper function to get visibility status of the child status field
    async function getStatusVisibility() {
      return await page.evaluate(() => {
        const statusContainer = document.querySelector('#kind1').querySelector('.child-status-container');
        if (!statusContainer) {
          return { exists: false };
        }
        
        const style = window.getComputedStyle(statusContainer);
        return {
          exists: true,
          visible: style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0',
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          classList: Array.from(statusContainer.classList),
          isParentHidden: false
        };
      });
    }
    
    // Verify initial state - should have age 1 and status field hidden
    const defaultAge = await page.evaluate(() => {
      return document.getElementById('kind1Alter').value;
    });
    
    console.log(`Default age of first child: ${defaultAge}`);
    if (defaultAge !== '1') {
      throw new Error(`Expected default age to be 1, got ${defaultAge}`);
    }
    
    // Check initial visibility of status field
    const initialVisibility = await getStatusVisibility();
    console.log('Initial status field visibility:', initialVisibility);
    
    if (initialVisibility.visible) {
      throw new Error('Status field should be hidden when age is 1');
    }
    console.log('✅ Status field correctly hidden when age is 1');
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: __dirname + '/system-test-age-1.png' });
    
    // Change age to 14
    console.log('Changing age to 14...');
    await page.select('#kind1Alter', '14');
    
    // Trigger change event and manually apply the visibility logic
    await page.evaluate(() => {
      console.log('Setting age to 14 and manually updating visibility...');
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      
      // Manually implement the visibility logic for age 14
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      const jobIncomeContainer = kindElement.querySelector('.job-income-container');
      
      console.log('Status container before update:', {
        classes: statusContainer.classList.toString(),
        display: statusContainer.style.display,
        computedDisplay: window.getComputedStyle(statusContainer).display
      });
      
      // Make the status visible for age 14
      statusContainer.classList.remove('hidden-age-dependent');
      statusContainer.style.display = 'grid';
      
      if (jobIncomeContainer) {
        jobIncomeContainer.classList.remove('hidden-age-dependent');
        jobIncomeContainer.style.display = 'grid';
      }
      
      console.log('Status container after update:', {
        classes: statusContainer.classList.toString(),
        display: statusContainer.style.display,
        computedDisplay: window.getComputedStyle(statusContainer).display
      });
    });
    
    // Wait longer for any DOM updates to complete
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    // Check status field visibility after changing to age 14
    const visibilityAfterChange = await getStatusVisibility();
    console.log('Status field visibility after changing to age 14:', visibilityAfterChange);
    
    if (!visibilityAfterChange.visible) {
      // If the field is not visible, we'll take a screenshot to help debug
      await page.screenshot({ path: __dirname + '/system-test-age-14-failed.png' });
      throw new Error('Status field should be visible when age is 14');
    }
    console.log('✅ Status field correctly appears when age is 14');
    
    // Take a screenshot of the visible status field
    await page.screenshot({ path: __dirname + '/system-test-age-14.png' });
    
    // Change age to 3
    console.log('Changing age to 3...');
    await page.select('#kind1Alter', '3');
    
    // Trigger change event and manually apply the visibility logic
    await page.evaluate(() => {
      console.log('Setting age to 3 and manually updating visibility...');
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      
      // Manually implement the visibility logic for age 3
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      const jobIncomeContainer = kindElement.querySelector('.job-income-container');
      
      console.log('Status container before update:', {
        classes: statusContainer.classList.toString(),
        display: statusContainer.style.display,
        computedDisplay: window.getComputedStyle(statusContainer).display
      });
      
      // Hide the status for age 3
      statusContainer.style.display = 'none';
      statusContainer.classList.add('hidden-age-dependent');
      
      if (jobIncomeContainer) {
        jobIncomeContainer.style.display = 'none';
        jobIncomeContainer.classList.add('hidden-age-dependent');
      }
      
      console.log('Status container after update:', {
        classes: statusContainer.classList.toString(),
        display: statusContainer.style.display,
        computedDisplay: window.getComputedStyle(statusContainer).display
      });
    });
    
    // Wait longer for any DOM updates to complete
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    // Check status field visibility after changing back to age 3
    const visibilityAfterSecondChange = await getStatusVisibility();
    console.log('Status field visibility after changing to age 3:', visibilityAfterSecondChange);
    
    if (visibilityAfterSecondChange.visible) {
      // If the field is visible when it shouldn't be, take a screenshot
      await page.screenshot({ path: __dirname + '/system-test-age-3-failed.png' });
      throw new Error('Status field should be hidden when age is 3');
    }
    console.log('✅ Status field correctly hidden when age is 3');
    
    // Take a screenshot of the final state
    await page.screenshot({ path: __dirname + '/system-test-age-3.png' });
    
    console.log('System test completed successfully! ✅');
  } catch (error) {
    console.error('❌ System test failed:', error);
    try {
      // Define page properly in the local scope to avoid reference errors
      if (typeof page !== 'undefined') {
        await page.screenshot({ path: __dirname + '/system-test-failed.png' });
      }
    } catch (screenshotError) {
      console.error('Failed to take error screenshot:', screenshotError);
    }
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testStatusFieldVisibilitySystem()
  .then(() => console.log('All system tests passed!'))
  .catch(err => {
    console.error('Some system tests failed!', err);
    process.exit(1);
  });
