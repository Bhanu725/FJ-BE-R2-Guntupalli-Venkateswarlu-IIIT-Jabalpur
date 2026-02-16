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

exports.categoryBreakdown = async (userId) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.name, c.type, SUM(t.amount) AS total
       FROM transactions t
       JOIN categories c ON t.category_id=c.id
       WHERE t.user_id=$1
       GROUP BY c.name, c.type`,
      [userId]
    );

    // res.json(rows);
    return rows;
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.findAll = async (userId, limit, offset) => {
  const { rows } = await pool.query(
    `SELECT t.*, c.name AS category_name
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1
     ORDER BY t.transaction_date DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return rows;
};


exports.update = async (id, userId, data) => {
  const { amount, description } = data;

  const { rows } = await pool.query(
    `UPDATE transactions
     SET amount = $1,
         description = $2
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
    [amount, description, id, userId]
  );

  return rows[0];
};


exports.delete = async (id, userId) => {
  await pool.query(
    `DELETE FROM transactions
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};