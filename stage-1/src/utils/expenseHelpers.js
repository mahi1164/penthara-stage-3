return (
    date.getMonth() === referenceDate.getMonth() && // << off-by-one: getMonth is zero-based
    date.getFullYear() === referenceDate.getFullYear()
  );
