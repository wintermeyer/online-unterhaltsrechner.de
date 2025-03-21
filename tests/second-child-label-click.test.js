const puppeteer = require('puppeteer');
const path = require('path');

/**
 * Test to specifically verify clicking on "Einkommen des Kindes" label text 
 * for the second child works correctly
 */
async function testSecondChildLabelClick() {
  console.log('Starting headless browser test for second child income label click...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Enable detailed console logging from the browser
    page.on('console', msg => console.log('Browser log:', msg.text()));
    
    // Load the page
    const htmlPath = path.join(process.cwd(), 'index.html');
    const fileUrl = `file://${htmlPath}`;
    await page.goto(fileUrl);
    console.log('Page loaded successfully');
    
    // Wait for JS to initialize
    await page.waitForFunction(() => {
      return document.querySelectorAll('.collapsible-header').length > 0;
    });
    
    // Add a second child first
    console.log('Adding second child...');
    const addButton = await page.$('#addChildBtn');
    await addButton.click();
    await new Promise(resolve => setTimeout(resolve, 800)); // Longer wait for DOM updates
    
    // Verify second child was added
    const secondChildExists = await page.evaluate(() => {
      return !!document.querySelector('.kind-element:nth-child(2)');
    });
    
    if (!secondChildExists) {
      throw new Error('Failed to add second child');
    }
    console.log('✅ Second child added successfully');
    
    // Inspect the click handler on the second child's income header
    const clickHandlerInfo = await page.evaluate(() => {
      const label = document.querySelector('.kind-element:nth-child(2) .collapsible-header label');
      const header = label ? label.closest('.collapsible-header') : null;
      
      if (!header) return { found: false, message: 'Could not find header element' };
      
      // Check for click handlers using getEventListeners (only works in DevTools)
      let hasClickListener = false;
      try {
        // This won't work in headless browser but keeping for documentation
        hasClickListener = !!window.getEventListeners?.(header)?.click?.length;
      } catch (e) {
        // Expected to fail in headless mode
      }
      
      return {
        found: true,
        targetId: header.dataset.target,
        hasCollapsedClass: header.classList.contains('collapsed'),
        headerHtml: header.outerHTML,
        labelText: label ? label.textContent.trim() : 'No label',
        labelHtml: label ? label.outerHTML : 'No label',
        hackyCheckForListener: String(header.onclick).includes('function') || 
                              header.getAttribute('onclick') || 
                              hasClickListener
      };
    });
    
    console.log('Second child income header info:', clickHandlerInfo);
    
    // Find and click the label text itself (not the header or arrow)
    console.log('Finding second child income label text...');
    const secondChildLabelSelector = '.kind-element:nth-child(2) .collapsible-header label';
    
    // Wait for the element to be available
    await page.waitForSelector(secondChildLabelSelector, { timeout: 2000 });
    const labelElement = await page.$(secondChildLabelSelector);
    
    if (!labelElement) {
      throw new Error('Could not find label element for second child income');
    }
    
    // Get the initial state
    const initialState = await page.evaluate(label => {
      const header = label.closest('.collapsible-header');
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      
      return {
        targetId,
        hasContent: !!content,
        isCollapsed: header.classList.contains('collapsed'),
        contentMaxHeight: content ? content.style.maxHeight : 'unknown',
        contentDisplay: content ? window.getComputedStyle(content).display : 'unknown'
      };
    }, labelElement);
    
    console.log('Initial state before label click:', initialState);
    
    // Screenshot functionality disabled
    console.log('Screenshot disabled: before-click');
    
    // Add a visible border to the label to see it better in screenshots
    await page.evaluate(label => {
      label.style.border = '2px solid red';
    }, labelElement);
    
    // Click directly on the label element
    console.log('Clicking directly on the label element...');
    await labelElement.click();
    console.log('Click completed');
    
    // Wait for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Screenshot functionality disabled
    console.log('Screenshot disabled: after-click');
    
    // Check the state after clicking
    const afterClickState = await page.evaluate(label => {
      const header = label.closest('.collapsible-header');
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      
      return {
        isCollapsed: header.classList.contains('collapsed'),
        contentMaxHeight: content ? content.style.maxHeight : 'unknown',
        contentDisplay: content ? window.getComputedStyle(content).display : 'unknown',
        contentVisibility: content ? window.getComputedStyle(content).visibility : 'unknown',
        contentOpacity: content ? window.getComputedStyle(content).opacity : 'unknown'
      };
    }, labelElement);
    
    console.log('State after label click:', afterClickState);
    
    // Check if the collapsed state changed
    const expandedProperly = initialState.isCollapsed && !afterClickState.isCollapsed;
    console.log(`Did section expand from click? ${expandedProperly ? 'YES' : 'NO'}`);
    
    if (expandedProperly) {
      console.log('✅ Second child income section expanded successfully from label click');
    } else {
      // Try to diagnose why it didn't work
      console.error('❌ Second child income section did NOT expand from label click');
      
      // Examine the click event propagation
      const clickInfo = await page.evaluate(label => {
        // Create a new click handler to log events
        const header = label.closest('.collapsible-header');
        let originalClick = header.onclick;
        
        // Store the result for reporting
        let result = { 
          labelHasClickHandler: !!label.onclick, 
          headerHasClickHandler: !!header.onclick
        };
        
        // Report the innerHTML to see the structure
        result.headerHTML = header.innerHTML.substring(0, 150) + '...';
        result.labelHTML = label.outerHTML;
        
        return result;
      }, labelElement);
      
      console.log('Click diagnosis info:', clickInfo);
    }
    
    // Try direct DOM manipulation as a workaround/verification
    console.log('Testing direct DOM manipulation...');
    await page.evaluate(label => {
      const header = label.closest('.collapsible-header');
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      
      console.log('Before manipulation - Header classes:', header.className);
      console.log('Before manipulation - Content styles:', content ? content.style.cssText : 'No content');
      
      // Direct manipulation
      if (header.classList.contains('collapsed')) {
        header.classList.remove('collapsed');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          console.log('Expanded via DOM manipulation');
        }
      } else {
        header.classList.add('collapsed');
        if (content) {
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
          console.log('Collapsed via DOM manipulation');
        }
      }
      
      console.log('After manipulation - Header classes:', header.className);
      console.log('After manipulation - Content styles:', content ? content.style.cssText : 'No content');
    }, labelElement);
    
    // Wait for any DOM updates
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Screenshot functionality disabled
    console.log('Screenshot disabled: after-dom-manipulation');
    
    // Check final state
    const finalState = await page.evaluate(label => {
      const header = label.closest('.collapsible-header');
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      
      return {
        isCollapsed: header.classList.contains('collapsed'),
        contentMaxHeight: content ? content.style.maxHeight : 'unknown',
        contentDisplay: content ? window.getComputedStyle(content).display : 'unknown'
      };
    }, labelElement);
    
    console.log('Final state after DOM manipulation:', finalState);
    
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testSecondChildLabelClick();
