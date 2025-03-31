describe('Child Numbering Test', () => {
  beforeAll(async () => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    // Wait for the page to load completely
    await page.waitForSelector('#addChildBtn');
  });

  it('should correctly update child numbering when children are added and deleted', async () => {
    // Check that we start with one child named "Kind 1"
    await expect(page).toMatchElement('.child-title', { text: 'Kind 1' });
    
    // Add two more children (now we have 3 total)
    await page.click('#addChildBtn');
    await page.waitForSelector('.child-form:nth-child(2)');
    await expect(page).toMatchElement('.child-form:nth-child(2) .child-title', { text: 'Kind 2' });
    
    await page.click('#addChildBtn');
    await page.waitForSelector('.child-form:nth-child(3)');
    await expect(page).toMatchElement('.child-form:nth-child(3) .child-title', { text: 'Kind 3' });
    
    // Now delete the second child (Kind 2)
    await page.click('.child-form:nth-child(2) .delete-child');
    
    // Wait for reindexing to happen
    await page.waitForTimeout(500);
    
    // Verify we now have Kind 1 and Kind 2 (previously Kind 3)
    const childTitles = await page.$$eval('.child-title', elements => 
      elements.map(el => el.textContent.trim())
    );
    
    expect(childTitles).toHaveLength(2);
    expect(childTitles[0]).toBe('Kind 1');
    expect(childTitles[1]).toBe('Kind 2');
    
    // Now delete the first child
    await page.click('.child-form:nth-child(1) .delete-child');
    
    // Wait for reindexing to happen
    await page.waitForTimeout(500);
    
    // Verify we now have only Kind 1 (previously Kind 2)
    const newChildTitles = await page.$$eval('.child-title', elements => 
      elements.map(el => el.textContent.trim())
    );
    
    expect(newChildTitles).toHaveLength(1);
    expect(newChildTitles[0]).toBe('Kind 1');
    
    // Try to delete the last child (should not be possible)
    await page.click('.child-form:nth-child(1) .delete-child');
    
    // Wait for alert dialog
    await page.waitForFunction(() => window.confirm || window.alert);
    
    // Accept the alert
    await page.evaluate(() => {
      window.alert = jest.fn();
    });
    
    // Verify we still have Kind 1
    const finalChildTitles = await page.$$eval('.child-title', elements => 
      elements.map(el => el.textContent.trim())
    );
    
    expect(finalChildTitles).toHaveLength(1);
    expect(finalChildTitles[0]).toBe('Kind 1');
    
    // Check the JSON output to make sure the data structure is updated correctly
    const jsonContent = await page.$eval('#jsonOutput', el => el.textContent);
    const data = JSON.parse(jsonContent);
    
    expect(data.children).toHaveLength(1);
    expect(data.children[0].id).toBe(1);
  });
});
