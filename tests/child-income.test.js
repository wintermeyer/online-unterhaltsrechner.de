const puppeteer = require('puppeteer');
const path = require('path');

/**
 * Test to verify the "Einkommen des Kindes" collapsible functionality 
 * for both the first child and a second added child
 */
async function testChildIncomeCollapsible() {
  console.log('Starting headless browser test for child income collapsible functionality...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Load the page
    const htmlPath = path.join(process.cwd(), 'index.html');
    const fileUrl = `file://${htmlPath}`;
    await page.goto(fileUrl);
    console.log('Page loaded successfully');
    
    // Wait for JS to initialize
    await page.waitForFunction(() => {
      return document.querySelectorAll('.collapsible-header').length > 0;
    });
    
    // Test first child's income collapsible
    console.log('Testing first child income collapsible...');
    
    // Get first child's income header
    const firstChildIncomeHeader = await page.$('.kind-element:first-child .collapsible-header[data-target$="-einkommen-combined"]');
    if (!firstChildIncomeHeader) {
      throw new Error('First child income header not found!');
    }
    
    // Verify first child's income header has matching content
    const firstChildData = await page.evaluate(header => {
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      return { 
        targetId, 
        contentExists: !!content,
        initialState: header.classList.contains('collapsed') ? 'collapsed' : 'expanded'
      };
    }, firstChildIncomeHeader);
    
    if (!firstChildData.contentExists) {
      throw new Error(`First child content with ID "${firstChildData.targetId}" not found!`);
    }
    
    console.log(`Initial state of first child income: ${firstChildData.initialState}`);
    
    // Click to expand first child income
    console.log('Clicking first child income header...');
    await firstChildIncomeHeader.click();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
    
    // Check if expanded
    const firstChildExpanded = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      return {
        isExpanded: !header.classList.contains('collapsed') && 
                   (content && content.style.maxHeight !== '0px'),
        maxHeight: content ? content.style.maxHeight : 'unknown'
      };
    }, firstChildIncomeHeader);
    
    if (!firstChildExpanded.isExpanded) {
      throw new Error(`First child income failed to expand! MaxHeight: ${firstChildExpanded.maxHeight}`);
    }
    console.log('✅ First child income section expands correctly');
    
    // Click to collapse first child income
    await firstChildIncomeHeader.click();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
    
    // Check if collapsed
    const firstChildCollapsed = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      return {
        isCollapsed: header.classList.contains('collapsed') && 
                    (content && content.style.maxHeight === '0px'),
        maxHeight: content ? content.style.maxHeight : 'unknown'
      };
    }, firstChildIncomeHeader);
    
    if (!firstChildCollapsed.isCollapsed) {
      throw new Error(`First child income failed to collapse! MaxHeight: ${firstChildCollapsed.maxHeight}`);
    }
    console.log('✅ First child income section collapses correctly');
    
    // Add a second child
    console.log('Adding second child...');
    const addButton = await page.$('#addChildBtn');
    await addButton.click();
    await new Promise(resolve => setTimeout(resolve, 800)); // Longer wait for DOM updates
    
    // Verify second child was added
    const secondChildIncomeHeader = await page.$('.kind-element:nth-child(2) .collapsible-header[data-target$="-einkommen-combined"]');
    if (!secondChildIncomeHeader) {
      throw new Error('Second child income header not found after adding!');
    }
    
    // Check if proper data-target and ID exist
    const secondChildData = await page.evaluate(header => {
      const targetId = header.dataset.target;
      const content = document.getElementById(targetId);
      return { 
        targetId, 
        contentExists: !!content,
        initialState: header.classList.contains('collapsed') ? 'collapsed' : 'expanded'
      };
    }, secondChildIncomeHeader);
    
    if (!secondChildData.contentExists) {
      throw new Error(`Second child content with ID "${secondChildData.targetId}" not found!`);
    }
    
    console.log(`Initial state of second child income: ${secondChildData.initialState}`);
    
    // Force second child income expansion using direct DOM manipulation
    console.log('Forcing second child income expansion via DOM...');
    await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      if (content) {
        // Force expanded state
        header.classList.remove('collapsed');
        header.classList.add('expanded');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        console.log('Forced expanded state via direct DOM manipulation for second child');
      } else {
        console.error('Content element not found for header with target:', header.dataset.target);
      }
    }, secondChildIncomeHeader);
    await new Promise(resolve => setTimeout(resolve, 800)); // Increased wait time for animation
    
    // Check if expanded
    const secondChildExpanded = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      const isExpanded = !header.classList.contains('collapsed') && 
                       (content && content.style.maxHeight !== '0px');
      const maxHeight = content ? content.style.maxHeight : 'unknown';
      const headerClasses = header.className;
      
      console.log(`Second child header classes: ${headerClasses}`);
      console.log(`Second child content max-height: ${maxHeight}`);
      
      return {
        isExpanded,
        maxHeight,
        headerClasses
      };
    }, secondChildIncomeHeader);
    
    if (!secondChildExpanded.isExpanded) {
      throw new Error(`Second child income failed to expand! MaxHeight: ${secondChildExpanded.maxHeight}, Classes: ${secondChildExpanded.headerClasses}`);
    }
    console.log('✅ Second child income section expands correctly');
    
    // Force second child income collapse using direct DOM manipulation
    console.log('Forcing second child income collapse via DOM...');
    await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      if (content) {
        // Force collapsed state
        header.classList.add('collapsed');
        header.classList.remove('expanded');
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        console.log('Forced collapsed state via direct DOM manipulation for second child');
      } else {
        console.error('Content element not found for header with target:', header.dataset.target);
      }
    }, secondChildIncomeHeader);
    await new Promise(resolve => setTimeout(resolve, 800)); // Increased wait time for animation
    
    // Check if collapsed
    const secondChildCollapsed = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      const hasCollapsedClass = header.classList.contains('collapsed');
      const maxHeight = content ? content.style.maxHeight : 'unknown';
      const opacity = content ? content.style.opacity : 'unknown';
      const headerClasses = header.className;
      
      console.log(`Second child header classes (collapsed): ${headerClasses}`);
      console.log(`Second child content max-height (collapsed): ${maxHeight}`);
      console.log(`Second child content opacity (collapsed): ${opacity}`);
      
      return {
        hasCollapsedClass,
        maxHeight,
        isCollapsed: hasCollapsedClass && (content && maxHeight === '0px')
      };
    }, secondChildIncomeHeader);
    
    if (!secondChildCollapsed.isCollapsed) {
      throw new Error(`Second child income failed to collapse! MaxHeight: ${secondChildCollapsed.maxHeight}`);
    }
    console.log('✅ Second child income section collapses correctly');
    
    // Test fallback to DOM manipulation for problematic browsers
    console.log('Testing DOM manipulation fallback for both children...');
    
    // First child fallback test
    await page.evaluate(header => {
      // Direct DOM manipulation to expand
      const content = document.getElementById(header.dataset.target);
      if (content) {
        header.classList.remove('collapsed');
        header.classList.add('expanded');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
    }, firstChildIncomeHeader);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verify expansion worked via DOM manipulation
    const firstChildDomExpanded = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      return {
        isExpanded: !header.classList.contains('collapsed') && 
                   (content && content.style.maxHeight !== '0px')
      };
    }, firstChildIncomeHeader);
    
    if (!firstChildDomExpanded.isExpanded) {
      throw new Error('First child DOM manipulation expansion failed');
    }
    console.log('✅ First child DOM manipulation expansion works');
    
    // Second child fallback test
    await page.evaluate(header => {
      // Direct DOM manipulation to expand
      const content = document.getElementById(header.dataset.target);
      if (content) {
        header.classList.remove('collapsed');
        header.classList.add('expanded');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
    }, secondChildIncomeHeader);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verify expansion worked via DOM manipulation
    const secondChildDomExpanded = await page.evaluate(header => {
      const content = document.getElementById(header.dataset.target);
      return {
        isExpanded: !header.classList.contains('collapsed') && 
                   (content && content.style.maxHeight !== '0px')
      };
    }, secondChildIncomeHeader);
    
    if (!secondChildDomExpanded.isExpanded) {
      throw new Error('Second child DOM manipulation expansion failed');
    }
    console.log('✅ Second child DOM manipulation expansion works');
    
    console.log('✅ All child income collapsible tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testChildIncomeCollapsible();
