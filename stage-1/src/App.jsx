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
    localStorage.getItem('expenses') || '[]'
  );

  const migrationDone =
    localStorage.getItem(CATEGORY_MIGRATION_KEY) === 'true';

  if (migrationDone) {
    const savedCategories = JSON.parse(
      localStorage.getItem('categories') || '[]'
    );

    return {
      expenses: savedExpenses,
      categories: savedCategories,
    };
  }

  const migratedExpenses = savedExpenses.map((expense) => {
    const category = DEFAULT_CATEGORIES.find(
      (item) => item.name === expense.category
    );

    const { category: oldCategory, ...rest } = expense;

    return {
      ...rest,
      categoryId: category ? category.id : 'other',
    };
  });
  localStorage.setItem(
  'expenses',
  JSON.stringify(migratedExpenses)
);

localStorage.setItem(
  'categories',
  JSON.stringify(DEFAULT_CATEGORIES)
);

localStorage.setItem(
  CATEGORY_MIGRATION_KEY,
  'true'
);

  return {
    expenses: migratedExpenses,

    categories: DEFAULT_CATEGORIES,
  };
}

import { useEffect, useState } from "react";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import "./App.css";

function App() {
  const [initialData] = useState(loadInitialData);
  const [expenses, setExpenses] = useState(initialData.expenses);
  const [categories, setCategories] = useState(initialData.categories);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  




const deleteExpense = (id) => {

    const updatedExpenses =
        expenses.filter(
            expense => expense.id !== id
        );

    setExpenses(updatedExpenses);

    if (
  editingExpense &&
  editingExpense.id === id
) {
  setEditingExpense(null);
}

    localStorage.setItem(
        "expenses",
        JSON.stringify(updatedExpenses)
    );

};
const filteredExpenses = expenses
.filter((expense) => {

  const matchesSearch =
    expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "" ||
    expense.category === selectedCategory;

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

const total = currentMonthExpenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);



const categoryTotals = {};

categories.forEach((category) => {
  categoryTotals[category.id] = currentMonthExpenses
    .filter((expense) => expense.categoryId === category.id)
    .reduce((sum, expense) => sum + expense.amount, 0);
});
  return (
  <div className="app">

    <Header />

    <ExpenseForm
  expenses={expenses}
  setExpenses={setExpenses}
  editingExpense={editingExpense}
  setEditingExpense={setEditingExpense}
/>
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
      <option value="Food">Food</option>
      <option value="Travel">Travel</option>
      <option value="Rent">Rent</option>
      <option value="Fun">Fun</option>
      <option value="Other">Other</option>
    </select>

    <ExpenseList
      expenses={filteredExpenses}
      deleteExpense={deleteExpense}
      totalExpenses={expenses.length}
      setEditingExpense={setEditingExpense}
    />

  </div>
);
}

export default App;