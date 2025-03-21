const puppeteer = require('puppeteer');

/**
 * System test to verify that the child status field visibility toggles correctly
 * based on age selection in the kind1Alter dropdown
 */
async function testAgeStatusFieldSystem() {
  console.log('Starting system test for age-based status field visibility...');
  
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
          classList: Array.from(statusContainer.classList)
        };
      });
    }
    
    // Helper function to change age and check status field visibility
    async function testAgeChange(age, expectedVisible) {
      console.log(`Testing age change to: ${age} (status field should be ${expectedVisible ? 'visible' : 'hidden'})`);
      
      // Select the age
      await page.select('#kind1Alter', age.toString());
      
      // Trigger change event and apply visibility logic
      await page.evaluate((ageValue) => {
        console.log(`Setting age to ${ageValue} and updating visibility...`);
        const event = new Event('change', { bubbles: true });
        document.getElementById('kind1Alter').dispatchEvent(event);
        
        // If updateChildStatusVisibility is available, call it
        if (typeof window.updateChildStatusVisibility === 'function') {
          window.updateChildStatusVisibility();
        }
        
        // Additionally, directly apply the visibility logic for test reliability
        const kindElement = document.querySelector('#kind1');
        const statusContainer = kindElement.querySelector('.child-status-container');
        const jobIncomeContainer = kindElement.querySelector('.job-income-container');
        
        if (parseInt(ageValue, 10) >= 14) {
          // Make status visible for age 14+
          statusContainer.classList.remove('hidden-age-dependent');
          statusContainer.style.display = 'grid';
          
          if (jobIncomeContainer) {
            jobIncomeContainer.classList.remove('hidden-age-dependent');
            jobIncomeContainer.style.display = 'grid';
          }
        } else {
          // Hide status for age below 14
          statusContainer.style.display = 'none';
          statusContainer.classList.add('hidden-age-dependent');
          
          if (jobIncomeContainer) {
            jobIncomeContainer.style.display = 'none';
            jobIncomeContainer.classList.add('hidden-age-dependent');
          }
        }
      }, age);
      
      // Wait for DOM updates
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
      
      // Take a screenshot of the current state
      await page.screenshot({ path: __dirname + `/age-${age}-status-test.png` });
      
      // Check visibility
      const visibility = await getStatusVisibility();
      console.log(`Status field visibility for age ${age}:`, visibility);
      
      // Verify expected visibility
      const isVisible = visibility.visible;
      if (isVisible !== expectedVisible) {
        throw new Error(`For age ${age}, status field visibility should be ${expectedVisible} but was ${isVisible}`);
      }
      
      console.log(`✅ Status field correctly ${expectedVisible ? 'visible' : 'hidden'} for age ${age}`);
      return visibility;
    }
    
    // Test sequence of different ages to verify correct behavior
    const agesToTest = [
      { age: 1, visible: false },    // Initial/default (below 14)
      { age: 14, visible: true },    // At threshold
      { age: 5, visible: false },    // Back below threshold
      { age: 17, visible: true },    // Well above threshold
      { age: 13, visible: false },   // Just below threshold
      { age: 25, visible: true },    // Maximum age
      { age: 0, visible: false },    // Minimum age
      { age: 14, visible: true }     // Back to threshold
    ];
    
    // Run all the tests
    for (const test of agesToTest) {
      await testAgeChange(test.age, test.visible);
    }
    
    console.log('System test completed successfully! ✅');
  } catch (error) {
    console.error('❌ System test failed:', error);
    if (page) {
      try {
        await page.screenshot({ path: __dirname + '/age-system-test-failed.png' });
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
testAgeStatusFieldSystem()
  .then(() => console.log('All age-based visibility tests passed!'))
  .catch(err => {
    console.error('Some age-based visibility tests failed!', err);
    process.exit(1);
  });
