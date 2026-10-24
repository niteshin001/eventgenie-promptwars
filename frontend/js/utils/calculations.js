/**
 * EventGenie AI - Deterministic Mathematical & Budget Utilities
 */

export function formatCurrency(amount, currency = '₹') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`;
  }
  const rounded = Math.round(Number(amount));
  // Format with standard Indian/international grouping
  if (currency === '₹') {
    return `${currency}${rounded.toLocaleString('en-IN')}`;
  }
  return `${currency}${rounded.toLocaleString('en-US')}`;
}

export function calculateBudgetMetrics(budgetData) {
  if (!budgetData) {
    return {
      totalBudget: 0,
      contingencyAmount: 0,
      contingencyPercent: 10,
      allocatedSum: 0,
      totalWithContingency: 0,
      remainingBalance: 0,
      isOverBudget: false,
      variance: 0
    };
  }

  const totalBudget = Number(budgetData.total_budget || 0);
  const contingencyPercent = Number(budgetData.contingency_percent || 10);
  
  // Calculate category allocated sum
  const categories = budgetData.categories || [];
  const allocatedSum = categories.reduce((sum, cat) => sum + (Number(cat.allocated) || 0), 0);
  
  const contingencyAmount = Number(budgetData.contingency_amount || (totalBudget * (contingencyPercent / 100)));
  const totalWithContingency = allocatedSum + contingencyAmount;
  const remainingBalance = totalBudget - totalWithContingency;
  const isOverBudget = remainingBalance < -0.01;
  const variance = Math.abs(remainingBalance);

  return {
    totalBudget: Math.round(totalBudget * 100) / 100,
    contingencyAmount: Math.round(contingencyAmount * 100) / 100,
    contingencyPercent,
    allocatedSum: Math.round(allocatedSum * 100) / 100,
    totalWithContingency: Math.round(totalWithContingency * 100) / 100,
    remainingBalance: Math.round(remainingBalance * 100) / 100,
    isOverBudget,
    variance: Math.round(variance * 100) / 100
  };
}

export function recalculateCategoryShares(categories, allocableBudget) {
  const sum = categories.reduce((acc, c) => acc + (Number(c.allocated) || 0), 0);
  if (sum === 0) return categories;

  return categories.map((cat, i) => {
    const pct = (cat.allocated / (allocableBudget || sum)) * 100;
    return {
      ...cat,
      percentage: Math.round(pct * 10) / 10
    };
  });
}
