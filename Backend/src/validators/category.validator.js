exports.validateCreateCategory = (data) => {

  const { name, budgetLimit } = data;

  if (!name || name.trim() === "") {
    throw new Error("Category name is required");
  }

  if (budgetLimit !== undefined && Number(budgetLimit) < 0) {
    throw new Error("Budget limit cannot be negative");
  }
};
