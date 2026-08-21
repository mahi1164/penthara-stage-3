import { useEffect, useState } from "react";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import CategorySettings from "./components/CategorySettings";
import "./App.css";


const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food', monthlyBudget: null },
  { id: 'travel', name: 'Travel', monthlyBudget: null },
  { id: 'rent', name: 'Rent', monthlyBudget: null },
  { id: 'fun', name: 'Fun', monthlyBudget: null },
  { id: 'other', name: 'Other', monthlyBudget: null },
];

const CATEGORY_MIGRATION_KEY = 'spendbook-category-migration-v1';

function loadInitialData() {
  const savedExpenses = JSON.parse(
    localStorage.getItem("expenses") || "[]"
  );

  const savedCategories = JSON.parse(
    localStorage.getItem("categories") || "[]"
  );

  const categories =
    savedCategories.length > 0
      ? savedCategories
      : DEFAULT_CATEGORIES;

  const fallbackCategory = categories.find(
    (category) => category.id === "other"
  ) || categories[0];

  const migratedExpenses = savedExpenses.map((expense) => {
    // If the expense already has a valid categoryId,
    // keep it exactly as it is.
    const categoryExists = categories.some(
      (category) => category.id === expense.categoryId
    );

    if (categoryExists) {
      return expense;
    }

    // Legacy expense: convert old category name into categoryId.
    const matchingCategory = categories.find(
      (category) =>
        category.name.toLowerCase() ===
        String(expense.category || "").toLowerCase()
    );

    const { category: oldCategory, ...rest } = expense;

    return {
      ...rest,
      categoryId:
        matchingCategory?.id || fallbackCategory.id,
    };
  });

  const expensesChanged =
    JSON.stringify(savedExpenses) !==
    JSON.stringify(migratedExpenses);

  const categoriesChanged =
    JSON.stringify(savedCategories) !==
    JSON.stringify(categories);

  if (expensesChanged) {
    localStorage.setItem(
      "expenses",
      JSON.stringify(migratedExpenses)
    );
  }

  if (categoriesChanged) {
    localStorage.setItem(
      "categories",
      JSON.stringify(categories)
    );
  }

  localStorage.setItem(
    CATEGORY_MIGRATION_KEY,
    "true"
  );

  return {
    expenses: migratedExpenses,
    categories,
  };
}



function App() {
  const [initialData] = useState(loadInitialData);
  const [expenses, setExpenses] = useState(initialData.expenses);
  const [categories, setCategories] = useState(initialData.categories);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletedExpense, setDeletedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);
  

useEffect(() => {
  localStorage.setItem(
    "categories",
    JSON.stringify(categories)
  );
}, [categories]);
useEffect(() => {
  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );
}, [expenses]);
useEffect(() => {
  if (!deletedExpense) return;

  const timer = setTimeout(() => {
    setDeletedExpense(null);
  }, 5000);

  return () => clearTimeout(timer);
}, [deletedExpense]);

const deleteExpense = (id) => {
  const expenseToDelete = expenses.find(
    (expense) => expense.id === id
  );

  if (!expenseToDelete) return;

  const updatedExpenses = expenses.filter(
    (expense) => expense.id !== id
  );

  setExpenses(updatedExpenses);
  setDeletedExpense(expenseToDelete);

  if (
    editingExpense &&
    editingExpense.id === id
  ) {
    setEditingExpense(null);
  }
};

const undoDelete = () => {
  if (!deletedExpense) return;

  const categoryStillExists = categories.some(
    (category) => category.id === deletedExpense.categoryId
  );

  if (!categoryStillExists) {
    setDeletedExpense(null);
    return;
  }

  setExpenses((currentExpenses) => [
    deletedExpense,
    ...currentExpenses,
  ]);

  setDeletedExpense(null);
};

const filteredExpenses = expenses
.filter((expense) => {

  const matchesSearch =
    expense.description
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "" ||
    expense.categoryId === selectedCategory;

  return matchesSearch && matchesCategory;

})
.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );



const currentDate = new Date();

const currentMonthExpenses = filteredExpenses.filter((expense) => {

  const expenseDate = new Date(expense.date);

  return (
    expenseDate.getMonth() === currentDate.getMonth() &&
    expenseDate.getFullYear() === currentDate.getFullYear()
  );

});

const statsCurrentMonthExpenses = expenses.filter((expense) => {
  const expenseDate = new Date(expense.date);

  return (
    expenseDate.getMonth() === currentDate.getMonth() &&
    expenseDate.getFullYear() === currentDate.getFullYear()
  );
});

const currentMonthSpentByCategory =
  statsCurrentMonthExpenses.reduce((totals, expense) => {
    totals[expense.categoryId] =
      (totals[expense.categoryId] || 0) + expense.amount;

    return totals;
  }, {});

const total = currentMonthExpenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);

const statsTotal = statsCurrentMonthExpenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);

const topCategory = categories.reduce(
  (top, category) => {
    const spent = currentMonthSpentByCategory[category.id] || 0;

    if (spent > (top?.spent || 0)) {
      return {
        category,
        spent,
      };
    }

    return top;
  },
  null
)?.category || null;

const budgetedCategories = categories.filter(
  (category) =>
    category.monthlyBudget !== null &&
    category.monthlyBudget > 0
);

const totalBudget = budgetedCategories.reduce(
  (sum, category) => sum + category.monthlyBudget,
  0
);

const totalBudgetSpent = budgetedCategories.reduce(
  (sum, category) =>
    sum + (currentMonthSpentByCategory[category.id] || 0),
  0
);

const budgetUsedPercent =
  totalBudget === 0
    ? 0
    : (totalBudgetSpent / totalBudget) * 100;

const overBudgetCategoryCount = categories.filter(
  (category) => {
    if (category.monthlyBudget === null) {
      return false;
    }

    const categorySpent =
      currentMonthSpentByCategory[category.id] || 0;

    return categorySpent > category.monthlyBudget;
  }
).length;


const categoryTotals = {};

categories.forEach((category) => {
  categoryTotals[category.id] = currentMonthExpenses
    .filter((expense) => expense.categoryId === category.id)
    .reduce((sum, expense) => sum + expense.amount, 0);
});


  return (
  <div className="app">

    <Header />

    <CategorySettings
  categories={categories}
  setCategories={setCategories}
  expenses={expenses}
  setExpenses={setExpenses}
  currentMonthSpentByCategory={currentMonthSpentByCategory}
  deletedExpense={deletedExpense}
  setDeletedExpense={setDeletedExpense}
/>

    <ExpenseForm
  expenses={expenses}
  setExpenses={setExpenses}
  editingExpense={editingExpense}
  setEditingExpense={setEditingExpense}
  categories={categories}
/>
  
  
  
  <section className="stats-card">
  <h2>Live Stats</h2>

  <p>
    <strong>Current-month total:</strong>{" "}
    ₹{statsTotal.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </p>

  <p>
    <strong>Top category:</strong>{" "}
    {topCategory ? topCategory.name : "No spending yet"}
  </p>

  <p>
    <strong>Budget used:</strong>{" "}
    {budgetUsedPercent.toFixed(1)}%
  </p>

  <p>
    <strong>Over-budget categories:</strong>{" "}
    {overBudgetCategoryCount}
  </p>
</section>
  
  
  
    <section className="summary-card">

  <h2>Visible Current Month Summary</h2>

  <h3>Total : ₹ {total.toLocaleString("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}</h3>

  {categories.map((category) => (

    <p key={category.id}>

      <strong>{category.name}</strong> : ₹ {categoryTotals[category.id].toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}

    </p>

  ))}

</section>

    <input
      type="text"
      className="search-box"
      placeholder="Search by description..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
      className="filter-box"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
      {category.name}
      </option>
    ))}
    </select>

    <ExpenseList
      expenses={filteredExpenses}
      allExpenses={expenses}
      deleteExpense={deleteExpense}
      totalExpenses={expenses.length}
      setEditingExpense={setEditingExpense}
      categories={categories}
      currentMonthSpentByCategory={currentMonthSpentByCategory}
    />

    {deletedExpense && (
  <div className="undo-toast">
    <span>Expense deleted.</span>

    <button
      type="button"
      onClick={undoDelete}
    >
      Undo
    </button>
  </div>
)}


  </div>
);
}

export default App;