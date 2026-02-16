const pool = require("../config/db");


/* =====================================================
   CREATE TRANSACTION
===================================================== */

exports.create = async ({
  userId,
  categoryId,
  type,
  amount,
  currencyCode,
  transactionDate,
  description,
  receiptUrl
}) => {

  const query = `
    INSERT INTO transactions
    (
      user_id,
      category_id,
      type,
      amount,
      currency_code,
      transaction_date,
      description,
      receipt_url
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;

  const values = [
    userId,
    categoryId,
    type,
    amount,
    currencyCode || "USD",
    transactionDate,
    description || null,
    receiptUrl || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};


/* =====================================================
   DASHBOARD SUMMARY (NOW BASED ON TRANSACTION.TYPE)
===================================================== */

exports.getDashboardSummary = async (userId) => {

  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
    FROM transactions
    WHERE user_id = $1
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};


/* =====================================================
   MONTHLY REPORT (BASED ON TRANSACTION.TYPE)
===================================================== */

exports.getMonthlyReport = async (userId, month, year) => {

  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
    FROM transactions
    WHERE user_id = $1
      AND EXTRACT(MONTH FROM transaction_date) = $2
      AND EXTRACT(YEAR FROM transaction_date) = $3
  `;

  const { rows } = await pool.query(query, [userId, month, year]);
  return rows[0];
};


/* =====================================================
   BUDGET PROGRESS (ONLY EXPENSES COUNT)
===================================================== */

exports.getBudgetProgress = async (userId) => {

  const query = `
    SELECT 
      c.id,
      c.name,
      c.budget_limit,
      COALESCE(SUM(
        CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END
      ), 0) AS spent
    FROM categories c
    LEFT JOIN transactions t
      ON c.id = t.category_id
      AND t.user_id = $1
    WHERE c.user_id = $1
    GROUP BY c.id
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};


/* =====================================================
   CATEGORY BREAKDOWN
===================================================== */

exports.categoryBreakdown = async (userId) => {

  const query = `
    SELECT 
      c.name,
      t.type,
      SUM(t.amount) AS total
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
    GROUP BY c.name, t.type
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};


/* =====================================================
   GET ALL TRANSACTIONS
===================================================== */

exports.findAll = async (userId, limit, offset) => {

  const query = `
    SELECT 
      t.*,
      c.name AS category_name
    FROM transactions t
    JOIN categories c 
      ON t.category_id = c.id
    WHERE t.user_id = $1
    ORDER BY t.transaction_date DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [userId, limit, offset]);
  return rows;
};


/* =====================================================
   UPDATE TRANSACTION
===================================================== */

exports.update = async (id, userId, data) => {

  const { amount, description, type } = data;

  const query = `
    UPDATE transactions
    SET 
      amount = $1,
      description = $2,
      type = $3
    WHERE id = $4 AND user_id = $5
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    amount,
    description,
    type,
    id,
    userId
  ]);

  return rows[0];
};


/* =====================================================
   DELETE TRANSACTION
===================================================== */

exports.delete = async (id, userId) => {

  await pool.query(
    `DELETE FROM transactions
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};
