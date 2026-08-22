export function isCurrentMonth(dateValue, referenceDate = new Date()) {
  const date = new Date(dateValue);

  return (
    date.getMonth() === referenceDate.getMonth() &&
    date.getFullYear() === referenceDate.getFullYear()
  );
}

export function getCurrentMonthExpenses(
  expenses,
  referenceDate = new Date()
) {
  return expenses.filter((expense) =>
    isCurrentMonth(expense.date, referenceDate)
  );
}

export function getSpentByCategory(
  expenses,
  referenceDate = new Date()
) {
  const currentMonthExpenses = getCurrentMonthExpenses(
    expenses,
    referenceDate
  );

  return currentMonthExpenses.reduce((totals, expense) => {
    totals[expense.categoryId] =
      (totals[expense.categoryId] || 0) + expense.amount;

    return totals;
  }, {});
}

export function getCategoryById(categories, categoryId) {
  return categories.find(
    (category) => category.id === categoryId
  );
}

export function hasBudget(category) {
  return (
    category?.monthlyBudget !== null &&
    category?.monthlyBudget !== undefined &&
    Number.isFinite(Number(category.monthlyBudget))
  );
}

export function isOverBudget(category, spent) {
  if (!hasBudget(category)) {
    return false;
  }

  const budget = Number(category.monthlyBudget);

  return spent > budget;
}