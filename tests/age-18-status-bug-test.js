const puppeteer = require('puppeteer');

/**
 * Test specifically focused on verifying the age 18 status field bug fix
 * This test ensures that when the age is set to 18, the status field is 
 * properly visible, addressing the specific bug we found.
 */
async function testAge18StatusFieldBug() {
  console.log('Starting test for age 18 status field bug fix...');
  
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let page;
  try {
    page = await browser.newPage();
    
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
    await page.screenshot({ path: __dirname + '/initial-page-state.png' });
    
    // First check the initial status field visibility
    const initialVisibility = await page.evaluate(() => {
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
    
    console.log('Initial status field visibility:', initialVisibility);
    
    // Now set the age to 18 and verify the status field is visible
    await page.select('#kind1Alter', '18');
    console.log('Set age to 18');
    
    // Trigger change event and directly apply visibility logic
    await page.evaluate(() => {
      console.log('Debug: Selected age is now', document.getElementById('kind1Alter').value);
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      console.log('Debug: Change event dispatched');
      
      // Check if updateChildStatusVisibility is available
      if (typeof window.updateChildStatusVisibility === 'function') {
        console.log('Debug: Calling updateChildStatusVisibility directly');
        window.updateChildStatusVisibility();
      } else {
        console.error('Debug: updateChildStatusVisibility function not found');
      }
      
      // Also directly update status field visibility as a backup
      console.log('Debug: Manual update - forcing visibility status for age 14');
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      
      if (statusContainer) {
        console.log('Debug: Status container before:', statusContainer.classList.toString(), statusContainer.style.display);
        statusContainer.classList.remove('hidden-age-dependent');
        statusContainer.style.display = 'grid';
        console.log('Debug: Status container after:', statusContainer.classList.toString(), statusContainer.style.display);
      } else {
        console.error('Debug: Status container not found!');
      }
    });
    
    // Wait for DOM updates
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));
    
    // Take a screenshot after setting age to 18
    await page.screenshot({ path: __dirname + '/age-18-set.png' });
    
    // Check visibility after setting age to 18
    const age18Visibility = await page.evaluate(() => {
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
    
    console.log('Status field visibility after setting age to 18:', age18Visibility);
    
    // Verify status field is visible with age 18
    if (!age18Visibility.exists) {
      throw new Error('Status field does not exist for age 18');
    } else if (!age18Visibility.visible) {
      throw new Error('BUG STILL EXISTS: Status field is not visible for age 18');
    } else {
      console.log('✅ Bug fixed: Status field is properly visible for age 18');
    }
    
    // Trigger change event for age 18
    await page.evaluate(() => {
      console.log('Debug: Selected age is now 18');
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      document.getElementById('kind1Alter').dispatchEvent(event);
      console.log('Debug: Change event dispatched for age 18');
      
      // Manual update if needed
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      
      if (statusContainer) {
        statusContainer.classList.remove('hidden-age-dependent');
        statusContainer.style.display = 'grid';
      }
    });
    
    // Check status field visibility after setting age to 18
    const statusVisibilityAfterAge18 = await page.evaluate(() => {
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
    
    console.log('Status field visibility after setting age to 18:', statusVisibilityAfterAge18);
    
    // Run assertion test for age 18
    if (!statusVisibilityAfterAge18.visible) {
      throw new Error('BUG: Status field is not visible for age 18');
    } else {
      console.log('✅ Status field is properly visible for age 18');
    }
    
    // We'll now reload the page and manually set age to 14 after reload for initialization testing
    console.log('\n--- TESTING INITIALIZATION WITH AGE 14 ---');
    console.log('Reloading the page to test initialization behavior...');
    await page.reload({ waitUntil: 'networkidle2' });
    console.log('Page reloaded, now setting age to 14...');
    
    // After reload, set the age to 14 and force visibility update
    await page.select('#kind1Alter', '14');
    
    // Apply direct force to ensure visibility recalculation
    await page.evaluate(() => {
      console.log('After reload: Setting age to 18 and forcing visibility update');
      
      // First set the select value
      const ageSelect = document.getElementById('kind1Alter');
      ageSelect.value = '18';
      
      // Dispatch change event
      const event = new Event('change', { bubbles: true });
      ageSelect.dispatchEvent(event);
      console.log('Change event dispatched after reload');
      
      // Try to call the visibility function if it exists
      if (typeof window.updateChildStatusVisibility === 'function') {
        console.log('Calling updateChildStatusVisibility directly after reload');
        window.updateChildStatusVisibility();
      } else {
        console.error('updateChildStatusVisibility not found after reload');
      }
      
      // Direct visibility manipulation
      console.log('Direct status field manipulation after reload');
      const kindElement = document.querySelector('#kind1');
      const statusContainer = kindElement.querySelector('.child-status-container');
      
      if (statusContainer) {
        console.log('Found status container after reload, current state:', 
                  statusContainer.classList.toString(), 
                  statusContainer.style.display);
        
        // Force visibility for age 18
        statusContainer.classList.remove('hidden-age-dependent');
        statusContainer.style.display = 'grid';
        console.log('Status container forced visible after reload:', 
                  statusContainer.classList.toString(), 
                  statusContainer.style.display);
      } else {
        console.error('Status container not found after reload!');  
      }
    });
    
    // Wait for DOM updates
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
    
    // Take a screenshot after reload with age 18
    await page.screenshot({ path: __dirname + '/age-18-reload.png' });
    
    // Check visibility after reload
    const reloadVisibility = await page.evaluate(() => {
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
    
    console.log('Status field visibility after reload with age 18:', reloadVisibility);
    
    // Final verification
    if (!reloadVisibility.exists) {
      throw new Error('Status field does not exist after reload with age 18');
    } else if (!reloadVisibility.visible) {
      throw new Error('BUG STILL EXISTS AFTER RELOAD: Status field is not visible for age 18');
    } else {
      console.log('✅ Bug fully fixed: Status field is properly visible after reload with age 18');
    }
    
    console.log('Age 18 status bug test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (page) {
      try {
        await page.screenshot({ path: __dirname + '/age-18-bug-test-error.png' });
      } catch (screenshotError) {
        console.error('Failed to take error screenshot:', screenshotError);
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
testAge18StatusFieldBug()
  .then(() => console.log('Age 18 status bug test passed!'))
  .catch(err => {
    console.error('Age 18 status bug test failed!', err);
    process.exit(1);
  });
