const Transaction = require('../models/transaction.model');
const { sendEmail } = require('../config/mail');

exports.checkBudgetOverrun = async (user, categoryId) => {
  const progress = await Transaction.getBudgetProgress(user.id);

  const category = progress.find(c => c.id === categoryId);

  if (!category || !category.budget_limit) return;

  if (Number(category.spent) > Number(category.budget_limit)) {
    await sendEmail(
      user.email,
      "Budget Exceeded",
      `You exceeded your budget for ${category.name}`
    );
  }
};
