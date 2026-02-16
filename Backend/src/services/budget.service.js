const pool = require("../config/db");
const { sendEmail } = require("../config/mail");

exports.checkBudgetOverrun = async (userId, categoryId, userEmail) => {

  // Get budget limit for this category
  const { rows: categoryRows } = await pool.query(
    `SELECT name, budget_limit
     FROM categories
     WHERE id = $1 AND user_id = $2`,
    [categoryId, userId]
  );

  if (!categoryRows.length) return;

  const { name, budget_limit } = categoryRows[0];

  if (!budget_limit) return; // no budget set

  // Calculate total expense for this category
  const { rows: expenseRows } = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS total_expense
     FROM transactions
     WHERE user_id = $1
       AND category_id = $2
       AND type = 'expense'`,
    [userId, categoryId]
  );

  const totalExpense = Number(expenseRows[0].total_expense);

  if (totalExpense > Number(budget_limit)) {

    console.log("Budget exceeded for:", name);

    await sendEmail(
      userEmail,
      "Budget Exceeded",
      `You exceeded your budget for "${name}"

Budget Limit: ${budget_limit}
Spent: ${totalExpense}`
    );
  }
};
