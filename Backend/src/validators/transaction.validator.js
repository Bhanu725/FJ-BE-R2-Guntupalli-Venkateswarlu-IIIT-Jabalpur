exports.validateCreateTransaction = (data) => {
  const { categoryId, amount, transactionDate } = data;

  if (!categoryId) {
    throw new Error("Category is required");
  }

  if (!amount || Number(amount) === 0) {
    throw new Error("Amount must be non-zero");
  }

  if (!transactionDate) {
    throw new Error("Transaction date is required");
  }
};
