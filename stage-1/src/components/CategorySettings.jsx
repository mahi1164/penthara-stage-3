import { useState } from "react";

function CategorySettings({ categories, setCategories, expenses }) {
  const [newName, setNewName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [budgetId, setBudgetId] = useState(null);
  const [budgetValue, setBudgetValue] = useState("");

  function createCategory(event) {
    event.preventDefault();

    const name = newName.trim();

    if (!name) return;

    const alreadyExists = categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) return;

    const newCategory = {
      id: `category-${Date.now()}`,
      name,
      monthlyBudget: null,
    };

    setCategories([...categories, newCategory]);
    setNewName("");
  }

  function startRename(category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  function saveRename(id) {
    const name = editingName.trim();

    if (!name) return;

    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, name }
          : category
      )
    );

    setEditingId(null);
    setEditingName("");
  }

  function saveBudget(id) {
    const trimmed = budgetValue.trim();

    const budget =
      trimmed === ""
        ? null
        : Number(trimmed);

    if (
      budget !== null &&
      (!Number.isFinite(budget) || budget < 0)
    ) {
      return;
    }

    setCategories(
      categories.map((category) =>
        category.id === id
          ? {
              ...category,
              monthlyBudget: budget,
            }
          : category
      )
    );

    setBudgetId(null);
    setBudgetValue("");
  }
  const currentDate = new Date();

const currentMonthExpenses = expenses.filter((expense) => {
  const expenseDate = new Date(expense.date);

  return (
    expenseDate.getMonth() === currentDate.getMonth() &&
    expenseDate.getFullYear() === currentDate.getFullYear()
  );
});

  return (
    <section className="category-settings">
      <h2>Category Settings</h2>

      <form onSubmit={createCategory}>
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />

        <button type="submit">
          Create category
        </button>
      </form>

      {categories.map((category) => {
  const spent = currentMonthExpenses
    .filter((expense) => expense.categoryId === category.id)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div key={category.id} className="category-setting-row">

          {editingId === category.id ? (
            <>
              <input
                value={editingName}
                onChange={(event) =>
                  setEditingName(event.target.value)
                }
              />

              <button
                type="button"
                onClick={() => saveRename(category.id)}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <strong>{category.name}</strong>

              <button
                type="button"
                onClick={() => startRename(category)}
              >
                Rename
              </button>
            </>
          )}

          {budgetId === category.id ? (
            <>
              <input
                type="number"
                min="0"
                placeholder="Monthly budget"
                value={budgetValue}
                onChange={(event) =>
                  setBudgetValue(event.target.value)
                }
              />

              <button
                type="button"
                onClick={() => saveBudget(category.id)}
              >
                Save budget
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setBudgetId(category.id);
                setBudgetValue(
                  category.monthlyBudget ?? ""
                );
              }}
            >
              Set budget
            </button>
          )}

          <span>
  Spent: ₹{spent.toLocaleString("en-IN")}
  {" / "}
  {category.monthlyBudget === null
    ? "No budget"
    : `₹${category.monthlyBudget.toLocaleString("en-IN")}`}
</span>

        </div>
      );
      })}
    </section>
  );
}

export default CategorySettings;