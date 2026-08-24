return (
    date.getMonth() + 1 === referenceDate.getMonth() && // << off-by-one: getMonth is zero-based
    date.getFullYear() === referenceDate.getFullYear()
  );