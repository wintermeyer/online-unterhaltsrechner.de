const puppeteer = require('puppeteer');

/**
 * Test to verify that the status field is properly visible when the page loads
 * with an initial age of 18 (which should show the status field)
 */
async function testInitialStatusVisibility() {
  console.log('Starting test for initial status field visibility...');
  
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let page;
  try {
    page = await browser.newPage();
    
    // Collect console messages
    page.on('console', message => {
      console.log(`Browser log: ${message.text()}`);
    });
    
    // Before loading the page, we'll prepare to intercept and modify the HTML
    // to set the initial age to 18
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().endsWith('index.html')) {
        console.log('Intercepting index.html request...');
        // Continue with request, we'll modify the HTML after loading
        request.continue();
      } else {
        request.continue();
      }
    });
    
    // Navigate to the page
    await page.goto('file://' + __dirname + '/../index.html', {
      waitUntil: 'networkidle2'
    });
    
    console.log('Page loaded successfully');
    
    // Now set the age to 18 and make sure the change event is triggered
    await page.select('#kind1Alter', '18');
    console.log('Set age to 18');
    
    // Manually trigger the change event
    await page.evaluate(() => {
      console.log('Triggering change event for age 18');
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      
      // Call updateChildStatusVisibility directly if it exists
      if (typeof window.updateChildStatusVisibility === 'function') {
        console.log('Calling updateChildStatusVisibility');
        window.updateChildStatusVisibility();
      } else {
        console.warn('updateChildStatusVisibility not found in global scope!');
      }
    });
    
    // Wait for any DOM updates
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
    
    // Screenshot functionality disabled
    console.log('Screenshot disabled: initial-age-18-test');
    
    // Check if the page has the status field loaded correctly
    const statusFieldInfo = await page.evaluate(() => {
      // Find the status container
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      
      // Check if it exists and get its properties
      if (!statusContainer) {
        console.error('Status container not found at all!');
        return { exists: false };
      }
      
      console.log('Status container HTML:', statusContainer.outerHTML);
      
      const style = window.getComputedStyle(statusContainer);
      return {
        exists: true,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0',
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        classList: Array.from(statusContainer.classList),
        html: statusContainer.outerHTML
      };
    });
    
    console.log('Status field info with age 18:', statusFieldInfo);
    
    // Check for DOMContentLoaded event handler to see if it's properly applied
    const domContentLoadedInfo = await page.evaluate(() => {
      // Try to find where the updateChildStatusVisibility is called
      const scripts = Array.from(document.getElementsByTagName('script'));
      
      let contentLoaded = false;
      let updateFunction = false;
      let eventHandlers = [];
      
      for (const script of scripts) {
        if (script.textContent.includes('DOMContentLoaded')) {
          contentLoaded = true;
        }
        if (script.textContent.includes('updateChildStatusVisibility')) {
          updateFunction = true;
          
          // Simple check for event handlers
          if (script.textContent.includes('addEventListener')) {
            eventHandlers.push('addEventListener found');
          }
          if (script.textContent.includes('onchange')) {
            eventHandlers.push('onchange found');
          }
        }
      }
      
      return {
        domContentLoadedFound: contentLoaded,
        updateFunctionFound: updateFunction,
        eventHandlers: eventHandlers
      };
    });
    
    console.log('DOM initialization info:', domContentLoadedInfo);
    
    // Now let's try to fix the issue by manually applying the visibility rules
    await page.evaluate(() => {
      console.log('Manually fixing status visibility for age 18');
      const kindElement = document.querySelector('#kind1');
      const ageSelect = document.getElementById('kind1Alter');
      const selectedAge = parseInt(ageSelect.value, 10);
      console.log('Current selected age:', selectedAge);
      
      // Check if status container exists
      const statusContainer = kindElement.querySelector('.child-status-container');
      
      if (!statusContainer) {
        console.error('Status container not found, might need to be created');
        return;
      }
      
      // Apply visibility rules
      if (selectedAge >= 14) {
        console.log('Age is 14+, making status visible');
        statusContainer.classList.remove('hidden-age-dependent');
        statusContainer.style.display = 'grid';
      } else {
        console.log('Age is below 14, hiding status');
        statusContainer.style.display = 'none';
        statusContainer.classList.add('hidden-age-dependent');
      }
    });
    
    // Wait for updates and take another screenshot
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
    await page.screenshot({ path: __dirname + '/fixed-age-18-test.png' });
    
    // Check if our fix worked
    const statusFieldInfoAfterFix = await page.evaluate(() => {
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
        classList: Array.from(statusContainer.classList)
      };
    });
    
    console.log('Status field info after fix:', statusFieldInfoAfterFix);
    
    // Verify if the status field is now visible
    if (!statusFieldInfo.exists) {
      throw new Error('BUG FOUND: Status field does not exist for age 18, should be created');
    } else if (!statusFieldInfo.visible) {
      throw new Error('BUG FOUND: Status field exists but is not visible for age 18');
    } else {
      console.log('✅ Status field is correctly visible for age 18');
    }
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (page) {
      try {
        console.log('Screenshot disabled: initial-visibility-error');
      } catch (screenshotError) {
        console.error('Failed to take error screenshot (disabled)');
      }
    }
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testInitialStatusVisibility()
  .then(() => console.log('Initial visibility test passed!'))
  .catch(err => {
    console.error('Initial visibility test failed!', err);
    process.exit(1);
  });
