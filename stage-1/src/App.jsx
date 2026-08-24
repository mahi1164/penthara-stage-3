useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, []); // << should depend on searchTerm, not empty array