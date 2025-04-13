// Define income brackets from Düsseldorfer Tabelle
const incomeBrackets = [
    { min: 0, max: 2100, display: "0 bis 2.100 €" },
    { min: 2101, max: 2500, display: "2.101 - 2.500 €" },
    { min: 2501, max: 2900, display: "2.501 - 2.900 €" },
    { min: 2901, max: 3300, display: "2.901 - 3.300 €" },
    { min: 3301, max: 3700, display: "3.301 - 3.700 €" },
    { min: 3701, max: 4100, display: "3.701 - 4.100 €" },
    { min: 4101, max: 4500, display: "4.101 - 4.500 €" },
    { min: 4501, max: 4900, display: "4.501 - 4.900 €" },
    { min: 4901, max: 5300, display: "4.901 - 5.300 €" },
    { min: 5301, max: 5700, display: "5.301 - 5.700 €" },
    { min: 5701, max: 6400, display: "5.701 - 6.400 €" },
    { min: 6401, max: 7200, display: "6.401 - 7.200 €" },
    { min: 7201, max: 8200, display: "7.201 - 8.200 €" },
    { min: 8201, max: 9700, display: "8.201 - 9.700 €" },
    { min: 9701, max: 11200, display: "9.701 - 11.200 €" }
];

/**
 * Gets the income bracket display text for a given income
 * @param {number} income - The income to get the bracket for
 * @returns {string} The display text for the income bracket
 */
function getIncomeBracket(income) {
    if (!income || isNaN(income) || income <= 0) return "0 bis 2.100 €";
    const bracket = incomeBrackets.find(b => income >= b.min && income <= b.max);
    return bracket ? bracket.display : "Über 11.200 €";
}

/**
 * Calculates the "Berufsbedingte Aufwände" based on the income.
 * @param {number} income - The income to calculate the Aufwände for
 * @returns {number} The calculated Aufwände
 */
function calculateBerufsbedingteAufwände(income) {
    if (!income) return 0;
    // First calculate the standard 5%
    const standardAufwände = income * 0.05;
    // Then apply the minimum of 50€ and maximum of 150€, but never exceed the income itself
    return Math.min(income, Math.min(Math.max(standardAufwände, 50), 150));
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        calculateBerufsbedingteAufwände,
        getIncomeBracket,
        incomeBrackets
    };
} 