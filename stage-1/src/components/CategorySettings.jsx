function saveRename(id) {
  const name = editingName.trim();

  if (!name) return;

  const categoryToRename = categories.find(
    (category) => category.id === id
  );

  if (categoryToRename) {
    categoryToRename.name = name; // << direct mutation
  }

  setCategories(categories); // << not triggering re-render reliably

  setEditingId(null);
  setEditingName("");
}