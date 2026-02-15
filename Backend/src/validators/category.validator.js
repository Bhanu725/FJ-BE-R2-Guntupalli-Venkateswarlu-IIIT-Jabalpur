exports.validateCreateCategory = (data) => {
  const { name, type, budgetLimit } = data;

  if (!name || name.trim() === "") {
    throw new Error("Category name is required");
  }

  if (!["income", "expense"].includes(type)) {
    throw new Error("Category type must be income or expense");
  }

  if (budgetLimit && Number(budgetLimit) < 0) {
    throw new Error("Budget limit cannot be negative");
  }
};
