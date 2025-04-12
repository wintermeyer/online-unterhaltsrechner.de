const { test, expect } = require('@playwright/test');

test('initial page state shows correct values and income groups', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:8080/index.html');
  
  // Wait for the JavaScript to execute
  await page.waitForLoadState('domcontentloaded');

  // Check initial values in result section
  const vaterNettoResult = await page.locator('#vater-netto-result').textContent();
  const mutterNettoResult = await page.locator('#mutter-netto-result').textContent();
  
  console.log('Vater result:', JSON.stringify(vaterNettoResult));
  console.log('Mutter result:', JSON.stringify(mutterNettoResult));

  // Use regular expressions to match the expected format
  expect(vaterNettoResult.trim()).toMatch(/^0,00\s*€$/);
  expect(mutterNettoResult.trim()).toMatch(/^0,00\s*€$/);

  // Check income groups
  const vaterNettoRange = await page.locator('#vater-netto-range').textContent();
  const mutterNettoRange = await page.locator('#mutter-netto-range').textContent();

  console.log('Vater range:', JSON.stringify(vaterNettoRange));
  console.log('Mutter range:', JSON.stringify(mutterNettoRange));

  // Use regular expressions to match the expected format
  expect(vaterNettoRange.trim()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(mutterNettoRange.trim()).toMatch(/^0 bis 2\.100\s*€$/);
});

test('dynamic updates while typing income value', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:8080/index.html');
  await page.waitForLoadState('domcontentloaded');

  // Get the input field and result elements
  const vaterInput = page.locator('#vater-netto');
  const vaterRange = page.locator('#vater-netto-range');
  const vaterResult = page.locator('#vater-netto-result');

  // Initial state check
  expect(await vaterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^0,00\s*€$/);

  // Type "5" - should still be in first bracket
  await vaterInput.type('5');
  expect(await vaterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^5,00\s*€$/);

  // Type "55" - still first bracket
  await vaterInput.type('5');
  expect(await vaterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^55,00\s*€$/);

  // Type "555" - still first bracket
  await vaterInput.type('5');
  expect(await vaterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^555,00\s*€$/);

  // Type "5555" - should change to "5.301 - 5.700 €"
  await vaterInput.type('5');
  expect(await vaterRange.textContent()).toMatch(/^5\.301 - 5\.700\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^5\.555,00\s*€$/);

  // Type "55555" - should show "Über 11.200 €"
  await vaterInput.type('5');
  expect(await vaterRange.textContent()).toBe('Über 11.200 €');
  expect(await vaterResult.textContent()).toMatch(/^55\.555,00\s*€$/);

  // Verify that clearing the input returns to initial state
  await vaterInput.fill('');
  expect(await vaterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^0,00\s*€$/);
});

test('dynamic updates while typing income value for Mutter', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:8080/index.html');
  await page.waitForLoadState('domcontentloaded');

  // Get the input field and result elements
  const mutterInput = page.locator('#mutter-netto');
  const mutterRange = page.locator('#mutter-netto-range');
  const mutterResult = page.locator('#mutter-netto-result');

  // Initial state check
  expect(await mutterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^0,00\s*€$/);

  // Type "5" - should still be in first bracket
  await mutterInput.type('5');
  expect(await mutterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^5,00\s*€$/);

  // Type "55" - still first bracket
  await mutterInput.type('5');
  expect(await mutterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^55,00\s*€$/);

  // Type "555" - still first bracket
  await mutterInput.type('5');
  expect(await mutterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^555,00\s*€$/);

  // Type "5555" - should change to "5.301 - 5.700 €"
  await mutterInput.type('5');
  expect(await mutterRange.textContent()).toMatch(/^5\.301 - 5\.700\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^5\.555,00\s*€$/);

  // Type "55555" - should show "Über 11.200 €"
  await mutterInput.type('5');
  expect(await mutterRange.textContent()).toBe('Über 11.200 €');
  expect(await mutterResult.textContent()).toMatch(/^55\.555,00\s*€$/);

  // Verify that clearing the input returns to initial state
  await mutterInput.fill('');
  expect(await mutterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^0,00\s*€$/);
});

test('simultaneous updates of both Vater and Mutter income fields', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:8080/index.html');
  await page.waitForLoadState('domcontentloaded');

  // Get all input fields and result elements
  const vaterInput = page.locator('#vater-netto');
  const mutterInput = page.locator('#mutter-netto');
  const vaterRange = page.locator('#vater-netto-range');
  const mutterRange = page.locator('#mutter-netto-range');
  const vaterResult = page.locator('#vater-netto-result');
  const mutterResult = page.locator('#mutter-netto-result');

  // Test different combinations of income brackets
  const testCases = [
    {
      vater: '2000',
      mutter: '3000',
      vaterBracket: '0 bis 2.100 €',
      mutterBracket: '2.901 - 3.300 €'
    },
    {
      vater: '4200',
      mutter: '4200',
      vaterBracket: '4.101 - 4.500 €',
      mutterBracket: '4.101 - 4.500 €'
    },
    {
      vater: '12000',
      mutter: '1500',
      vaterBracket: 'Über 11.200 €',
      mutterBracket: '0 bis 2.100 €'
    }
  ];

  for (const testCase of testCases) {
    // Set both values
    await vaterInput.fill(testCase.vater);
    await mutterInput.fill(testCase.mutter);

    // Verify ranges
    expect(await vaterRange.textContent()).toBe(testCase.vaterBracket);
    expect(await mutterRange.textContent()).toBe(testCase.mutterBracket);

    // Verify formatted results
    const expectedVaterResult = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
      .format(parseFloat(testCase.vater));
    const expectedMutterResult = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
      .format(parseFloat(testCase.mutter));

    expect(await vaterResult.textContent()).toBe(expectedVaterResult);
    expect(await mutterResult.textContent()).toBe(expectedMutterResult);
  }

  // Test clearing both fields
  await vaterInput.fill('');
  await mutterInput.fill('');

  // Verify both return to initial state
  expect(await vaterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await mutterRange.textContent()).toMatch(/^0 bis 2\.100\s*€$/);
  expect(await vaterResult.textContent()).toMatch(/^0,00\s*€$/);
  expect(await mutterResult.textContent()).toMatch(/^0,00\s*€$/);
}); 