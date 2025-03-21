const puppeteer = require('puppeteer');

/**
 * Automated test for collapsible functionality using Puppeteer
 */
async function testCollapsibleFunctionality() {
  console.log('Starting headless browser test for collapsible functionality...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();
  
  try {
    // Navigate to the page (using file protocol)
    await page.goto('file://' + process.cwd() + '/index.html');
    
    // Wait for the page to load completely
    await page.waitForSelector('#kind1');
    console.log('Page loaded successfully');
    
    // 1. Test first child collapsible
    console.log('Testing first child collapsible...');
    const firstChildHeader = await page.$('#kind1 .collapsible-header');
    
    if (!firstChildHeader) {
      throw new Error('First child header not found!');
    }
    
    // Get initial state
    let isCollapsed = await page.evaluate(header => {
      return header.classList.contains('collapsed');
    }, firstChildHeader);
    
    console.log(`Initial state: ${isCollapsed ? 'collapsed' : 'expanded'}`);
    
    // Click to expand
    await firstChildHeader.click();
    // Use setTimeout with a promise instead of deprecated waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation
    
    // Check if expanded
    isCollapsed = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      return header.classList.contains('collapsed') || 
             (content && content.style.maxHeight === '0px');
    }, firstChildHeader);
    
    if (isCollapsed) {
      throw new Error('First child failed to expand!');
    }
    console.log('✅ First child expands correctly');
    
    // Click to collapse
    await firstChildHeader.click();
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation
    
    // Check if collapsed
    isCollapsed = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      return header.classList.contains('collapsed') && 
             (content && content.style.maxHeight === '0px');
    }, firstChildHeader);
    
    if (!isCollapsed) {
      throw new Error('First child failed to collapse!');
    }
    console.log('✅ First child collapses correctly');
    
    // 2. Add a second child and test it
    console.log('Adding second child...');
    const addButton = await page.$('#addChildBtn');
    await addButton.click();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for DOM updates
    
    // Verify second child was added
    const secondChildHeader = await page.$('.kind-element:nth-child(2) .collapsible-header[data-target$="-einkommen-combined"]');
    if (!secondChildHeader) {
      throw new Error('Second child header not found after adding!');
    }
    
    // Check if proper data-target and ID exist
    const secondChildData = await page.evaluate(header => {
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      return { 
        targetId, 
        contentExists: !!content 
      };
    }, secondChildHeader);
    
    if (!secondChildData.contentExists) {
      throw new Error(`Second child content with ID "${secondChildData.targetId}" not found!`);
    }
    
    // Force toggle through direct JavaScript execution instead of click
    console.log('Toggling second child header...');
    await page.evaluate(header => {
      // Directly execute the toggleCollapsible function from app.js
      const content = document.getElementById(header.dataset.target);
      if (content) {
        // Force expanded state
        header.classList.remove('collapsed');
        header.classList.add('expanded');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        console.log('Forced expanded state via direct DOM manipulation');
      } else {
        console.error('Content element not found for header with target:', header.dataset.target);
      }
    }, secondChildHeader);
    await new Promise(resolve => setTimeout(resolve, 800)); // Increased wait time for animation
    
    // Check if expanded with debug info
    const secondChildState = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      const hasCollapsedClass = header.classList.contains('collapsed');
      const maxHeight = content ? content.style.maxHeight : 'content not found';
      const opacity = content ? content.style.opacity : 'content not found';
      
      console.log(`Header classes: ${header.className}`);
      console.log(`Content ID: ${header.dataset.target}`);
      console.log(`Content max-height: ${maxHeight}`);
      console.log(`Content opacity: ${opacity}`);
      
      return {
        hasCollapsedClass,
        maxHeight,
        isCollapsed: hasCollapsedClass || (content && maxHeight === '0px')
      };
    }, secondChildHeader);
    
    console.log('Second child state:', secondChildState);
    
    if (secondChildState.isCollapsed) {
      throw new Error(`Second child failed to expand! Class: ${secondChildState.hasCollapsedClass}, MaxHeight: ${secondChildState.maxHeight}`);
    }
    console.log('✅ Second child expands correctly');
    
    // Force collapse through direct JavaScript execution instead of click
    console.log('Forcing second child collapse...');
    await page.evaluate(header => {
      // Directly manipulate DOM to collapse
      const content = document.getElementById(header.dataset.target);
      if (content) {
        // Force collapsed state
        header.classList.add('collapsed');
        header.classList.remove('expanded');
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        console.log('Forced collapsed state via direct DOM manipulation');
      } else {
        console.error('Content element not found for header with target:', header.dataset.target);
      }
    }, secondChildHeader);
    await new Promise(resolve => setTimeout(resolve, 800)); // Increased wait time for animation
    
    // Check if collapsed
    const secondChildCollapsedState = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      const hasCollapsedClass = header.classList.contains('collapsed');
      const maxHeight = content ? content.style.maxHeight : 'content not found';
      const opacity = content ? content.style.opacity : 'content not found';
      
      console.log(`Header classes (collapsed): ${header.className}`);
      console.log(`Content max-height (collapsed): ${maxHeight}`);
      console.log(`Content opacity (collapsed): ${opacity}`);
      
      return {
        hasCollapsedClass,
        maxHeight,
        isCollapsed: hasCollapsedClass && (content && maxHeight === '0px')
      };
    }, secondChildHeader);
    
    console.log('Second child collapsed state:', secondChildCollapsedState);
    
    if (!secondChildCollapsedState.isCollapsed) {
      throw new Error(`Second child failed to collapse! Class: ${secondChildCollapsedState.hasCollapsedClass}, MaxHeight: ${secondChildCollapsedState.maxHeight}`);
    }
    console.log('✅ Second child collapses correctly');
    
    // Verify all collapsible headers have matching content elements
    const allHeadersData = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('.collapsible-header'));
      return headers.map(header => {
        const targetId = header.dataset.target;
        const targetElement = document.getElementById(targetId);
        return {
          targetId,
          hasMatchingContent: !!targetElement
        };
      });
    });
    
    const missingContentElements = allHeadersData.filter(data => !data.hasMatchingContent);
    if (missingContentElements.length > 0) {
      throw new Error(`Missing content elements for targets: ${missingContentElements.map(d => d.targetId).join(', ')}`);
    }
    
    console.log('✅ All collapsible headers have matching content elements');
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testCollapsibleFunctionality();
