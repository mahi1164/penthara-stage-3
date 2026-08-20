function ExpenseList({ expenses,allExpenses, deleteExpense, totalExpenses, setEditingExpense, categories, currentMonthSpentByCategory,}) {

  return (
    <section className="expense-list">

      <h2>Expense List</h2>

      {expenses.length === 0 ? (

  totalExpenses === 0 ? (

    <p className="empty-message">
      No expenses yet.
    </p>

  ) : (

    <p className="empty-message">
      No expenses match your search or filter.
    </p>

  )

) : (


        expenses.map((expense) => {

  const category = categories.find(
    (item) => item.id === expense.categoryId
  );

  const currentDate = new Date();
  const expenseDate = new Date(expense.date);

  const isCurrentMonth =
    expenseDate.getMonth() === currentDate.getMonth() &&
    expenseDate.getFullYear() === currentDate.getFullYear();

  const categorySpent =
  currentMonthSpentByCategory[expense.categoryId] || 0;

  const monthlyBudget = Number(category?.monthlyBudget);

const isOverBudget =
  isCurrentMonth &&
  Number.isFinite(monthlyBudget) &&
  monthlyBudget > 0 &&
  categorySpent > monthlyBudget;

  return (

          <div
            key={expense.id}
            className="expense-card"
          >

            <h3>{expense.description}</h3>

            <p>
              <strong>Amount:</strong> ₹ {expense.amount.toLocaleString("en-IN", {
                                          minimumFractionDigits: 2, maximumFractionDigits: 2,},)}
            </p>

            <p>
              <strong>Category:</strong> {category?.name || "Unknown"}

{isOverBudget && (
  <span className="budget-warning">
        Over budget
  </span>
)}
            </p>

            <p>
              <strong>Date:</strong> {new Date(expense.date).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
            </p>

            {expense.note && (
              <p>
                <strong>Note:</strong> {expense.note}
              </p>
            )}
            <button
               className="edit-btn"
               onClick={() => setEditingExpense(expense)}
            >
             Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteExpense(expense.id)}
            >
              Delete
            </button>

          </div>

         );

    }))
  }</section>
  );
}

export default ExpenseList;