document.addEventListener('DOMContentLoaded', function() {
    // Initialize data structure
    const data = {
        children: [],
        vater: {
            nettoEinkommen: 2000,
            sonstigeEinkommen: 0,
            wohnvorteil: 0,
            schulden: 0
        },
        mutter: {
            nettoEinkommen: 0,
            sonstigeEinkommen: 0,
            wohnvorteil: 0,
            schulden: 0
        }
    };

    // DOM Elements
    const jsonOutput = document.getElementById('jsonOutput');
    const childrenContainer = document.getElementById('childrenContainer');
    const addChildBtn = document.getElementById('addChildBtn');
    const childTemplate = document.getElementById('childTemplate');
    const toggleFinancialDetails = document.getElementById('toggleFinancialDetails');
    const financialDetailsSection = document.getElementById('financialDetailsSection');
    
    // Parents' income input fields
    const parentFields = [
        { id: 'vaterNettoEinkommen', path: 'vater.nettoEinkommen' },
        { id: 'vaterSonstigeEinkommen', path: 'vater.sonstigeEinkommen' },
        { id: 'vaterWohnvorteil', path: 'vater.wohnvorteil' },
        { id: 'vaterSchulden', path: 'vater.schulden' },
        { id: 'mutterNettoEinkommen', path: 'mutter.nettoEinkommen' },
        { id: 'mutterSonstigeEinkommen', path: 'mutter.sonstigeEinkommen' },
        { id: 'mutterWohnvorteil', path: 'mutter.wohnvorteil' },
        { id: 'mutterSchulden', path: 'mutter.schulden' }
    ];
    
    // Initialize with parents' data
    parentFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            // Set initial value
            const value = getNestedProperty(data, field.path);
            element.value = value;
            
            // Add event listener for changes
            element.addEventListener('input', function() {
                setNestedProperty(data, field.path, parseFloat(this.value) || 0);
                updateIncomeGroup();
                updateJsonOutput();
            });
        }
    });
    
    // Toggle financial details section
    toggleFinancialDetails.addEventListener('click', function() {
        financialDetailsSection.classList.toggle('hidden');
        updateFinancialDetailsSectionIcon();
    });
    
    // Function to update the financial details section icon
    function updateFinancialDetailsSectionIcon() {
        const svg = toggleFinancialDetails.querySelector('svg');
        if (financialDetailsSection.classList.contains('hidden')) {
            // Section is hidden, show downward arrow (↓) to indicate "click to expand"
            svg.innerHTML = '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />';
        } else {
            // Section is visible, show upward arrow (↑) to indicate "click to collapse"
            svg.innerHTML = '<path fill-rule="evenodd" d="M5.293 12.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 9.414l-3.293 3.293a1 1 0 01-1.414 0z" clip-rule="evenodd" />';
        }
    }
    
    // Child counter for IDs
    let childIdCounter = 1;
    
    // Add child button click handler
    addChildBtn.addEventListener('click', function() {
        addChild();
    });
    
    // Function to add a new child
    function addChild(childData = null) {
        const childId = childData ? childData.id : childIdCounter++;
        
        // Clone template
        const template = childTemplate.content.cloneNode(true);
        const childForm = template.querySelector('.child-form');
        childForm.dataset.childId = childId;
        
        // Set title
        const childTitle = childForm.querySelector('.child-title');
        childTitle.textContent = `Kind ${childId}`;
        
        // Get all input elements
        const ageInput = childForm.querySelector('.child-age');
        const residenceSelect = childForm.querySelector('.child-residence');
        const statusSelect = childForm.querySelector('.child-status');
        const incomeJobInput = childForm.querySelector('.child-income-job');
        const incomeOtherInput = childForm.querySelector('.child-income-other');
        const benefitVaterBtn = childForm.querySelector('.child-benefit-vater');
        const benefitMutterBtn = childForm.querySelector('.child-benefit-mutter');
        const toggleIncomeBtn = childForm.querySelector('.toggle-child-income');
        const incomeSection = childForm.querySelector('.child-income-section');
        
        // Set initial values if childData is provided
        if (childData) {
            ageInput.value = childData.age;
            residenceSelect.value = childData.residenceWith;
            statusSelect.value = childData.status;
            incomeJobInput.value = childData.income.amount || 0;
            
            // Set the benefit button states
            if (childData.childBenefitTo === 'vater') {
                benefitVaterBtn.classList.add('bg-blue-500', 'text-white');
                benefitMutterBtn.classList.remove('bg-blue-500', 'text-white');
            } else {
                benefitMutterBtn.classList.add('bg-blue-500', 'text-white');
                benefitVaterBtn.classList.remove('bg-blue-500', 'text-white');
            }
            
            // Set income section visibility
            if (!childData.income.expanded) {
                incomeSection.classList.add('hidden');
            }
        } else {
            // Create default child data
            const newChildData = {
                id: childId,
                age: 6,
                residenceWith: 'mutter',
                childBenefitTo: 'mutter',
                status: 'schueler',
                income: {
                    expanded: false,
                    amount: 0
                }
            };
            
            // Add to data structure
            data.children.push(newChildData);
            incomeSection.classList.add('hidden');
        }
        
        // Add event listeners
        ageInput.addEventListener('input', function() {
            updateChildProperty(childId, 'age', parseInt(this.value) || 0);
        });
        
        residenceSelect.addEventListener('change', function() {
            updateChildProperty(childId, 'residenceWith', this.value);
        });
        
        statusSelect.addEventListener('change', function() {
            updateChildProperty(childId, 'status', this.value);
        });
        
        incomeJobInput.addEventListener('input', function() {
            const child = getChildById(childId);
            if (child) {
                child.income.amount = parseFloat(this.value) || 0;
                updateJsonOutput();
            }
        });
        
        incomeOtherInput.addEventListener('input', function() {
            const child = getChildById(childId);
            if (child) {
                child.income.otherAmount = parseFloat(this.value) || 0;
                updateJsonOutput();
            }
        });
        
        // Benefit buttons
        benefitVaterBtn.addEventListener('click', function() {
            benefitVaterBtn.classList.add('bg-blue-500', 'text-white');
            benefitMutterBtn.classList.remove('bg-blue-500', 'text-white');
            updateChildProperty(childId, 'childBenefitTo', 'vater');
        });
        
        benefitMutterBtn.addEventListener('click', function() {
            benefitMutterBtn.classList.add('bg-blue-500', 'text-white');
            benefitVaterBtn.classList.remove('bg-blue-500', 'text-white');
            updateChildProperty(childId, 'childBenefitTo', 'mutter');
        });
        
        // Toggle income section
        toggleIncomeBtn.addEventListener('click', function() {
            incomeSection.classList.toggle('hidden');
            
            // Update child data
            const child = getChildById(childId);
            if (child) {
                child.income.expanded = !incomeSection.classList.contains('hidden');
                updateJsonOutput();
            }
            
            // Update toggle button icon - flip arrow direction
            const svg = toggleIncomeBtn.querySelector('svg');
            if (incomeSection.classList.contains('hidden')) {
                // Section is hidden, show downward arrow (↓) to indicate "click to expand"
                svg.innerHTML = '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />';
            } else {
                // Section is visible, show upward arrow (↑) to indicate "click to collapse"
                svg.innerHTML = '<path fill-rule="evenodd" d="M5.293 12.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 9.414l-3.293 3.293a1 1 0 01-1.414 0z" clip-rule="evenodd" />';
            }
        });
        
        // Delete child button
        const deleteBtn = childForm.querySelector('.delete-child');
        // Make sure button is properly configured from the beginning
        if (data.children.length <= 1) {
            deleteBtn.style.display = 'none';
        } else {
            deleteBtn.style.display = 'inline-flex';
            deleteBtn.style.visibility = 'visible';
        }
        
        deleteBtn.addEventListener('click', function() {
            // Only allow deletion if there's more than one child
            if (data.children.length > 1) {
                // First remove the child from data structure, then from DOM
                if (removeChild(childId)) {
                    childForm.remove();
                    // Force reindexing of remaining DOM elements
                    updateChildrenDomNumbering();
                    
                    // Check if we should hide delete buttons
                    updateDeleteButtonVisibility();
                }
            }
        });
        
        // Initialize delete button visibility for all buttons
        setTimeout(() => {
            updateDeleteButtonVisibility();
        }, 0);
        
        // Append the new child form to the container
        childrenContainer.appendChild(childForm);
        
        // Update JSON output
        updateJsonOutput();
    }
    
    // Helper function to get child by ID
    function getChildById(id) {
        return data.children.find(child => child.id === id);
    }
    
    // Helper function to update child property
    function updateChildProperty(childId, property, value) {
        const child = getChildById(childId);
        if (child) {
            child[property] = value;
            updateJsonOutput();
        }
    }
    
    // Helper function to remove child by ID
    function removeChild(id) {
        // Only remove if there's more than one child
        if (data.children.length > 1) {
            const index = data.children.findIndex(child => child.id === id);
            if (index !== -1) {
                // Remove the child from the data structure
                data.children.splice(index, 1);
                
                // Reindex remaining children in data structure
                reindexChildren();
                
                updateJsonOutput();
                return true;
            }
        }
        return false;
    }
    
    // Function to reindex children after deletion (data only)
    function reindexChildren() {
        // Update the IDs in the data structure
        data.children.forEach((child, index) => {
            child.id = index + 1;
        });
    }
    
    // Function to update child numbering in the DOM
    function updateChildrenDomNumbering() {
        // Get all child forms in DOM
        const childForms = document.querySelectorAll('#childrenContainer > .child-form');
        
        // Update each child form with the correct number
        childForms.forEach((form, index) => {
            const childId = index + 1;
            // Update the data-child-id attribute
            form.dataset.childId = childId;
            
            // Update the title text
            const titleElement = form.querySelector('.child-title');
            if (titleElement) {
                titleElement.textContent = `Kind ${childId}`;
            }
        });
        
        // Update the data IDs to match DOM order
        reindexChildren();
        updateJsonOutput();
        
        // Update delete button visibility
        updateDeleteButtonVisibility();
    }
    
    // Helper function to get nested property
    function getNestedProperty(obj, path) {
        return path.split('.').reduce((p, c) => (p && p[c] !== undefined) ? p[c] : null, obj);
    }
    
    // Helper function to set nested property
    function setNestedProperty(obj, path, value) {
        const parts = path.split('.');
        const last = parts.pop();
        const parent = parts.reduce((p, c) => (p[c] = p[c] || {}), obj);
        parent[last] = value;
        return obj;
    }
    
    // Function to update income group text
    function updateIncomeGroup() {
        const vaterEinkommen = parseFloat(document.getElementById('vaterNettoEinkommen').value) || 0;
        const incomeGroupElement = document.getElementById('incomeGroup');
        
        let groupText = '';
        if (vaterEinkommen <= 1900) {
            groupText = 'bis 1900 €';
        } else if (vaterEinkommen <= 2300) {
            groupText = 'bis 2300 €';
        } else if (vaterEinkommen <= 2700) {
            groupText = 'bis 2700 €';
        } else if (vaterEinkommen <= 3100) {
            groupText = 'bis 3100 €';
        } else if (vaterEinkommen <= 3500) {
            groupText = 'bis 3500 €';
        } else if (vaterEinkommen <= 3900) {
            groupText = 'bis 3900 €';
        } else {
            groupText = 'über 3900 €';
        }
        
        incomeGroupElement.textContent = `Einkommensgruppe: ${groupText}`;
    }
    
    // Function to format JSON for display
    function formatJsonForDisplay(json) {
        return JSON.stringify(json, null, 2);
    }
    
    // Function to update the JSON output display
    function updateJsonOutput() {
        jsonOutput.textContent = formatJsonForDisplay(data);
    }
    
    // Function to update delete button visibility
    function updateDeleteButtonVisibility() {
        const childForms = document.querySelectorAll('#childrenContainer > .child-form');
        
        // Hide delete buttons if only one child remains
        if (childForms.length <= 1) {
            childForms.forEach(form => {
                const deleteBtn = form.querySelector('.delete-child');
                if (deleteBtn) {
                    deleteBtn.style.display = 'none';
                }
            });
        } else {
            // Show delete buttons when there are multiple children
            childForms.forEach(form => {
                const deleteBtn = form.querySelector('.delete-child');
                if (deleteBtn) {
                    // Make sure to use 'inline-flex' to maintain proper button layout
                    deleteBtn.style.display = 'inline-flex';
                    // Ensure the button is actually visible by also setting visibility
                    deleteBtn.style.visibility = 'visible';
                    // Make sure there's no opacity settings hiding it
                    deleteBtn.style.opacity = '1';
                }
            });
        }
        
        // Force browser to repaint - can help with visibility issues
        setTimeout(() => {
            // Do another check to make sure buttons are properly visible
            if (childForms.length > 1) {
                childForms.forEach(form => {
                    const deleteBtn = form.querySelector('.delete-child');
                    if (deleteBtn && window.getComputedStyle(deleteBtn).display === 'none') {
                        deleteBtn.style.display = 'inline-flex';
                        deleteBtn.style.visibility = 'visible';
                    }
                });
            }
            
            window.dispatchEvent(new Event('resize'));
        }, 50); // Slightly longer timeout to ensure DOM updates
    }
    
    // Function to check if financial details section should be expanded
    function checkFinancialDetailsSection() {
        // Get all relevant financial details input fields
        const vaterSonstigeEinkommen = parseFloat(document.getElementById('vaterSonstigeEinkommen').value) || 0;
        const mutterSonstigeEinkommen = parseFloat(document.getElementById('mutterSonstigeEinkommen').value) || 0;
        const vaterWohnvorteil = parseFloat(document.getElementById('vaterWohnvorteil').value) || 0;
        const mutterWohnvorteil = parseFloat(document.getElementById('mutterWohnvorteil').value) || 0;
        const vaterSchulden = parseFloat(document.getElementById('vaterSchulden').value) || 0;
        const mutterSchulden = parseFloat(document.getElementById('mutterSchulden').value) || 0;
        
        // If any value is greater than 0, expand the section
        if (vaterSonstigeEinkommen > 0 || mutterSonstigeEinkommen > 0 || 
            vaterWohnvorteil > 0 || mutterWohnvorteil > 0 || 
            vaterSchulden > 0 || mutterSchulden > 0) {
            financialDetailsSection.classList.remove('hidden');
        } else {
            // Otherwise collapse it
            financialDetailsSection.classList.add('hidden');
        }
        
        // Update the icon accordingly
        updateFinancialDetailsSectionIcon();
    }
    
    // Add event listeners to all financial detail inputs to check section visibility
    document.getElementById('vaterSonstigeEinkommen').addEventListener('input', checkFinancialDetailsSection);
    document.getElementById('mutterSonstigeEinkommen').addEventListener('input', checkFinancialDetailsSection);
    document.getElementById('vaterWohnvorteil').addEventListener('input', checkFinancialDetailsSection);
    document.getElementById('mutterWohnvorteil').addEventListener('input', checkFinancialDetailsSection);
    document.getElementById('vaterSchulden').addEventListener('input', checkFinancialDetailsSection);
    document.getElementById('mutterSchulden').addEventListener('input', checkFinancialDetailsSection);
    
    // Initialize with default first child
    addChild();
    
    // Initial JSON output update
    updateJsonOutput();
    updateIncomeGroup();
    updateDeleteButtonVisibility();
    
    // Initial check for financial details section
    checkFinancialDetailsSection();
});
