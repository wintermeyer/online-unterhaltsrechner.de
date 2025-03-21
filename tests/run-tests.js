/**
 * Main test runner
 * Executes all system tests and reports overall results
 */

console.log('Starting all system tests...');

// Array of test modules to run
const tests = [
  './child-status-visibility.test.js',
  './collapsible.test.js',
  './second-child-label-click.test.js',
  './child-income.test.js',
  './child-income-text-click.test.js',
  './initial-status-visibility.test.js'
  // Note: Some tests may be system-specific or require specific configurations
];

async function runTests() {
  let failures = 0;
  
  for (const test of tests) {
    console.log(`\n=====================================================`);
    console.log(`Running test: ${test}`);
    console.log(`=====================================================\n`);
    
    try {
      // Dynamic require to run each test
      require(test);
      console.log(`\n✅ Test ${test} completed without errors`);
    } catch (error) {
      console.error(`\n❌ Test ${test} failed:`, error);
      failures++;
    }
  }
  
  console.log(`\n=====================================================`);
  console.log(`Test run complete: ${tests.length - failures}/${tests.length} passed`);
  
  if (failures > 0) {
    console.error(`❌ ${failures} test(s) failed`);
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
  }
}

runTests();
