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
    module.exports = { calculateBerufsbedingteAufwände };
} 