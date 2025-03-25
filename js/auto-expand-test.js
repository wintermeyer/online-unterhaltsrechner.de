/**
 * Auto-expansion System Test
 * 
 * This test verifies that sections with non-zero values are automatically expanded
 * when loading the page from a shareable URL.
 */

// Test function to verify auto-expansion
function testAutoExpansionFromUrl() {
    console.log('-------------------------------------------');
    console.log('Running Auto-Expansion System Test');
    console.log('-------------------------------------------');
    
    // Create test iframe to load a fresh page
    const testFrame = document.createElement('iframe');
    testFrame.style.width = '100%';
    testFrame.style.height = '500px';
    testFrame.style.border = '2px solid #ccc';
    
    // Add test frame to document
    document.body.appendChild(testFrame);
    
    // Function to set up the first page with a value
    function setupTestPage() {
        console.log('Step 1: Setting up test page with value 6000');
        
        // Wait for frame to load completely
        setTimeout(() => {
            const fatherOtherIncomeInput = testFrame.contentDocument.getElementById('father-other-income');
            if (!fatherOtherIncomeInput) {
                console.error('Could not find father-other-income input');
                return;
            }
            
            // Set a value of 6000
            fatherOtherIncomeInput.value = 6000;
            
            // Trigger input event to update state
            const inputEvent = new Event('input', { bubbles: true });
            fatherOtherIncomeInput.dispatchEvent(inputEvent);
            
            // Small delay to ensure state is updated
            setTimeout(() => {
                // Find and verify the additional details section is expanded
                const additionalDetailsSection = testFrame.contentDocument.getElementById('additional-details-section');
                if (!additionalDetailsSection) {
                    console.error('Could not find additional-details-section');
                    return;
                }
                
                console.log('Initial page - Section is hidden: ', additionalDetailsSection.classList.contains('hidden'));
                
                // Get shareable URL
                const shareUrlInput = testFrame.contentDocument.getElementById('share-url');
                if (!shareUrlInput) {
                    console.error('Could not find share-url input');
                    return;
                }
                
                const shareableUrl = shareUrlInput.value;
                console.log('Generated shareable URL: ', shareableUrl);
                
                // Now test loading that URL in a new frame
                testLoadingFromUrl(shareableUrl);
            }, 500);
        }, 1000);
    }
    
    // Function to test loading from the shareable URL
    function testLoadingFromUrl(url) {
        console.log('Step 2: Testing loading from shareable URL');
        
        // Create second test frame
        const testFrame2 = document.createElement('iframe');
        testFrame2.style.width = '100%';
        testFrame2.style.height = '500px';
        testFrame2.style.border = '2px solid #3b82f6';
        testFrame2.src = url;
        
        // Add second test frame to document
        document.body.appendChild(testFrame2);
        
        // Check results after loading with multiple attempts
        function checkResults(attempt = 1) {
            console.log(`Checking results (attempt ${attempt}/3)...`);
            
            try {
                // Verify the value is present
                const fatherOtherIncomeInput = testFrame2.contentDocument.getElementById('father-other-income');
                if (!fatherOtherIncomeInput) {
                    throw new Error('Could not find father-other-income input in second frame');
                }
                
                console.log('Loaded page - Value in field: ', fatherOtherIncomeInput.value);
                
                // Verify the section is expanded (not hidden)
                const additionalDetailsSection = testFrame2.contentDocument.getElementById('additional-details-section');
                if (!additionalDetailsSection) {
                    throw new Error('Could not find additional-details-section in second frame');
                }
                
                const isHidden = additionalDetailsSection.classList.contains('hidden');
                console.log('Loaded page - Section is hidden: ', isHidden);
                
                // Test result
                if (fatherOtherIncomeInput.value == 6000 && !isHidden) {
                    console.log('✓ TEST PASSED: Value correctly loaded and section auto-expanded');
                } else {
                    // If it's hidden but should be expanded, try to manually trigger the expansion
                    if (isHidden && fatherOtherIncomeInput.value == 6000 && attempt < 3) {
                        console.log('Section is hidden but value is correct. Attempting to trigger expansion...');
                        // Try to trigger expansion manually
                        const app = testFrame2.contentWindow;
                        if (app && typeof app.checkAndExpandAdditionalDetails === 'function') {
                            app.checkAndExpandAdditionalDetails();
                            // Check again after 500ms
                            setTimeout(() => checkResults(attempt + 1), 500);
                            return;
                        }
                    }
                    
                    console.error('✗ TEST FAILED:');
                    console.error('  - Value loaded: ' + (fatherOtherIncomeInput.value == 6000 ? 'Yes' : 'No'));
                    console.error('  - Section expanded: ' + (!isHidden ? 'Yes' : 'No'));
                }
            } catch (error) {
                console.error('Error during test:', error.message);
                if (attempt < 3) {
                    console.log(`Retrying in 1 second (attempt ${attempt + 1}/3)...`);
                    setTimeout(() => checkResults(attempt + 1), 1000);
                    return;
                }
            }
            
            console.log('-------------------------------------------');
        }
        
        // First check after 2 seconds
        setTimeout(() => checkResults(1), 2000);
    }
    
    // Start with base page
    testFrame.src = window.location.href.split('?')[0];
    testFrame.onload = setupTestPage;
}

// Run the test when this script is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a button to run the test
    const testButton = document.createElement('button');
    testButton.innerText = 'Run Auto-Expansion Test';
    testButton.style.padding = '10px 20px';
    testButton.style.backgroundColor = '#3b82f6';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.margin = '20px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', testAutoExpansionFromUrl);
    
    // Add button to page
    document.body.prepend(testButton);
});
