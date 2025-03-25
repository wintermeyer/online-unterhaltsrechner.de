/**
 * Unterhalt Calculator - Test Suite
 * Simple test framework to verify application functionality
 */

// Import app functionality (for Node.js environment)
let app;
if (typeof window === 'undefined') {
    // Running in Node.js environment
    app = require('./app.js');
} else {
    // Running in browser
    app = window;
}

// Test framework
const TestSuite = {
    tests: [],
    passed: 0,
    failed: 0,
    
    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    },
    
    async runTests() {
        console.log('Starting tests...');
        this.passed = 0;
        this.failed = 0;
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                console.log(`✅ PASS: ${test.name}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ FAIL: ${test.name}`);
                console.error(`   Error: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
        
        return {
            passed: this.passed,
            failed: this.failed,
            total: this.tests.length
        };
    },
    
    // Helper: assert condition is true
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    },
    
    // Helper: assert values are equal
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    },
    
    // Helper: assert objects are deep equal
    assertDeepEqual(actual, expected, message) {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        
        if (actualStr !== expectedStr) {
            throw new Error(message || `Objects are not equal:\nExpected: ${expectedStr}\nActual: ${actualStr}`);
        }
    }
};

// Define tests
function defineTests() {
    // System test for page initialization, child addition and URL sharing
    TestSuite.addTest('System test - Page init, child addition, and URL sharing', async () => {
        console.log('Running system test for child addition and URL sharing...');
        // Reset state and DOM for test
        document.getElementById('children-container').innerHTML = '';
        app.appState = {
            parents: {
                father: { income: 2000, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 },
                mother: { income: 0, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 }
            },
            children: [],
            nextChildId: 1
        };
        
        // 1. Start with fresh page and verify one child is added by default
        app.init();
        
        // Verify that we have exactly one child
        TestSuite.assertEqual(app.appState.children.length, 1, 'Fresh page should have one child');
        TestSuite.assertEqual(document.querySelectorAll('.child-card').length, 1, 'DOM should show one child');
        
        // 2. Add a second child with age 16
        app.addChild();
        
        // Get the second child element and set age to 16
        const childCards = document.querySelectorAll('.child-card');
        const secondChild = childCards[1];
        const ageSelect = secondChild.querySelector('.child-age');
        ageSelect.value = '16';
        
        // Trigger change event to update state
        const changeEvent = new Event('change');
        ageSelect.dispatchEvent(changeEvent);
        
        // Verify child was added to state with age 16
        TestSuite.assertEqual(app.appState.children.length, 2, 'Should have two children after adding one');
        TestSuite.assertEqual(app.appState.children[1].age, 16, 'Second child should have age 16');
        
        // 3. Get the shareable URL
        app.updateShareUrl();
        const shareUrl = document.getElementById('share-url').value;
        
        // Extract the query parameters
        const queryString = shareUrl.split('?')[1];
        
        // 4. Create a new state with the URL parameters
        const originalWindowLocation = window.location;
        delete window.location;
        window.location = {
            search: `?${queryString}`,
            href: `http://example.com?${queryString}`
        };
        
        // Reset the state and reload from URL
        document.getElementById('children-container').innerHTML = '';
        app.appState = {
            parents: {
                father: { income: 2000, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 },
                mother: { income: 0, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 }
            },
            children: [],
            nextChildId: 1
        };
        
        // Load state from URL and initialize app (which should handle rendering)
        // The bug was that initialization would add an extra child even when loading from URL
        app.loadStateFromUrl();
        app.init(); // This should handle loading children correctly without adding extras
        
        // 5. Verify the loaded state has two children and second has age 16
        TestSuite.assertEqual(app.appState.children.length, 2, 'Loaded state should have two children');
        TestSuite.assertEqual(app.appState.children[1].age, 16, 'Second child in loaded state should have age 16');
        
        // 6. Verify DOM has exactly two children (not 3, which would indicate an extra child was added)
        const loadedChildCards = document.querySelectorAll('.child-card');
        TestSuite.assertEqual(loadedChildCards.length, 2, 'DOM should show exactly two children after loading from URL (no extras)');  
        
        // 7. Verify children's properties are preserved
        const loadedFirstChildId = loadedChildCards[0].dataset.childId;
        const loadedSecondChildId = loadedChildCards[1].dataset.childId;
        TestSuite.assertEqual(loadedFirstChildId, '1', 'First child should have ID 1');
        TestSuite.assertEqual(loadedSecondChildId, '2', 'Second child should have ID 2');
        
        const loadedSecondChildAge = loadedChildCards[1].querySelector('.child-age').value;
        TestSuite.assertEqual(loadedSecondChildAge, '16', 'Second child in DOM should have age 16');
        
        // 8. Verify nextChildId is set correctly
        TestSuite.assertEqual(app.appState.nextChildId, 3, 'Next child ID should be 3 after loading 2 children');
        
        // Restore window.location
        window.location = originalWindowLocation;
    });
    
    // System test for child renumbering after deletion
    TestSuite.addTest('System test - Child renumbering after deletion', async () => {
        console.log('Running system test for child renumbering...');
        
        // Reset state and DOM for test
        document.getElementById('children-container').innerHTML = '';
        app.appState = {
            parents: {
                father: { income: 2000, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 },
                mother: { income: 0, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 }
            },
            children: [],
            nextChildId: 1
        };
        
        // 1. Add three children
        app.addChild(); // Child 1
        app.addChild(); // Child 2
        app.addChild(); // Child 3
        
        // Verify that we have exactly three children with sequential IDs and titles
        TestSuite.assertEqual(app.appState.children.length, 3, 'Should have three children after adding three');
        
        const childCards = document.querySelectorAll('.child-card');
        TestSuite.assertEqual(childCards.length, 3, 'DOM should show three children');
        
        // Verify IDs and titles of all three children
        TestSuite.assertEqual(childCards[0].dataset.childId, '1', 'First child should have ID 1');
        TestSuite.assertEqual(childCards[0].querySelector('.child-title').textContent, 'Kind 1', 'First child should have title "Kind 1"');
        
        TestSuite.assertEqual(childCards[1].dataset.childId, '2', 'Second child should have ID 2');
        TestSuite.assertEqual(childCards[1].querySelector('.child-title').textContent, 'Kind 2', 'Second child should have title "Kind 2"');
        
        TestSuite.assertEqual(childCards[2].dataset.childId, '3', 'Third child should have ID 3');
        TestSuite.assertEqual(childCards[2].querySelector('.child-title').textContent, 'Kind 3', 'Third child should have title "Kind 3"');
        
        // 2. Set different ages for each child to track them
        // Set first child to age 5
        const ageSelect1 = childCards[0].querySelector('.child-age');
        ageSelect1.value = '5';
        const changeEvent1 = new Event('change');
        ageSelect1.dispatchEvent(changeEvent1);
        
        // Set second child to age 10
        const ageSelect2 = childCards[1].querySelector('.child-age');
        ageSelect2.value = '10';
        const changeEvent2 = new Event('change');
        ageSelect2.dispatchEvent(changeEvent2);
        
        // Set third child to age 15
        const ageSelect3 = childCards[2].querySelector('.child-age');
        ageSelect3.value = '15';
        const changeEvent3 = new Event('change');
        ageSelect3.dispatchEvent(changeEvent3);
        
        // Verify ages are set in state
        TestSuite.assertEqual(app.appState.children[0].age, 5, 'First child should have age 5');
        TestSuite.assertEqual(app.appState.children[1].age, 10, 'Second child should have age 10');
        TestSuite.assertEqual(app.appState.children[2].age, 15, 'Third child should have age 15');
        
        // 3. Delete the second child (ID 2, age 10)
        app.removeChild(2);
        
        // 4. Verify renumbering occurred
        // Should now have 2 children
        TestSuite.assertEqual(app.appState.children.length, 2, 'Should have two children after deletion');
        
        // Verify the state has been updated with proper IDs
        TestSuite.assertEqual(app.appState.children[0].id, 1, 'First child should still have ID 1');
        TestSuite.assertEqual(app.appState.children[1].id, 2, 'Previous third child should now have ID 2');
        
        // Verify state maintained the correct ages after renumbering
        TestSuite.assertEqual(app.appState.children[0].age, 5, 'First child should still have age 5');
        TestSuite.assertEqual(app.appState.children[1].age, 15, 'Second child (formerly third) should have age 15');
        
        // Verify nextChildId is updated correctly
        TestSuite.assertEqual(app.appState.nextChildId, 3, 'Next child ID should be 3 after renumbering');
        
        // 5. Verify DOM reflects the changes
        const updatedChildCards = document.querySelectorAll('.child-card');
        TestSuite.assertEqual(updatedChildCards.length, 2, 'DOM should show two children after deletion');
        
        // Verify IDs and titles
        TestSuite.assertEqual(updatedChildCards[0].dataset.childId, '1', 'First child should have ID 1');
        TestSuite.assertEqual(updatedChildCards[0].querySelector('.child-title').textContent, 'Kind 1', 'First child should have title "Kind 1"');
        
        TestSuite.assertEqual(updatedChildCards[1].dataset.childId, '2', 'Second child (formerly third) should have ID 2');
        TestSuite.assertEqual(updatedChildCards[1].querySelector('.child-title').textContent, 'Kind 2', 'Second child should have title "Kind 2"');
        
        // Verify ages preserved through renumbering
        TestSuite.assertEqual(updatedChildCards[0].querySelector('.child-age').value, '5', 'First child should still have age 5 in DOM');
        TestSuite.assertEqual(updatedChildCards[1].querySelector('.child-age').value, '15', 'Second child (formerly third) should have age 15 in DOM');
        
        // 6. Update share URL and check it reflects renumbered children
        app.updateShareUrl();
        const shareUrl = document.getElementById('share-url').value;
        
        // Extract query parameters
        const queryString = shareUrl.split('?')[1];
        const params = new URLSearchParams(queryString);
        
        // Verify URL has correct parameters
        TestSuite.assertEqual(params.get('nc'), '2', 'URL should show 2 children');
        TestSuite.assertEqual(params.get('c1a'), '5', 'URL should show first child with age 5');
        TestSuite.assertEqual(params.get('c2a'), '15', 'URL should show second child with age 15');
        
        // 7. Test that adding a new child after deleting works correctly
        app.addChild(); // Should be Child 3 now
        
        const finalChildCards = document.querySelectorAll('.child-card');
        TestSuite.assertEqual(finalChildCards.length, 3, 'DOM should show three children after adding one back');
        TestSuite.assertEqual(finalChildCards[2].dataset.childId, '3', 'New child should have ID 3');
        TestSuite.assertEqual(finalChildCards[2].querySelector('.child-title').textContent, 'Kind 3', 'New child should have title "Kind 3"');
    });
    
    // Test income group calculation
    TestSuite.addTest('Income group calculation', () => {
        const mockState = {
            parents: {
                father: { income: 1000 },
                mother: { income: 500 }
            }
        };
        
        // Mock appState
        const originalState = { ...app.appState };
        app.appState = mockState;
        
        // Test income group calculation
        app.updateIncomeGroup();
        TestSuite.assertEqual(document.getElementById('income-group').textContent, 'bis 2100 €');
        
        // Test different income levels
        app.appState.parents.father.income = 1500;
        app.appState.parents.mother.income = 1500;
        app.updateIncomeGroup();
        TestSuite.assertEqual(document.getElementById('income-group').textContent, '2101 € - 3000 €');
        
        app.appState.parents.father.income = 2000;
        app.appState.parents.mother.income = 2000;
        app.updateIncomeGroup();
        TestSuite.assertEqual(document.getElementById('income-group').textContent, '3001 € - 4000 €');
        
        app.appState.parents.father.income = 2500;
        app.appState.parents.mother.income = 2500;
        app.updateIncomeGroup();
        TestSuite.assertEqual(document.getElementById('income-group').textContent, '4001 € - 5000 €');
        
        app.appState.parents.father.income = 3000;
        app.appState.parents.mother.income = 3000;
        app.updateIncomeGroup();
        TestSuite.assertEqual(document.getElementById('income-group').textContent, 'über 5000 €');
        
        // Restore original state
        app.appState = originalState;
    });
    
    // Test URL parameter generation and parsing
    TestSuite.addTest('URL parameters generation and parsing', () => {
        // Set up a mock state
        const testState = {
            parents: {
                father: {
                    income: 3000,      // Different from default
                    otherIncome: 500,  // Different from default
                    housingBenefit: 0, // Same as default
                    debtExpenses: 200  // Different from default
                },
                mother: {
                    income: 2000,      // Different from default
                    otherIncome: 0,    // Same as default
                    housingBenefit: 0, // Same as default
                    debtExpenses: 0    // Same as default
                }
            },
            children: [
                {
                    id: 1,
                    age: 8,             // Different from default
                    livingCenter: 'father', // Different from default
                    benefitReceiver: 'father', // Different from default
                    status: 'school',    // Same as default
                    jobIncome: 0,        // Same as default
                    otherIncome: 0        // Same as default
                },
                {
                    id: 2,
                    age: 6,             // Same as default
                    livingCenter: 'mother', // Same as default
                    benefitReceiver: 'mother', // Same as default
                    status: 'kindergarten', // Different from default
                    jobIncome: 0,        // Same as default
                    otherIncome: 50       // Different from default
                }
            ],
            nextChildId: 3
        };
        
        // Replace app state with test state
        const originalState = JSON.parse(JSON.stringify(app.appState));
        app.appState = testState;
        
        // Update URL with the test state
        app.updateShareUrl();
        
        // Get the generated URL
        const generatedUrl = document.getElementById('share-url').value;
        
        // Extract just the query parameters
        const queryString = generatedUrl.split('?')[1];
        const params = new URLSearchParams(queryString);
        
        // Check that params include only the differing values
        TestSuite.assertEqual(params.get('fi'), '3000');
        TestSuite.assertEqual(params.get('foi'), '500');
        TestSuite.assertEqual(params.get('fde'), '200');
        TestSuite.assertEqual(params.get('mi'), '2000');
        TestSuite.assertEqual(params.has('moi'), false); // Default value, should not be included
        TestSuite.assertEqual(params.get('nc'), '2'); // 2 children
        TestSuite.assertEqual(params.get('c1a'), '8');
        TestSuite.assertEqual(params.get('c1lc'), 'father');
        TestSuite.assertEqual(params.get('c1br'), 'father');
        TestSuite.assertEqual(params.has('c1s'), false); // Default value, should not be included
        TestSuite.assertEqual(params.get('c2s'), 'kindergarten');
        TestSuite.assertEqual(params.get('c2oi'), '50');
        
        // Now test parsing the URL back into state
        // Mock the window.location.search property
        const originalWindowLocation = window.location;
        delete window.location;
        window.location = {
            search: `?${queryString}`,
            href: `http://example.com?${queryString}`
        };
        
        // Create a clean state to load into
        const cleanState = {
            parents: {
                father: { income: 2000, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 },
                mother: { income: 0, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 }
            },
            children: [],
            nextChildId: 1
        };
        
        app.appState = cleanState;
        
        // Load state from URL
        app.loadStateFromUrl();
        
        // Verify loaded state matches original test state
        TestSuite.assertEqual(app.appState.parents.father.income, 3000);
        TestSuite.assertEqual(app.appState.parents.father.otherIncome, 500);
        TestSuite.assertEqual(app.appState.parents.father.debtExpenses, 200);
        TestSuite.assertEqual(app.appState.parents.mother.income, 2000);
        TestSuite.assertEqual(app.appState.children.length, 2);
        TestSuite.assertEqual(app.appState.children[0].age, 8);
        TestSuite.assertEqual(app.appState.children[0].livingCenter, 'father');
        TestSuite.assertEqual(app.appState.children[0].benefitReceiver, 'father');
        TestSuite.assertEqual(app.appState.children[1].status, 'kindergarten');
        TestSuite.assertEqual(app.appState.children[1].otherIncome, 50);
        TestSuite.assertEqual(app.appState.nextChildId, 3);
        
        // Restore original state and window.location
        window.location = originalWindowLocation;
        app.appState = originalState;
    });
    
    // Test adding and removing children
    TestSuite.addTest('Adding and removing children', () => {
        // Clear any existing children
        document.getElementById('children-container').innerHTML = '';
        
        // Reset app state
        app.appState = {
            parents: {
                father: { income: 2000, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 },
                mother: { income: 0, otherIncome: 0, housingBenefit: 0, debtExpenses: 0 }
            },
            children: [],
            nextChildId: 1
        };
        
        // Add a child
        app.addChild();
        
        // Verify child was added to state
        TestSuite.assertEqual(app.appState.children.length, 1);
        TestSuite.assertEqual(app.appState.children[0].id, 1);
        
        // Verify child was added to DOM
        const childCards = document.querySelectorAll('.child-card');
        TestSuite.assertEqual(childCards.length, 1);
        
        // Add another child
        app.addChild();
        
        // Verify second child was added
        TestSuite.assertEqual(app.appState.children.length, 2);
        TestSuite.assertEqual(app.appState.children[1].id, 2);
        TestSuite.assertEqual(document.querySelectorAll('.child-card').length, 2);
        
        // Remove first child
        app.removeChild(1);
        
        // Verify child was removed
        TestSuite.assertEqual(app.appState.children.length, 1);
        TestSuite.assertEqual(app.appState.children[0].id, 2);
        TestSuite.assertEqual(document.querySelectorAll('.child-card').length, 1);
    });
}

// Run tests if in browser
if (typeof window !== 'undefined') {
    window.runTests = async function() {
        defineTests();
        return await TestSuite.runTests();
    };
    
    // Auto-run tests after 1 second (give time for app to initialize)
    setTimeout(async () => {
        console.log('Auto-running tests...');
        const results = await window.runTests();
        
        // Display results on page
        const testResultsDiv = document.createElement('div');
        testResultsDiv.id = 'test-results';
        testResultsDiv.style.position = 'fixed';
        testResultsDiv.style.bottom = '10px';
        testResultsDiv.style.right = '10px';
        testResultsDiv.style.backgroundColor = results.failed > 0 ? '#ffeeee' : '#eeffee';
        testResultsDiv.style.padding = '10px';
        testResultsDiv.style.borderRadius = '5px';
        testResultsDiv.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
        testResultsDiv.style.zIndex = '1000';
        
        testResultsDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Test Results</div>
            <div style="color: green;">✅ Passed: ${results.passed}</div>
            <div style="color: red;">❌ Failed: ${results.failed}</div>
            <button id="hide-test-results" style="margin-top: 5px; padding: 2px 5px; background-color: #ddd; border: none; border-radius: 3px;">Hide</button>
            <button id="rerun-tests" style="margin-top: 5px; margin-left: 5px; padding: 2px 5px; background-color: #ddd; border: none; border-radius: 3px;">Re-run Tests</button>
        `;
        
        document.body.appendChild(testResultsDiv);
        
        // Add event listeners to buttons
        document.getElementById('hide-test-results').addEventListener('click', () => {
            testResultsDiv.style.display = 'none';
        });
        
        document.getElementById('rerun-tests').addEventListener('click', async () => {
            testResultsDiv.style.display = 'none';
            document.getElementById('children-container').innerHTML = '';
            window.runTests();
        });
    }, 1000);
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TestSuite,
        defineTests
    };
}
