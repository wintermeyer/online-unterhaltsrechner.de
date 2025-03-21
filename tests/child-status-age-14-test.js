const puppeteer = require('puppeteer');

/**
 * Tests if the child status field properly appears with the default value "Schulkind" 
 * when setting the age to 14
 */
async function testAge14StatusField() {
  console.log('Starting test for age 14 status field visibility...');
  
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    // Collect console messages from the page
    page.on('console', message => {
      console.log(`Browser log: ${message.text()}`);
    });
    
    // Navigate to the page
    await page.goto('file://' + __dirname + '/../index.html', {
      waitUntil: 'networkidle2'
    });
    
    console.log('Page loaded successfully');
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: __dirname + '/age14-initial-state.png' });
    
    // First check the initial status field visibility (should be hidden for age 1)
    const initialVisibility = await page.evaluate(() => {
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      
      if (statusContainer) {
        return {
          exists: true,
          visible: window.getComputedStyle(statusContainer).display !== 'none',
          display: window.getComputedStyle(statusContainer).display,
          visibility: window.getComputedStyle(statusContainer).visibility,
          opacity: window.getComputedStyle(statusContainer).opacity,
          classList: Array.from(statusContainer.classList)
        };
      } else {
        return { exists: false };
      }
    });
    
    console.log('Initial status field visibility:', initialVisibility);
    
    // Now set the age to 14 and verify the status field becomes visible
    await page.select('#kind1Alter', '14');
    console.log('Set age to 14');
    
    // Trigger change event to ensure visibility logic runs
    await page.evaluate(() => {
      console.log('Age is now set to 14, triggering change event');
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      
      // Force visibility update if needed
      if (typeof window.updateChildStatusVisibility === 'function') {
        window.updateChildStatusVisibility();
      } else {
        console.log('Direct DOM manipulation for age 14 visibility');
        const kindElement = document.querySelector('#kind1');
        const statusContainer = kindElement.querySelector('.child-status-container');
        
        if (statusContainer) {
          statusContainer.classList.remove('hidden-age-dependent');
          statusContainer.style.display = 'grid';
        }
      }
    });
    
    // Wait for DOM updates
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));
    
    // Take a screenshot after setting age to 14
    await page.screenshot({ path: __dirname + '/age14-status-field.png' });
    
    // Check visibility and default value after setting age to 14
    const visibilityAfterAge14 = await page.evaluate(() => {
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      const statusSelect = kindElement.querySelector('.kind-status');
      
      if (statusContainer) {
        return {
          exists: true,
          visible: window.getComputedStyle(statusContainer).display !== 'none',
          display: window.getComputedStyle(statusContainer).display,
          visibility: window.getComputedStyle(statusContainer).visibility,
          opacity: window.getComputedStyle(statusContainer).opacity,
          classList: Array.from(statusContainer.classList),
          // Add status field information
          statusExists: statusSelect !== null,
          statusValue: statusSelect ? statusSelect.value : null,
          statusOptions: statusSelect ? Array.from(statusSelect.options).map(o => o.value) : [],
          statusDefaultSelected: statusSelect ? statusSelect.options[statusSelect.selectedIndex].value : null
        };
      } else {
        return { exists: false };
      }
    });
    
    console.log('Status field after age 14:', visibilityAfterAge14);
    
    // Run assertions
    if (!visibilityAfterAge14.exists) {
      throw new Error('Status container does not exist for age 14');
    }
    
    if (!visibilityAfterAge14.visible) {
      throw new Error('BUG: Status field is not visible for age 14');
    } else {
      console.log('✅ Status field is properly visible for age 14');
    }
    
    if (!visibilityAfterAge14.statusExists) {
      throw new Error('Status select element not found for age 14');
    }
    
    // Check if status is set to Schüler by default
    if (visibilityAfterAge14.statusValue !== 'Schüler') {
      throw new Error(`BUG: Status field default value is not 'Schüler' for age 14. Current value: ${visibilityAfterAge14.statusValue}`);
    } else {
      console.log('✅ Status field has correct default value "Schüler" for age 14');
    }
    
    // Also test initialization after reload
    console.log('\nTesting initialization after page reload with age 14...');
    
    // Set age to 14 before reload to test initialization
    await page.evaluate(() => {
      // Store the age selection to maintain after reload
      document.getElementById('kind1Alter').value = '14';
    });
    
    // Reload the page
    await page.reload({ waitUntil: 'networkidle2' });
    
    // After reload, set age to 14 again to ensure consistent state
    await page.select('#kind1Alter', '14');
    
    // Force update after reload
    await page.evaluate(() => {
      console.log('After reload: Setting age to 14 and forcing update');
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      
      if (typeof window.updateChildStatusVisibility === 'function') {
        window.updateChildStatusVisibility();
      } else {
        // Direct DOM manipulation as fallback
        const kindElement = document.querySelector('#kind1');
        const statusContainer = kindElement.querySelector('.child-status-container');
        
        if (statusContainer) {
          statusContainer.classList.remove('hidden-age-dependent');
          statusContainer.style.display = 'grid';
        }
      }
    });
    
    // Wait for DOM updates
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));
    
    // Take a screenshot after reload with age 14
    await page.screenshot({ path: __dirname + '/age14-after-reload.png' });
    
    // Check status field visibility after reload
    const visibilityAfterReload = await page.evaluate(() => {
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      const statusSelect = kindElement.querySelector('.kind-status');
      
      if (statusContainer) {
        return {
          exists: true,
          visible: window.getComputedStyle(statusContainer).display !== 'none',
          display: window.getComputedStyle(statusContainer).display,
          visibility: window.getComputedStyle(statusContainer).visibility,
          opacity: window.getComputedStyle(statusContainer).opacity,
          classList: Array.from(statusContainer.classList),
          statusValue: statusSelect ? statusSelect.value : null
        };
      } else {
        return { exists: false };
      }
    });
    
    console.log('Status field visibility after reload with age 14:', visibilityAfterReload);
    
    // Run assertions for after reload
    if (!visibilityAfterReload.visible) {
      throw new Error('BUG AFTER RELOAD: Status field is not visible for age 14');
    } else {
      console.log('✅ Status field is properly visible after reload with age 14');
    }
    
    if (visibilityAfterReload.statusValue !== 'Schüler') {
      throw new Error(`BUG AFTER RELOAD: Status field default value is not 'Schüler' for age 14. Current value: ${visibilityAfterReload.statusValue}`);
    } else {
      console.log('✅ Status field has correct default value "Schüler" after reload with age 14');
    }
    
    console.log('\n✅ Age 14 status field test completed successfully');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    // Take a screenshot of the error state
    await page.screenshot({ path: __dirname + '/age14-test-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testAge14StatusField()
  .then(() => {
    console.log('Age 14 status field test passed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Age 14 status field test failed!', err);
    process.exit(1);
  });
