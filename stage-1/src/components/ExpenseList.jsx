function ExpenseList({ expenses, deleteExpense, totalExpenses, setEditingExpense, categories, }) {

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