/**
 * Düsseldorfer Tabelle Module
 * Contains data and logic for child support calculations
 * Implements version-based calculation for easy extension
 */

// Base data structure for Düsseldorfer Tabelle 2025
const duesseldorferTabelle = {
  // Current version - will be used for calculation unless overridden
  currentVersion: '2025',

  // Year-based versions of the calculation parameters
  versions: {
    '2025': {
      // Child support amounts from Düsseldorfer Tabelle 2025
      supportAmounts: [
        { 
          minIncome: 0, 
          maxIncome: 2100, 
          ageRanges: [
            { min: 0, max: 5, amount: 482 },
            { min: 6, max: 11, amount: 554 },
            { min: 12, max: 17, amount: 649 },
            { min: 18, max: 150, amount: 693 }
          ],
          percentageRate: 100,
          bedarfskontrollbetrag: { active: 1450, inactive: 1200 }
        },
        { 
          minIncome: 2101, 
          maxIncome: 2500, 
          ageRanges: [
            { min: 0, max: 5, amount: 507 },
            { min: 6, max: 11, amount: 582 },
            { min: 12, max: 17, amount: 682 },
            { min: 18, max: 150, amount: 728 }
          ],
          percentageRate: 105,
          bedarfskontrollbetrag: 1750
        },
        { 
          minIncome: 2501, 
          maxIncome: 2900, 
          ageRanges: [
            { min: 0, max: 5, amount: 531 },
            { min: 6, max: 11, amount: 610 },
            { min: 12, max: 17, amount: 714 },
            { min: 18, max: 150, amount: 763 }
          ],
          percentageRate: 110,
          bedarfskontrollbetrag: 1850
        },
        { 
          minIncome: 2901, 
          maxIncome: 3300, 
          ageRanges: [
            { min: 0, max: 5, amount: 555 },
            { min: 6, max: 11, amount: 638 },
            { min: 12, max: 17, amount: 747 },
            { min: 18, max: 150, amount: 797 }
          ],
          percentageRate: 115,
          bedarfskontrollbetrag: 1950
        },
        { 
          minIncome: 3301, 
          maxIncome: 3700, 
          ageRanges: [
            { min: 0, max: 5, amount: 579 },
            { min: 6, max: 11, amount: 665 },
            { min: 12, max: 17, amount: 779 },
            { min: 18, max: 150, amount: 832 }
          ],
          percentageRate: 120,
          bedarfskontrollbetrag: 2050
        },
        { 
          minIncome: 3701, 
          maxIncome: 4100, 
          ageRanges: [
            { min: 0, max: 5, amount: 617 },
            { min: 6, max: 11, amount: 710 },
            { min: 12, max: 17, amount: 831 },
            { min: 18, max: 150, amount: 888 }
          ],
          percentageRate: 128,
          bedarfskontrollbetrag: 2150
        },
        { 
          minIncome: 4101, 
          maxIncome: 4500, 
          ageRanges: [
            { min: 0, max: 5, amount: 656 },
            { min: 6, max: 11, amount: 754 },
            { min: 12, max: 17, amount: 883 },
            { min: 18, max: 150, amount: 943 }
          ],
          percentageRate: 136,
          bedarfskontrollbetrag: 2250
        },
        { 
          minIncome: 4501, 
          maxIncome: 4900, 
          ageRanges: [
            { min: 0, max: 5, amount: 695 },
            { min: 6, max: 11, amount: 798 },
            { min: 12, max: 17, amount: 935 },
            { min: 18, max: 150, amount: 998 }
          ],
          percentageRate: 144,
          bedarfskontrollbetrag: 2350
        },
        { 
          minIncome: 4901, 
          maxIncome: 5300, 
          ageRanges: [
            { min: 0, max: 5, amount: 733 },
            { min: 6, max: 11, amount: 843 },
            { min: 12, max: 17, amount: 987 },
            { min: 18, max: 150, amount: 1054 }
          ],
          percentageRate: 152,
          bedarfskontrollbetrag: 2450
        },
        { 
          minIncome: 5301, 
          maxIncome: 5700, 
          ageRanges: [
            { min: 0, max: 5, amount: 772 },
            { min: 6, max: 11, amount: 887 },
            { min: 12, max: 17, amount: 1039 },
            { min: 18, max: 150, amount: 1109 }
          ],
          percentageRate: 160,
          bedarfskontrollbetrag: 2550
        },
        { 
          minIncome: 5701, 
          maxIncome: 6400, 
          ageRanges: [
            { min: 0, max: 5, amount: 810 },
            { min: 6, max: 11, amount: 931 },
            { min: 12, max: 17, amount: 1091 },
            { min: 18, max: 150, amount: 1165 }
          ],
          percentageRate: 168,
          bedarfskontrollbetrag: 2850
        },
        { 
          minIncome: 6401, 
          maxIncome: 7200, 
          ageRanges: [
            { min: 0, max: 5, amount: 849 },
            { min: 6, max: 11, amount: 976 },
            { min: 12, max: 17, amount: 1143 },
            { min: 18, max: 150, amount: 1220 }
          ],
          percentageRate: 176,
          bedarfskontrollbetrag: 3250
        },
        { 
          minIncome: 7201, 
          maxIncome: 8200, 
          ageRanges: [
            { min: 0, max: 5, amount: 887 },
            { min: 6, max: 11, amount: 1020 },
            { min: 12, max: 17, amount: 1195 },
            { min: 18, max: 150, amount: 1276 }
          ],
          percentageRate: 184,
          bedarfskontrollbetrag: 3750
        },
        { 
          minIncome: 8201, 
          maxIncome: 9700, 
          ageRanges: [
            { min: 0, max: 5, amount: 926 },
            { min: 6, max: 11, amount: 1064 },
            { min: 12, max: 17, amount: 1247 },
            { min: 18, max: 150, amount: 1331 }
          ],
          percentageRate: 192,
          bedarfskontrollbetrag: 4350
        },
        { 
          minIncome: 9701, 
          maxIncome: 11200, 
          ageRanges: [
            { min: 0, max: 5, amount: 964 },
            { min: 6, max: 11, amount: 1108 },
            { min: 12, max: 17, amount: 1298 },
            { min: 18, max: 150, amount: 1386 }
          ],
          percentageRate: 200,
          bedarfskontrollbetrag: 5050
        }
      ],

      // Constants for 2025
      kindergeld: 255,        // Monthly child benefit amount per child
      kindergeldHalf: 127.5,  // Half of the child benefit (used for minors)
      
      // Self-sustenance amounts (Selbstbehalt)
      selfSustenance: {
        active: {
          minor: 1450,  // For active earners with minor children
          major: 1750   // For active earners with major (18+) children
        },
        inactive: {
          minor: 1200,  // For inactive earners with minor children
          major: 1750   // For inactive earners with major (18+) children
        }
      },
      
      // Income exemptions for children
      childIncomeExemptions: {
        student: {
          exempt: 50,      // First 50€ are exempt
          reductionRate: 0.5  // 50% of the rest reduces support
        },
        apprentice: {
          exempt: 100,     // First 100€ are exempt
          reductionRate: 1.0  // 100% of the rest reduces support
        }
      },
      
      // Professional expense deduction (berufliche Aufwendungen)
      professionalExpenses: {
        rate: 0.05,   // 5% of net income
        min: 50,      // Minimum 50€
        max: 150      // Maximum 150€
      }
    }

    // Add 2026 version here when available
    // '2026': { ... }
  }
};

// Export the module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = duesseldorferTabelle;
}
