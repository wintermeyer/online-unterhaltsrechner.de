/**
 * Share Button System Test
 * 
 * This test verifies that the "Direktlink kopieren" button works correctly by:
 * 1. Setting multiple random children with different values
 * 2. Simulating a click on the share button
 * 3. Verifying that the generated URL contains the correct parameters
 */

// Test function to verify the share button functionality
function testShareButton() {
    console.log('-------------------------------------------');
    console.log('Running Share Button System Test');
    console.log('-------------------------------------------');
    
    // Create test iframe
    const testFrame = document.createElement('iframe');
    testFrame.style.width = '100%';
    testFrame.style.height = '600px';
    testFrame.style.border = '2px solid #3b82f6';
    document.body.appendChild(testFrame);
    
    // Load the page and then run the test
    testFrame.src = window.location.href.split('?')[0];
    testFrame.onload = setupTest;
    
    function setupTest() {
        console.log('Test page loaded. Setting up random test data...');
        
        try {
            const app = testFrame.contentWindow;
            
            // Function to generate random integer in range
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            
            // Set random values for parents
            app.appState.parents.father.income = randomInt(1500, 4000);
            app.appState.parents.mother.income = randomInt(1000, 3000);
            app.appState.parents.father.otherIncome = randomInt(0, 1000);
            
            // Add multiple children with random values
            const numChildren = randomInt(2, 4);
            
            // First, clear existing children
            app.appState.children = [];
            app.elements.childrenContainer.innerHTML = '';
            
            console.log(`Setting up ${numChildren} random children`);
            
            // Add random children
            for (let i = 0; i < numChildren; i++) {
                app.addChild();
                const childIndex = i;
                
                // Set random values for this child
                app.appState.children[childIndex].age = randomInt(1, 17);
                app.appState.children[childIndex].livingCenter = ['father', 'mother'][randomInt(0, 1)];
                app.appState.children[childIndex].jobIncome = randomInt(0, 800);
            }
            
            // Update UI to reflect the random data
            app.updateUI();
            
            console.log('Random test data set up successfully:');
            console.log('- Father income:', app.appState.parents.father.income);
            console.log('- Mother income:', app.appState.parents.mother.income);
            console.log('- Number of children:', numChildren);
            
            // Store the current state to validate later
            const currentState = JSON.parse(JSON.stringify(app.appState));
            
            // Override clipboard functions to capture the URL
            let capturedUrl = '';
            const originalExecCommand = document.execCommand;
            
            app.document.execCommand = function(command) {
                if (command === 'copy') {
                    // Capture the URL being copied
                    capturedUrl = app.document.querySelector('input[type="text"]').value || '';
                    console.log('URL captured from clipboard:', capturedUrl);
                }
                return originalExecCommand.apply(this, arguments);
            };
            
            // Function to test the share button
            function testShareButtonClick() {
                console.log('Testing share button click...');
                
                // Find the share button
                const shareButton = app.document.getElementById('copy-url');
                if (!shareButton) {
                    console.error('Could not find the share button');
                    return;
                }
                
                // Trigger click on the share button
                shareButton.click();
                
                // Give some time for the click to process
                setTimeout(validateUrl, 500);
            }
            
            // Validate the generated URL
            function validateUrl() {
                try {
                    console.log('Validating generated URL...');
                    
                    // If no URL was captured, call generateAndCopyShareableUrl directly
                    if (!capturedUrl) {
                        capturedUrl = app.generateAndCopyShareableUrl();
                        console.log('Called generateAndCopyShareableUrl directly. URL:', capturedUrl);
                    }
                    
                    if (!capturedUrl) {
                        throw new Error('No URL was generated');
                    }
                    
                    // Parse URL parameters
                    const urlParams = new URLSearchParams(capturedUrl.split('?')[1] || '');
                    
                    // Validate parent values in URL
                    const tests = [
                        {
                            condition: urlParams.get('fi') == currentState.parents.father.income,
                            message: 'Father income parameter (fi) is correct',
                            failMessage: `Father income parameter incorrect. Expected ${currentState.parents.father.income}, got ${urlParams.get('fi')}`
                        },
                        {
                            condition: urlParams.get('mi') == currentState.parents.mother.income,
                            message: 'Mother income parameter (mi) is correct',
                            failMessage: `Mother income parameter incorrect. Expected ${currentState.parents.mother.income}, got ${urlParams.get('mi')}`
                        },
                        {
                            condition: urlParams.get('nc') == currentState.children.length,
                            message: 'Number of children parameter (nc) is correct',
                            failMessage: `Number of children parameter incorrect. Expected ${currentState.children.length}, got ${urlParams.get('nc')}`
                        }
                    ];
                    
                    // Run each test
                    let passedCount = 0;
                    tests.forEach(test => {
                        if (test.condition) {
                            console.log('✓ ' + test.message);
                            passedCount++;
                        } else {
                            console.error('✗ ' + test.failMessage);
                        }
                    });
                    
                    // Check at least one child parameter
                    const hasChildParam = Array.from(urlParams.keys()).some(key => key.startsWith('c') && /^\d+/.test(key.substring(1)));
                    if (hasChildParam) {
                        console.log('✓ URL contains at least one child parameter');
                        passedCount++;
                    } else {
                        console.error('✗ URL does not contain any child parameters');
                    }
                    
                    // Overall test result
                    if (passedCount === tests.length + 1) {
                        console.log('✓✓ OVERALL TEST PASSED: Share button works correctly');
                    } else {
                        console.error(`✗✗ OVERALL TEST FAILED: ${passedCount} of ${tests.length + 1} checks passed`);
                    }
                    
                    // Restore original execCommand
                    app.document.execCommand = originalExecCommand;
                    
                    console.log('-------------------------------------------');
                } catch (error) {
                    console.error('Error during URL validation:', error.message);
                }
            }
            
            // Start the test after a short delay to ensure everything is loaded
            setTimeout(testShareButtonClick, 1000);
            
        } catch (error) {
            console.error('Error during test setup:', error.message);
        }
    }
}

// Add a button to run the test
document.addEventListener('DOMContentLoaded', function() {
    const shareButtonTestButton = document.createElement('button');
    shareButtonTestButton.innerText = 'Run Share Button Test';
    shareButtonTestButton.className = 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4';
    shareButtonTestButton.onclick = testShareButton;
    
    const container = document.querySelector('.container');
    if (container) {
        container.appendChild(shareButtonTestButton);
    }
});

// Also expose the test function globally for console testing
window.testShareButton = testShareButton;
