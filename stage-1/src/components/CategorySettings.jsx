function saveRename(id) {
  const name = editingName.trim();

  if (!name) return;

  setCategories(
    categories.map((category)=>
      category.id===id
                   ?{...category, name}
                   : category
      )
  );
  //Now, no passing the same array reference to set and no direct object mutation
  setEditingId(null);
  setEditingName("");
}
