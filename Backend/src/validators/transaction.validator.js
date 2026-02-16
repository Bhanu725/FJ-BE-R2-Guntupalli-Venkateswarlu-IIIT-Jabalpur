exports.validateCreateTransaction = (data) => {
  const { categoryId, amount, transactionDate, type } = data;

  if (!categoryId) throw new Error("Category required");
  if (!amount || Number(amount) === 0) throw new Error("Invalid amount");
  if (!transactionDate) throw new Error("Date required");
  if (!["income", "expense"].includes(type))
    throw new Error("Type must be income or expense");
};
