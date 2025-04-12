// Import the functions to test
const { calculateBerufsbedingteAufwände } = require('../js/berechnung.js');

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value || 0);
}

function runTests() {
    const testCases = [
        {
            name: "No income",
            income: 0,
            expectedAufwände: 0,
            expectedBereinigt: 0
        },
        {
            name: "Very low income (40€)",
            income: 40,
            expectedAufwände: 40,  // Should be capped at income amount
            expectedBereinigt: 0
        },
        {
            name: "Low income (500€)",
            income: 500,
            expectedAufwände: 50,  // Minimum applies
            expectedBereinigt: 450
        },
        {
            name: "Medium income (2000€)",
            income: 2000,
            expectedAufwände: 100,  // 5% of 2000
            expectedBereinigt: 1900
        },
        {
            name: "High income (4000€)",
            income: 4000,
            expectedAufwände: 150,  // Maximum applies
            expectedBereinigt: 3850
        }
    ];

    let allTestsPassed = true;
    const results = [];

    testCases.forEach(testCase => {
        const aufwände = calculateBerufsbedingteAufwände(testCase.income);
        const bereinigt = testCase.income - aufwände;
        
        const aufwändeMatch = Math.abs(aufwände - testCase.expectedAufwände) < 0.01;
        const bereinigtMatch = Math.abs(bereinigt - testCase.expectedBereinigt) < 0.01;
        
        const passed = aufwändeMatch && bereinigtMatch;
        allTestsPassed = allTestsPassed && passed;

        results.push({
            ...testCase,
            actualAufwände: aufwände,
            actualBereinigt: bereinigt,
            passed
        });
    });

    // Log results in a readable format
    console.group('Test Results');
    results.forEach(result => {
        console.group(result.name + (result.passed ? ' ✅' : ' ❌'));
        console.log(`Income: ${formatCurrency(result.income)}`);
        console.log(`Aufwände: ${formatCurrency(result.actualAufwände)} (Expected: ${formatCurrency(result.expectedAufwände)})`);
        console.log(`Bereinigt: ${formatCurrency(result.actualBereinigt)} (Expected: ${formatCurrency(result.expectedBereinigt)})`);
        console.groupEnd();
    });
    console.log(`Overall Result: ${allTestsPassed ? 'All tests passed ✅' : 'Some tests failed ❌'}`);
    console.groupEnd();

    process.exit(allTestsPassed ? 0 : 1);
}

// Run tests if this file is being executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests }; 