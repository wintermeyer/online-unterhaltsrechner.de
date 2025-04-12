// Import the functions to test
const { calculateBerufsbedingteAufwände, getIncomeBracket, incomeBrackets } = require('../js/berechnung.js');

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value || 0);
}

function runAufwändeTests() {
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

    console.group('Berufsbedingte Aufwände Tests');
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

    results.forEach(result => {
        console.group(result.name + (result.passed ? ' ✅' : ' ❌'));
        console.log(`Income: ${formatCurrency(result.income)}`);
        console.log(`Aufwände: ${formatCurrency(result.actualAufwände)} (Expected: ${formatCurrency(result.expectedAufwände)})`);
        console.log(`Bereinigt: ${formatCurrency(result.actualBereinigt)} (Expected: ${formatCurrency(result.expectedBereinigt)})`);
        console.groupEnd();
    });
    console.groupEnd();

    return allTestsPassed;
}

function runIncomeBracketTests() {
    const testCases = [
        {
            name: "No income",
            income: 0,
            expectedBracket: "0 bis 2.100 €"
        },
        {
            name: "First bracket",
            income: 1500,
            expectedBracket: "0 bis 2.100 €"
        },
        {
            name: "Exact bracket boundary",
            income: 2101,
            expectedBracket: "2.101 - 2.500 €"
        },
        {
            name: "Middle of bracket",
            income: 4300,
            expectedBracket: "4.101 - 4.500 €"
        },
        {
            name: "High income",
            income: 5000,
            expectedBracket: "4.901 - 5.300 €"
        },
        {
            name: "Very high income",
            income: 24234,
            expectedBracket: "Über 11.200 €"
        }
    ];

    let allTestsPassed = true;
    const results = [];

    console.group('Income Bracket Tests');
    testCases.forEach(testCase => {
        const actualBracket = getIncomeBracket(testCase.income);
        const passed = actualBracket === testCase.expectedBracket;
        allTestsPassed = allTestsPassed && passed;

        results.push({
            ...testCase,
            actualBracket,
            passed
        });
    });

    results.forEach(result => {
        console.group(result.name + (result.passed ? ' ✅' : ' ❌'));
        console.log(`Income: ${formatCurrency(result.income)}`);
        console.log(`Bracket: "${result.actualBracket}" (Expected: "${result.expectedBracket}")`);
        console.groupEnd();
    });
    console.groupEnd();

    return allTestsPassed;
}

// Run all test suites
function runTests() {
    const aufwändeTestsPassed = runAufwändeTests();
    const bracketTestsPassed = runIncomeBracketTests();
    
    console.log(`\nOverall Result: ${aufwändeTestsPassed && bracketTestsPassed ? 'All tests passed ✅' : 'Some tests failed ❌'}`);
    
    process.exit(aufwändeTestsPassed && bracketTestsPassed ? 0 : 1);
}

// Run tests if this file is being executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests }; 