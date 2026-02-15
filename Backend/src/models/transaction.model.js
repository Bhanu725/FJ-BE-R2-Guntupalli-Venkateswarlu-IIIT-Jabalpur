const pool = require('../config/db');

exports.create = async ({
  userId,
  categoryId,
  amount,
  currencyCode,
  transactionDate,
  description
}) => {
  const query = `
    INSERT INTO transactions
    (user_id, category_id, amount, currency_code, transaction_date, description)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    userId,
    categoryId,
    amount,
    currencyCode || 'USD',
    transactionDate,
    description || null
  ]);

  return rows[0];
};

exports.getDashboardSummary = async (userId) => {
  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount END), 0) AS total_expense
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

exports.getMonthlyReport = async (userId, month, year) => {
  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount END), 0) AS income,
      COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount END), 0) AS expense
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
      AND EXTRACT(MONTH FROM t.transaction_date) = $2
      AND EXTRACT(YEAR FROM t.transaction_date) = $3
  `;

  const { rows } = await pool.query(query, [userId, month, year]);
  return rows[0];
};

exports.getBudgetProgress = async (userId) => {
  const query = `
    SELECT 
      c.id,
      c.name,
      c.budget_limit,
      COALESCE(SUM(t.amount), 0) AS spent
    FROM categories c
    LEFT JOIN transactions t
      ON c.id = t.category_id
      AND t.user_id = $1
    WHERE c.user_id = $1
      AND c.type = 'expense'
    GROUP BY c.id
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};
