/**
 * Unterhalt Calculator
 * Simple SPA for calculating child support
 * Version: 1.0.0
 */

// This section will be replaced with exports at the end of the file

// Data model - versioned default values
const DEFAULT_DATA = {
    v1: {
        parents: {
            father: {
                income: 2000,
                otherIncome: 0,
                housingBenefit: 0,
                debtExpenses: 0
            },
            mother: {
                income: 0,
                otherIncome: 0,
                housingBenefit: 0,
                debtExpenses: 0
            }
        },
        childDefaults: {
            age: 6,
            livingCenter: 'mother',
            benefitReceiver: 'mother',
            status: 'school',
            jobIncome: 0,
            otherIncome: 0
        }
    }
    // Future versions can be added here (v2, v3, etc.)
};

// Current version to use
const CURRENT_VERSION = 'v1';

// Selector cache for performance
const elements = {
    // Parent form elements
    fatherIncome: document.getElementById('father-income'),
    motherIncome: document.getElementById('mother-income'),
    incomeGroup: document.getElementById('income-group'),
    fatherOtherIncome: document.getElementById('father-other-income'),
    motherOtherIncome: document.getElementById('mother-other-income'),
    fatherHousingBenefit: document.getElementById('father-housing-benefit'),
    motherHousingBenefit: document.getElementById('mother-housing-benefit'),
    fatherDebtExpenses: document.getElementById('father-debt-expenses'),
    motherDebtExpenses: document.getElementById('mother-debt-expenses'),
    
    // Section toggles
    otherIncomeToggle: document.getElementById('toggle-other-income'),
    otherIncomeSection: document.getElementById('other-income-section'),
    housingBenefitToggle: document.getElementById('toggle-housing-benefit'),
    housingBenefitSection: document.getElementById('housing-benefit-section'),
    debtExpensesToggle: document.getElementById('toggle-debt-expenses'),
    debtExpensesSection: document.getElementById('debt-expenses-section'),
    
    // Children elements
    childrenContainer: document.getElementById('children-container'),
    addChildBtn: document.getElementById('add-child'),
    childTemplate: document.getElementById('child-template'),
    
    // Share URL element
    copyUrlBtn: document.getElementById('copy-url')
};

// Application state
let appState = {
    parents: {
        father: { ...DEFAULT_DATA[CURRENT_VERSION].parents.father },
        mother: { ...DEFAULT_DATA[CURRENT_VERSION].parents.mother }
    },
    children: [],
    nextChildId: 1
};

/**
 * Initialize the application
 */
function init() {
    console.log('Initializing application...');
    
    // Load state from URL if available, otherwise use defaults
    loadStateFromUrl();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add the first child by default only if we don't have any children loaded from URL
    if (appState.children.length === 0) {
        addChild();
    } else {
        // If we loaded children from URL, render them
        appState.children.forEach(child => {
            addChildFromState(child);
        });
    }
    
    // Initial UI update
    updateUI();
    
    console.log('Application initialized');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Parent income inputs
    elements.fatherIncome.addEventListener('input', () => {
        appState.parents.father.income = Number(elements.fatherIncome.value);
        updateIncomeGroup();
        updateShareUrl();
    });
    
    elements.motherIncome.addEventListener('input', () => {
        appState.parents.mother.income = Number(elements.motherIncome.value);
        updateIncomeGroup();
        updateShareUrl();
    });
    
    // Other income inputs
    elements.fatherOtherIncome.addEventListener('input', () => {
        appState.parents.father.otherIncome = Number(elements.fatherOtherIncome.value);
        updateShareUrl();
        checkAndExpandAdditionalDetails();
    });
    
    elements.motherOtherIncome.addEventListener('input', () => {
        appState.parents.mother.otherIncome = Number(elements.motherOtherIncome.value);
        updateShareUrl();
        checkAndExpandAdditionalDetails();
    });
    
    // Housing benefit inputs
    elements.fatherHousingBenefit.addEventListener('input', () => {
        appState.parents.father.housingBenefit = Number(elements.fatherHousingBenefit.value);
        updateShareUrl();
        checkAndExpandAdditionalDetails();
    });
    
    elements.motherHousingBenefit.addEventListener('input', () => {
        appState.parents.mother.housingBenefit = Number(elements.motherHousingBenefit.value);
        updateShareUrl();
        checkAndExpandAdditionalDetails();
    });
    
    // Debt expenses inputs
    elements.fatherDebtExpenses.addEventListener('input', () => {
        appState.parents.father.debtExpenses = Number(elements.fatherDebtExpenses.value);
        updateShareUrl();
        checkAndExpandAdditionalDetails();
    });
    
    elements.motherDebtExpenses.addEventListener('input', () => {
        appState.parents.mother.debtExpenses = Number(elements.motherDebtExpenses.value);
        updateShareUrl();
        checkAndExpandAdditionalDetails();
    });
    
    // Additional details toggle is now handled by Alpine.js in the HTML
    // No need for manual event listeners here
    console.log('Additional details toggle is now managed by Alpine.js');
    
    // Add child button
    elements.addChildBtn.addEventListener('click', addChild);
    
    // Copy share URL button
    elements.copyUrlBtn.addEventListener('click', () => {
        elements.shareUrl.select();
        document.execCommand('copy');
        
        // Visual feedback
        elements.copyUrlBtn.textContent = 'Copied!';
        setTimeout(() => {
            elements.copyUrlBtn.textContent = 'Copy';
        }, 2000);
    });
}

/**
 * Update chevron icon based on expanded/collapsed state
 */
function updateChevronIcon(button) {
    const svg = button.querySelector('svg');
    svg.classList.toggle('transform');
    svg.classList.toggle('rotate-180');
}

/**
 * Update income group text based on father and mother income
 */
function updateIncomeGroup() {
    const totalIncome = appState.parents.father.income + appState.parents.mother.income;
    
    let groupText = '';
    if (totalIncome <= 2100) {
        groupText = 'bis 2100 €';
    } else if (totalIncome <= 3000) {
        groupText = '2101 € - 3000 €';
    } else if (totalIncome <= 4000) {
        groupText = '3001 € - 4000 €';
    } else if (totalIncome <= 5000) {
        groupText = '4001 € - 5000 €';
    } else {
        groupText = 'über 5000 €';
    }
    
    elements.incomeGroup.textContent = groupText;
}

/**
 * Add a new child to the application
 */
function addChild() {
    // Clone the template
    const childTemplate = elements.childTemplate.content.cloneNode(true);
    const childCard = childTemplate.querySelector('.child-card');
    
    // Set child ID
    const childId = appState.nextChildId++;
    childCard.dataset.childId = childId;
    
    // Update the title
    const childTitle = childCard.querySelector('.child-title');
    childTitle.textContent = `Kind ${childId}`;
    
    // Set up event listeners for this child
    setupChildEventListeners(childCard, childId);
    
    // Add to children container
    elements.childrenContainer.appendChild(childCard);
    
    // Add to state with default values
    appState.children.push({
        id: childId,
        ...JSON.parse(JSON.stringify(DEFAULT_DATA[CURRENT_VERSION].childDefaults))
    });
    
    // Update share URL
    updateShareUrl();
}

/**
 * Add a child from existing state (used for recreating UI from saved state)
 * @param {Object} childState - The child state object
 */
function addChildFromState(childState) {
    // Clone the template
    const childTemplate = elements.childTemplate.content.cloneNode(true);
    const childCard = childTemplate.querySelector('.child-card');
    
    // Set child ID
    const childId = childState.id;
    childCard.dataset.childId = childId;
    
    // Update the title
    const childTitle = childCard.querySelector('.child-title');
    childTitle.textContent = `Kind ${childId}`;
    
    // Set values from state
    const ageSelect = childCard.querySelector('.child-age');
    ageSelect.value = childState.age.toString();
    
    const livingCenterSelect = childCard.querySelector('.living-center');
    livingCenterSelect.value = childState.livingCenter;
    
    const benefitToggles = childCard.querySelectorAll('.child-benefit-toggle');
    benefitToggles.forEach(toggle => {
        if (toggle.dataset.parent === childState.benefitReceiver) {
            toggle.classList.add('bg-blue-500', 'text-white');
            toggle.classList.remove('bg-gray-200');
        } else {
            toggle.classList.remove('bg-blue-500', 'text-white');
            toggle.classList.add('bg-gray-200');
        }
    });
    
    const statusSelect = childCard.querySelector('.child-status');
    statusSelect.value = childState.status;
    
    const jobIncomeInput = childCard.querySelector('.child-job-income');
    jobIncomeInput.value = childState.jobIncome;
    
    const otherIncomeInput = childCard.querySelector('.child-other-income');
    otherIncomeInput.value = childState.otherIncome;
    
    // Set up event listeners for this child
    setupChildEventListeners(childCard, childId);
    
    // Add to children container
    elements.childrenContainer.appendChild(childCard);
}

/**
 * This function is no longer needed since Alpine.js handles the additional details section
 * Keeping as a stub for backward compatibility with tests
 */
function checkAndExpandAdditionalDetails() {
    // Alpine.js now handles this functionality through the x-data and x-init directives
    console.log('checkAndExpandAdditionalDetails: Now handled by Alpine.js');
    return true;
}

/**
 * This function is now handled by Alpine.js
 * Keeping as a stub for backward compatibility with tests
 */
function checkAndExpandChildIncome(childCard) {
    // Alpine.js now handles this functionality directly in the HTML
    console.log('checkAndExpandChildIncome: Now handled by Alpine.js');
    return true;
}

/**
 * Set up event listeners for a child card
 */
function setupChildEventListeners(childCard, childId) {
    // Delete button
    const deleteBtn = childCard.querySelector('.delete-child');
    deleteBtn.addEventListener('click', () => {
        removeChild(childId);
    });
    
    // Age select
    const ageSelect = childCard.querySelector('.child-age');
    ageSelect.addEventListener('change', () => {
        const childIndex = appState.children.findIndex(child => child.id === childId);
        if (childIndex !== -1) {
            appState.children[childIndex].age = Number(ageSelect.value);
            updateShareUrl();
        }
    });
    
    // Living center select
    const livingCenterSelect = childCard.querySelector('.living-center');
    livingCenterSelect.addEventListener('change', () => {
        const childIndex = appState.children.findIndex(child => child.id === childId);
        if (childIndex !== -1) {
            appState.children[childIndex].livingCenter = livingCenterSelect.value;
            updateShareUrl();
        }
    });
    
    // Child benefit toggles
    const benefitToggles = childCard.querySelectorAll('.child-benefit-toggle');
    benefitToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const parent = toggle.dataset.parent;
            const childIndex = appState.children.findIndex(child => child.id === childId);
            
            if (childIndex !== -1) {
                appState.children[childIndex].benefitReceiver = parent;
                
                // Update UI
                benefitToggles.forEach(btn => {
                    if (btn.dataset.parent === parent) {
                        btn.classList.add('bg-blue-500', 'text-white');
                        btn.classList.remove('bg-gray-200');
                    } else {
                        btn.classList.remove('bg-blue-500', 'text-white');
                        btn.classList.add('bg-gray-200');
                    }
                });
                
                updateShareUrl();
            }
        });
    });
    
    // Status select
    const statusSelect = childCard.querySelector('.child-status');
    statusSelect.addEventListener('change', () => {
        const childIndex = appState.children.findIndex(child => child.id === childId);
        if (childIndex !== -1) {
            appState.children[childIndex].status = statusSelect.value;
            updateShareUrl();
        }
    });
    
    // NOTE: Toggle child income section is now handled by Alpine.js
    // No need for manual event listeners here
    console.log('Child income toggle is now managed by Alpine.js');
    
    // Child job income
    const jobIncomeInput = childCard.querySelector('.child-job-income');
    jobIncomeInput.addEventListener('input', () => {
        const childIndex = appState.children.findIndex(child => child.id === childId);
        if (childIndex !== -1) {
            appState.children[childIndex].jobIncome = Number(jobIncomeInput.value);
            updateShareUrl();
            checkAndExpandChildIncome(childCard);
        }
    });
    
    // Child other income
    const otherIncomeInput = childCard.querySelector('.child-other-income');
    otherIncomeInput.addEventListener('input', () => {
        const childIndex = appState.children.findIndex(child => child.id === childId);
        if (childIndex !== -1) {
            appState.children[childIndex].otherIncome = Number(otherIncomeInput.value);
            updateShareUrl();
            checkAndExpandChildIncome(childCard);
        }
    });
}

/**
 * Remove a child from the application
 */
function removeChild(childId) {
    // Remove from DOM
    const childCard = document.querySelector(`.child-card[data-child-id="${childId}"]`);
    if (childCard) {
        childCard.remove();
    }
    
    // Remove from state
    appState.children = appState.children.filter(child => child.id !== childId);
    
    // Renumber remaining children
    renumberChildren();
    
    // Update share URL
    updateShareUrl();
}

/**
 * Renumber children to ensure sequential numbering (1, 2, 3, etc.)
 */
function renumberChildren() {
    // Sort children by their current ID to maintain relative order
    appState.children.sort((a, b) => a.id - b.id);
    
    // Update IDs in state
    appState.children.forEach((child, index) => {
        const newId = index + 1;
        child.id = newId;
    });
    
    // Update DOM
    const childCards = document.querySelectorAll('.child-card');
    childCards.forEach((card, index) => {
        const newId = index + 1;
        
        // Update data attribute
        card.dataset.childId = newId;
        
        // Update title
        const titleElement = card.querySelector('.child-title');
        if (titleElement) {
            titleElement.textContent = `Kind ${newId}`;
        }
    });
    
    // Set nextChildId to one more than the number of children
    appState.nextChildId = appState.children.length + 1;
}

/**
 * Update the UI based on current state
 */
function updateUI() {
    // Parents section
    elements.fatherIncome.value = appState.parents.father.income;
    elements.motherIncome.value = appState.parents.mother.income;
    elements.fatherOtherIncome.value = appState.parents.father.otherIncome;
    elements.motherOtherIncome.value = appState.parents.mother.otherIncome;
    elements.fatherHousingBenefit.value = appState.parents.father.housingBenefit;
    elements.motherHousingBenefit.value = appState.parents.mother.housingBenefit;
    elements.fatherDebtExpenses.value = appState.parents.father.debtExpenses;
    elements.motherDebtExpenses.value = appState.parents.mother.debtExpenses;
    
    // Update income group
    updateIncomeGroup();
    
    // Set initial visibility for toggleable sections
    elements.otherIncomeSection.classList.add('hidden');
    elements.housingBenefitSection.classList.add('hidden');
    elements.debtExpensesSection.classList.add('hidden');
    
    // Update share URL
    updateShareUrl();
}

/**
 * Generate a shareable URL based on current state and copy it to clipboard
 */
function generateAndCopyShareableUrl() {
    // Generate a shareable URL based on current state
    const baseUrl = window.location.href.split('?')[0];
    const urlParams = new URLSearchParams();
    
    // Add the version to the URL parameters
    urlParams.append('v', CURRENT_VERSION);
    
    // Only add params that differ from defaults
    const defaults = DEFAULT_DATA[CURRENT_VERSION];
    
    // Father params
    if (appState.parents.father.income !== defaults.parents.father.income) {
        urlParams.append('fi', appState.parents.father.income);
    }
    if (appState.parents.father.otherIncome !== defaults.parents.father.otherIncome) {
        urlParams.append('foi', appState.parents.father.otherIncome);
    }
    if (appState.parents.father.housingBenefit !== defaults.parents.father.housingBenefit) {
        urlParams.append('fhb', appState.parents.father.housingBenefit);
    }
    if (appState.parents.father.debtExpenses !== defaults.parents.father.debtExpenses) {
        urlParams.append('fde', appState.parents.father.debtExpenses);
    }
    
    // Mother params
    if (appState.parents.mother.income !== defaults.parents.mother.income) {
        urlParams.append('mi', appState.parents.mother.income);
    }
    if (appState.parents.mother.otherIncome !== defaults.parents.mother.otherIncome) {
        urlParams.append('moi', appState.parents.mother.otherIncome);
    }
    if (appState.parents.mother.housingBenefit !== defaults.parents.mother.housingBenefit) {
        urlParams.append('mhb', appState.parents.mother.housingBenefit);
    }
    if (appState.parents.mother.debtExpenses !== defaults.parents.mother.debtExpenses) {
        urlParams.append('mde', appState.parents.mother.debtExpenses);
    }
    
    // Children params
    if (appState.children.length > 0) {
        urlParams.append('nc', appState.children.length);
        
        appState.children.forEach((child, index) => {
            const prefix = `c${index + 1}`;
            
            if (child.age !== defaults.childDefaults.age) {
                urlParams.append(`${prefix}a`, child.age);
            }
            if (child.livingCenter !== defaults.childDefaults.livingCenter) {
                urlParams.append(`${prefix}lc`, child.livingCenter);
            }
            if (child.benefitReceiver !== defaults.childDefaults.benefitReceiver) {
                urlParams.append(`${prefix}br`, child.benefitReceiver);
            }
            if (child.status !== defaults.childDefaults.status) {
                urlParams.append(`${prefix}s`, child.status);
            }
            if (child.jobIncome !== defaults.childDefaults.jobIncome) {
                urlParams.append(`${prefix}ji`, child.jobIncome);
            }
            if (child.otherIncome !== defaults.childDefaults.otherIncome) {
                urlParams.append(`${prefix}oi`, child.otherIncome);
            }
        });
    }
    
    // Create the complete URL
    const paramsString = urlParams.toString();
    const fullUrl = paramsString ? `${baseUrl}?${paramsString}` : baseUrl;
    
    // Copy to clipboard
    const tempInput = document.createElement('input');
    tempInput.value = fullUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show success message
    const successElement = document.getElementById('copy-success');
    if (successElement) {
        successElement.classList.remove('hidden');
        setTimeout(() => {
            successElement.classList.add('hidden');
        }, 3000);
    }
    
    return fullUrl; // Return URL for testing purposes
}

/**
 * Load state from URL parameters
 */
function loadStateFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get version from URL or use current version
    const urlVersion = urlParams.has('v') ? urlParams.get('v') : CURRENT_VERSION;
    
    // Make sure we have this version in our data, otherwise fall back to current version
    const version = DEFAULT_DATA.hasOwnProperty(urlVersion) ? urlVersion : CURRENT_VERSION;
    
    // Get defaults for this version
    const defaults = DEFAULT_DATA[version];
    
    // Reset state to defaults
    appState = {
        parents: {
            father: { ...defaults.parents.father },
            mother: { ...defaults.parents.mother }
        },
        children: [],
        nextChildId: 1
    };
    
    // Father params
    if (urlParams.has('fi')) appState.parents.father.income = Number(urlParams.get('fi'));
    if (urlParams.has('foi')) appState.parents.father.otherIncome = Number(urlParams.get('foi'));
    if (urlParams.has('fhb')) appState.parents.father.housingBenefit = Number(urlParams.get('fhb'));
    if (urlParams.has('fde')) appState.parents.father.debtExpenses = Number(urlParams.get('fde'));
    
    // Mother params
    if (urlParams.has('mi')) appState.parents.mother.income = Number(urlParams.get('mi'));
    if (urlParams.has('moi')) appState.parents.mother.otherIncome = Number(urlParams.get('moi'));
    if (urlParams.has('mhb')) appState.parents.mother.housingBenefit = Number(urlParams.get('mhb'));
    if (urlParams.has('mde')) appState.parents.mother.debtExpenses = Number(urlParams.get('mde'));
    
    // NOTE: We don't need to track or return hasAdditionalDetails anymore
    // Since Alpine.js will handle this directly in the HTML
    console.log('loadStateFromUrl: Alpine.js will check URL parameters directly');
    
    // Children
    const numChildren = urlParams.has('nc') ? Number(urlParams.get('nc')) : 0;
    
    for (let i = 1; i <= numChildren; i++) {
        const prefix = `c${i}`;
        const child = {
            id: i,
            age: defaults.childDefaults.age,
            livingCenter: defaults.childDefaults.livingCenter,
            benefitReceiver: defaults.childDefaults.benefitReceiver,
            status: defaults.childDefaults.status,
            jobIncome: defaults.childDefaults.jobIncome,
            otherIncome: defaults.childDefaults.otherIncome
        };
        
        if (urlParams.has(`${prefix}a`)) child.age = Number(urlParams.get(`${prefix}a`));
        if (urlParams.has(`${prefix}lc`)) child.livingCenter = urlParams.get(`${prefix}lc`);
        if (urlParams.has(`${prefix}br`)) child.benefitReceiver = urlParams.get(`${prefix}br`);
        if (urlParams.has(`${prefix}s`)) child.status = urlParams.get(`${prefix}s`);
        if (urlParams.has(`${prefix}ji`)) child.jobIncome = Number(urlParams.get(`${prefix}ji`));
        if (urlParams.has(`${prefix}oi`)) child.otherIncome = Number(urlParams.get(`${prefix}oi`));
        
        appState.children.push(child);
    }
    
    // Set next child ID
    appState.nextChildId = numChildren + 1;
    
    console.log(`Loaded state from URL: ${numChildren} children, nextChildId: ${appState.nextChildId}`);
}

// Initialize the app once DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

/**
 * For testing purposes - exported functions
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        updateIncomeGroup,
        addChild,
        addChildFromState,
        removeChild,
        renumberChildren,
        updateShareUrl,
        loadStateFromUrl,
        init
    };
}

// Make critical functions accessible to the test framework
window.checkAndExpandAdditionalDetails = checkAndExpandAdditionalDetails;
window.checkAndExpandChildIncome = checkAndExpandChildIncome;
