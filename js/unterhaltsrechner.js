/**
 * Unterhaltsrechner Module
 * Main calculation logic for child support according to German law
 */

// Import the Düsseldorfer Tabelle data (will be used as a global in browser)
let duesseldorferTabelle;
if (typeof module !== 'undefined' && module.exports) {
  duesseldorferTabelle = require('./duesseldorfer-tabelle');
}

/**
 * The Unterhaltsrechner (child support calculator) class
 */
class Unterhaltsrechner {
  constructor(year = duesseldorferTabelle.currentVersion) {
    this.year = year;
    this.data = duesseldorferTabelle.versions[year];
    
    // If no data exists for the requested year, fall back to current version
    if (!this.data) {
      console.warn(`No data available for year ${year}, falling back to ${duesseldorferTabelle.currentVersion}`);
      this.year = duesseldorferTabelle.currentVersion;
      this.data = duesseldorferTabelle.versions[duesseldorferTabelle.currentVersion];
    }
  }

  /**
   * Calculate adjusted (bereinigtes) income for a parent
   * @param {Object} parent Parent object with income details
   * @return {Number} Adjusted income after deductions and additions
   */
  calculateAdjustedIncome(parent) {
    const { income, otherIncome = 0, housingBenefit = 0, debtExpenses = 0 } = parent;
    
    // Calculate professional expenses (berufliche Aufwendungen)
    const professionalExpenses = Math.min(
      Math.max(income * this.data.professionalExpenses.rate, this.data.professionalExpenses.min),
      this.data.professionalExpenses.max
    );
    
    // Calculate adjusted income with all additions and deductions
    const adjustedIncome = income - professionalExpenses + otherIncome + housingBenefit - debtExpenses;
    
    return Math.max(0, adjustedIncome); // Never return negative income
  }

  /**
   * Find income group for the given income
   * @param {Number} income The adjusted income
   * @return {Object} Income group object with support amounts
   */
  findIncomeGroup(income) {
    // Find applicable income group
    const group = this.data.supportAmounts.find(group => 
      income >= group.minIncome && income <= group.maxIncome
    );
    
    // If no group found (income is higher than max), use the last group
    if (!group) {
      return this.data.supportAmounts[this.data.supportAmounts.length - 1];
    }
    
    return group;
  }

  /**
   * Get base support amount for a child based on age and parent's income
   * @param {Number} age Child's age
   * @param {Object} incomeGroup Income group object
   * @return {Number} Base support amount
   */
  getBaseSupport(age, incomeGroup) {
    // Find applicable age range
    const ageRange = incomeGroup.ageRanges.find(range => 
      age >= range.min && age <= range.max
    );
    
    return ageRange ? ageRange.amount : 0;
  }

  /**
   * Calculate child's income deduction
   * @param {Object} child Child object with income and status
   * @return {Number} Amount to deduct from support due to child's income
   */
  calculateChildIncomeDeduction(child) {
    const { jobIncome = 0, otherIncome = 0, status } = child;
    const totalIncome = jobIncome + otherIncome;
    
    // If no income, no deduction
    if (totalIncome <= 0) {
      return 0;
    }
    
    let deduction = 0;
    
    // Apply rules based on child's status
    if (status === 'school' || status === 'university') {
      // Students: exempt first X euros, 50% reduction for the rest
      const exemption = this.data.childIncomeExemptions.student.exempt;
      const reductionRate = this.data.childIncomeExemptions.student.reductionRate;
      
      if (totalIncome > exemption) {
        deduction = (totalIncome - exemption) * reductionRate;
      }
    } else if (status === 'apprentice' || status === 'job') {
      // Apprentices: exempt first X euros, full reduction for the rest
      const exemption = this.data.childIncomeExemptions.apprentice.exempt;
      const reductionRate = this.data.childIncomeExemptions.apprentice.reductionRate;
      
      if (totalIncome > exemption) {
        deduction = (totalIncome - exemption) * reductionRate;
      }
    } else {
      // For other statuses, no exemption
      deduction = totalIncome;
    }
    
    return deduction;
  }

  /**
   * Calculate kindergeld (child benefit) deduction
   * @param {Object} child Child object with age
   * @return {Number} Kindergeld amount to deduct
   */
  calculateKindergeldDeduction(child) {
    const { age } = child;
    
    if (age < 18) {
      // For minors, only half of Kindergeld is deducted
      return this.data.kindergeldHalf;
    } else {
      // For adults, full Kindergeld is deducted
      return this.data.kindergeld;
    }
  }

  /**
   * Calculate self-sustenance amount (Selbstbehalt) for a parent
   * @param {Boolean} isActive Whether the parent is actively employed
   * @param {Number} childAge Age of the child
   * @return {Number} Self-sustenance amount
   */
  calculateSelfSustenance(isActive, childAge) {
    const category = childAge < 18 ? 'minor' : 'major';
    return isActive 
      ? this.data.selfSustenance.active[category]
      : this.data.selfSustenance.inactive[category];
  }

  /**
   * Calculate net support amount to be paid
   * @param {Object} child Child information
   * @param {Object} incomeGroup Income group
   * @return {Number} Net support amount after deductions
   */
  calculateNetSupport(child, incomeGroup) {
    // Get base support amount
    const baseSupport = this.getBaseSupport(child.age, incomeGroup);
    
    // Calculate deductions
    const childIncomeDeduction = this.calculateChildIncomeDeduction(child);
    const kindergeldDeduction = this.calculateKindergeldDeduction(child);
    
    // Calculate net support (never less than 0)
    return Math.max(0, baseSupport - childIncomeDeduction - kindergeldDeduction);
  }

  /**
   * Calculate support distribution between parents
   * @param {Object} father Father's information
   * @param {Object} mother Mother's information
   * @param {Object} child Child's information
   * @return {Object} Support distribution amounts for both parents
   */
  calculateSupportDistribution(father, mother, child) {
    const fatherAdjustedIncome = this.calculateAdjustedIncome(father);
    const motherAdjustedIncome = this.calculateAdjustedIncome(mother);
    const totalIncome = fatherAdjustedIncome + motherAdjustedIncome;
    
    // Handle special case where both parents have no income
    if (totalIncome <= 0) {
      return {
        fatherPayment: 0,
        motherPayment: 0,
        fatherPaymentAfterSelfSustenance: 0,
        motherPaymentAfterSelfSustenance: 0,
        fatherToMotherPayment: 0,
        receivingParent: null
      };
    }
    
    // Find income group based on the income of the parent who doesn't live with the child
    let payingParentIncome;
    let payingParentIsActive;
    let receivingParent;
    
    if (child.livingCenter === 'father') {
      payingParentIncome = motherAdjustedIncome;
      payingParentIsActive = mother.income > 0;
      receivingParent = 'father';
    } else if (child.livingCenter === 'mother') {
      payingParentIncome = fatherAdjustedIncome;
      payingParentIsActive = father.income > 0;
      receivingParent = 'mother';
    } else if (child.livingCenter === '5050') {
      // For 50/50 custody, the higher earner pays the difference
      receivingParent = fatherAdjustedIncome > motherAdjustedIncome ? 'mother' : 'father';
      payingParentIncome = Math.max(fatherAdjustedIncome, motherAdjustedIncome);
      payingParentIsActive = receivingParent === 'mother' ? father.income > 0 : mother.income > 0;
    } else {
      // Default case
      payingParentIncome = fatherAdjustedIncome;
      payingParentIsActive = father.income > 0;
      receivingParent = 'mother';
    }
    
    // For adult children, both parents are obligated to pay
    const isAdult = child.age >= 18;
    let fatherPayment = 0;
    let motherPayment = 0;
    
    if (isAdult) {
      // For adults, proportional to income
      const fatherIncomeGroup = this.findIncomeGroup(fatherAdjustedIncome);
      const motherIncomeGroup = this.findIncomeGroup(motherAdjustedIncome);
      
      const fatherBaseSupportAmount = this.calculateNetSupport(child, fatherIncomeGroup);
      const motherBaseSupportAmount = this.calculateNetSupport(child, motherIncomeGroup);
      
      // Distribute proportionally to income
      if (totalIncome > 0) {
        fatherPayment = fatherBaseSupportAmount * (fatherAdjustedIncome / totalIncome);
        motherPayment = motherBaseSupportAmount * (motherAdjustedIncome / totalIncome);
      }
    } else {
      // For minors, only the non-custodial parent pays
      const incomeGroup = this.findIncomeGroup(payingParentIncome);
      const supportAmount = this.calculateNetSupport(child, incomeGroup);
      
      if (receivingParent === 'mother') {
        fatherPayment = supportAmount;
      } else {
        motherPayment = supportAmount;
      }
      
      // For 50/50 custody with minors, only the difference is paid
      if (child.livingCenter === '5050') {
        const fatherIncomeGroup = this.findIncomeGroup(fatherAdjustedIncome);
        const motherIncomeGroup = this.findIncomeGroup(motherAdjustedIncome);
        
        const fatherBaseSupportAmount = this.calculateNetSupport(child, fatherIncomeGroup);
        const motherBaseSupportAmount = this.calculateNetSupport(child, motherIncomeGroup);
        
        if (fatherAdjustedIncome > motherAdjustedIncome) {
          fatherPayment = Math.max(0, fatherBaseSupportAmount - motherBaseSupportAmount);
          motherPayment = 0;
        } else {
          motherPayment = Math.max(0, motherBaseSupportAmount - fatherBaseSupportAmount);
          fatherPayment = 0;
        }
      }
    }
    
    // Check against self-sustenance (Selbstbehalt)
    const fatherSelfSustenance = this.calculateSelfSustenance(father.income > 0, child.age);
    const motherSelfSustenance = this.calculateSelfSustenance(mother.income > 0, child.age);
    
    // Adjust payments based on self-sustenance
    let fatherPaymentAfterSelfSustenance = fatherPayment;
    let motherPaymentAfterSelfSustenance = motherPayment;
    
    if (fatherAdjustedIncome - fatherPayment < fatherSelfSustenance) {
      // Father can't pay full amount
      fatherPaymentAfterSelfSustenance = Math.max(0, fatherAdjustedIncome - fatherSelfSustenance);
    }
    
    if (motherAdjustedIncome - motherPayment < motherSelfSustenance) {
      // Mother can't pay full amount
      motherPaymentAfterSelfSustenance = Math.max(0, motherAdjustedIncome - motherSelfSustenance);
    }
    
    // Calculate the net payment from one parent to another
    let fatherToMotherPayment = 0;
    
    if (isAdult) {
      // For adults, payments go directly to the child
      // We don't calculate fatherToMotherPayment here
    } else {
      // For minors, calculate transfer between parents
      fatherToMotherPayment = fatherPaymentAfterSelfSustenance - motherPaymentAfterSelfSustenance;
    }
    
    return {
      fatherPayment,
      motherPayment,
      fatherPaymentAfterSelfSustenance,
      motherPaymentAfterSelfSustenance,
      fatherToMotherPayment,
      receivingParent
    };
  }

  /**
   * Calculate the complete child support results for all children
   * @param {Object} parents Object with father and mother information
   * @param {Array} children Array of child objects
   * @return {Object} Complete calculation results
   */
  calculateSupport(parents, children) {
    const { father, mother } = parents;
    
    // Adjusted incomes
    const fatherAdjustedIncome = this.calculateAdjustedIncome(father);
    const motherAdjustedIncome = this.calculateAdjustedIncome(mother);
    
    // Calculate individual child support
    const childrenSupport = children.map(child => {
      const support = this.calculateSupportDistribution(father, mother, child);
      
      return {
        childId: child.id,
        childAge: child.age,
        childName: `Kind ${child.id}`,
        livingWith: child.livingCenter,
        ...support
      };
    });
    
    // Calculate totals
    const fatherTotalPayment = childrenSupport.reduce(
      (sum, child) => sum + child.fatherPaymentAfterSelfSustenance, 0
    );
    
    const motherTotalPayment = childrenSupport.reduce(
      (sum, child) => sum + child.motherPaymentAfterSelfSustenance, 0
    );
    
    const fatherTotalToMother = childrenSupport.reduce(
      (sum, child) => sum + (child.fatherToMotherPayment > 0 ? child.fatherToMotherPayment : 0), 0
    );
    
    const motherTotalToFather = childrenSupport.reduce(
      (sum, child) => sum + (child.fatherToMotherPayment < 0 ? -child.fatherToMotherPayment : 0), 0
    );
    
    // Calculate net transfer and kindergeld benefits
    const netFatherToMotherPayment = Math.max(0, fatherTotalToMother - motherTotalToFather);
    const netMotherToFatherPayment = Math.max(0, motherTotalToFather - fatherTotalToMother);
    
    const fatherKindergeld = children.reduce(
      (sum, child) => sum + (child.benefitReceiver === 'father' ? this.data.kindergeld : 0), 0
    );
    
    const motherKindergeld = children.reduce(
      (sum, child) => sum + (child.benefitReceiver === 'mother' ? this.data.kindergeld : 0), 0
    );
    
    // Final financial situation
    const fatherFinalIncome = fatherAdjustedIncome - netFatherToMotherPayment + netMotherToFatherPayment + fatherKindergeld;
    const motherFinalIncome = motherAdjustedIncome - netMotherToFatherPayment + netFatherToMotherPayment + motherKindergeld;
    
    return {
      year: this.year,
      parents: {
        father: {
          adjustedIncome: fatherAdjustedIncome,
          totalPayment: fatherTotalPayment,
          netPaymentToOtherParent: netFatherToMotherPayment,
          kindergeld: fatherKindergeld,
          finalIncome: fatherFinalIncome
        },
        mother: {
          adjustedIncome: motherAdjustedIncome,
          totalPayment: motherTotalPayment,
          netPaymentToOtherParent: netMotherToFatherPayment,
          kindergeld: motherKindergeld,
          finalIncome: motherFinalIncome
        }
      },
      children: childrenSupport
    };
  }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Unterhaltsrechner;
}
