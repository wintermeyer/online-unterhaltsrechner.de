/**
 * Test file to verify delete button visibility behavior
 * - Single child should NOT display delete button
 * - Multiple children should ALL display delete buttons
 * - When all but one child remains, delete button should disappear
 */

describe('Delete Button Visibility Test', () => {
  beforeAll(async () => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    // Wait for the page to load completely
    await page.waitForSelector('#addChildBtn');
  });

  it('should properly handle delete button visibility based on number of children', async () => {
    // 1. Initially with one child, verify delete button is NOT visible
    await page.waitForSelector('.child-form');
    
    const initialDeleteBtnVisible = await page.evaluate(() => {
      const deleteBtn = document.querySelector('.child-form .delete-child');
      const style = window.getComputedStyle(deleteBtn);
      return style.display !== 'none';
    });
    
    expect(initialDeleteBtnVisible).toBe(false);
    console.log('✅ PASS: Delete button is hidden with single child');
    
    // 2. Add a second child and verify BOTH children show delete buttons
    await page.click('#addChildBtn');
    await page.waitForSelector('.child-form:nth-child(2)');
    
    // Small delay to ensure DOM updates
    await page.waitForTimeout(500);
    
    const twoChildrenDeleteBtnsVisible = await page.evaluate(() => {
      const deleteBtns = document.querySelectorAll('.child-form .delete-child');
      return Array.from(deleteBtns).every(btn => {
        const style = window.getComputedStyle(btn);
        return style.display !== 'none';
      });
    });
    
    expect(twoChildrenDeleteBtnsVisible).toBe(true);
    console.log('✅ PASS: Delete buttons visible for both children when two children exist');
    
    // 3. Add a third child and verify ALL THREE children show delete buttons
    await page.click('#addChildBtn');
    await page.waitForSelector('.child-form:nth-child(3)');
    
    // Small delay to ensure DOM updates
    await page.waitForTimeout(500);
    
    const threeChildrenDeleteBtnsVisible = await page.evaluate(() => {
      const deleteBtns = document.querySelectorAll('.child-form .delete-child');
      return Array.from(deleteBtns).every(btn => {
        const style = window.getComputedStyle(btn);
        return style.display !== 'none';
      });
    });
    
    expect(threeChildrenDeleteBtnsVisible).toBe(true);
    console.log('✅ PASS: Delete buttons visible for all three children');
    
    // 4. Delete the 3rd child and verify the remaining TWO still show delete buttons
    await page.click('.child-form:nth-child(3) .delete-child');
    
    // Small delay to ensure DOM updates
    await page.waitForTimeout(500);
    
    const afterDeleteThirdChildBtnsVisible = await page.evaluate(() => {
      const deleteBtns = document.querySelectorAll('.child-form .delete-child');
      return Array.from(deleteBtns).every(btn => {
        const style = window.getComputedStyle(btn);
        return style.display !== 'none';
      });
    });
    
    expect(afterDeleteThirdChildBtnsVisible).toBe(true);
    console.log('✅ PASS: Delete buttons still visible for remaining two children');
    
    // 5. Delete the 2nd child and verify the LAST remaining child has NO delete button
    await page.click('.child-form:nth-child(2) .delete-child');
    
    // Small delay to ensure DOM updates
    await page.waitForTimeout(500);
    
    const lastChildDeleteBtnVisible = await page.evaluate(() => {
      const deleteBtn = document.querySelector('.child-form .delete-child');
      const style = window.getComputedStyle(deleteBtn);
      return style.display !== 'none';
    });
    
    expect(lastChildDeleteBtnVisible).toBe(false);
    console.log('✅ PASS: Delete button hidden for last remaining child');
  });
});
