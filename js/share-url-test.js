/**
 * Share URL Field System Test
 * 
 * This test verifies that the share URL field is properly populated
 * in both scenarios:
 * 1. When loading the page without parameters
 * 2. When loading the page with parameters
 */

// Test function to verify share URL field population
function testShareUrlField() {
    console.log('-------------------------------------------');
    console.log('Running Share URL Field System Test');
    console.log('-------------------------------------------');
    
    // Create test iframe for default page (no parameters)
    const defaultFrame = document.createElement('iframe');
    defaultFrame.style.width = '100%';
    defaultFrame.style.height = '400px';
    defaultFrame.style.border = '2px solid #ccc';
    defaultFrame.style.marginBottom = '20px';
    
    // Create test iframe for page with parameters
    const paramFrame = document.createElement('iframe');
    paramFrame.style.width = '100%';
    paramFrame.style.height = '400px';
    paramFrame.style.border = '2px solid #3b82f6';
    
    // Add test frames to document
    document.body.appendChild(defaultFrame);
    document.body.appendChild(paramFrame);
    
    // Function to test default page (no parameters)
    function testDefaultPage() {
        console.log('Step 1: Testing page with no parameters');
        
        // Wait for frame to load completely
        setTimeout(() => {
            // Find the share URL input
            const shareUrlInput = defaultFrame.contentDocument.getElementById('share-url');
            if (!shareUrlInput) {
                console.error('Could not find share-url input in default page');
                return;
            }
            
            // Check if the field has a value
            const hasValue = shareUrlInput.value && shareUrlInput.value.trim() !== '';
            console.log('Default page - Share URL field has value: ', hasValue);
            console.log('Default page - Share URL value: ', shareUrlInput.value);
            
            if (hasValue) {
                console.log('✓ TEST PASSED: Share URL field is populated on default page');
            } else {
                console.error('✗ TEST FAILED: Share URL field is empty on default page');
            }
            
            // Now test the page with parameters
            testParameterPage();
        }, 1000);
    }
    
    // Function to test page with parameters
    function testParameterPage() {
        console.log('Step 2: Testing page with parameters');
        
        // Use a URL with parameters
        const paramUrl = defaultFrame.contentDocument.location.href.split('?')[0] + '?foi=6000&nc=1&c1ji=500';
        paramFrame.src = paramUrl;
        
        // Check results after loading
        setTimeout(() => {
            try {
                // Find the share URL input
                const shareUrlInput = paramFrame.contentDocument.getElementById('share-url');
                if (!shareUrlInput) {
                    throw new Error('Could not find share-url input in parameter page');
                }
                
                // Check if the field has a value
                const hasValue = shareUrlInput.value && shareUrlInput.value.trim() !== '';
                console.log('Parameter page - Share URL field has value: ', hasValue);
                console.log('Parameter page - Share URL value: ', shareUrlInput.value);
                
                // Verify the URL contains our parameters
                const containsParams = shareUrlInput.value.includes('foi=6000') && 
                                       shareUrlInput.value.includes('nc=1') && 
                                       shareUrlInput.value.includes('c1ji=500');
                
                if (hasValue && containsParams) {
                    console.log('✓ TEST PASSED: Share URL field is populated correctly with parameters');
                } else if (hasValue && !containsParams) {
                    console.error('✗ TEST FAILED: Share URL field is populated but does not contain the correct parameters');
                } else {
                    console.error('✗ TEST FAILED: Share URL field is empty on parameter page');
                }
                
                // Final test result
                if (hasValue && containsParams) {
                    console.log('✓✓ OVERALL TEST PASSED: Share URL field works correctly in both scenarios');
                } else {
                    console.error('✗✗ OVERALL TEST FAILED: Share URL field has issues in one or both scenarios');
                }
            } catch (error) {
                console.error('Error during parameter page test:', error.message);
            }
            
            console.log('-------------------------------------------');
        }, 2000);
    }
    
    // Start with base page (no parameters)
    defaultFrame.src = window.location.href.split('?')[0];
    defaultFrame.onload = testDefaultPage;
}

// Add a button to run the test
const shareUrlTestButton = document.createElement('button');
shareUrlTestButton.innerText = 'Run Share URL Field Test';
shareUrlTestButton.className = 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4';
shareUrlTestButton.onclick = testShareUrlField;

// Add the button to the page when loaded
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    if (container) {
        container.appendChild(shareUrlTestButton);
    }
});

// Also expose the test function globally for console testing
window.testShareUrlField = testShareUrlField;
