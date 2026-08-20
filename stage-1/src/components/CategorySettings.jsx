import { useState } from "react";

function CategorySettings({ categories, setCategories, expenses, setExpenses, currentMonthSpentByCategory, deletedExpense, setDeletedExpense, }) {
  const [newName, setNewName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [budgetId, setBudgetId] = useState(null);
  const [budgetValue, setBudgetValue] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [replacementId, setReplacementId] = useState("");

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

  function deleteCategory(categoryId) {
  if (!replacementId) return;

  const updatedExpenses = expenses.map((expense) =>
    expense.categoryId === categoryId
      ? {
          ...expense,
          categoryId: replacementId,
        }
      : expense
  );
  if (
  deletedExpense &&
  deletedExpense.categoryId === categoryId
) {
  setDeletedExpense({
    ...deletedExpense,
    categoryId: replacementId,
  });
}

  setExpenses(updatedExpenses);

  const updatedCategories = categories.filter(
    (category) => category.id !== categoryId
  );

  setCategories(updatedCategories);

  setDeletingId(null);
  setReplacementId("");
}



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
      const spent = currentMonthSpentByCategory[category.id] || 0;

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
          {deletingId === category.id ? (
  <>
    <select
      value={replacementId}
      onChange={(event) => setReplacementId(event.target.value)}
    >
      <option value="">Reassign expenses to...</option>

      {categories
        .filter((item) => item.id !== category.id)
        .map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
    </select>

    <button
  type="button"
  disabled={!replacementId}
  onClick={() => deleteCategory(category.id)}
>
  Confirm Delete
</button>

    <button
      type="button"
      onClick={() => {
        setDeletingId(null);
        setReplacementId("");
      }}
    >
      Cancel
    </button>
  </>
) : (
  <button
    type="button"
    onClick={() => {
      setDeletingId(category.id);
      setReplacementId("");
    }}
  >
    Delete
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