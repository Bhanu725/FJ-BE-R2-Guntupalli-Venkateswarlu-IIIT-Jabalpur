const pool = require('../config/db');

exports.create = async ({ userId, name, type, budgetLimit }) => {
  const query = `
    INSERT INTO categories (user_id, name, type, budget_limit)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    userId,
    name,
    type,
    budgetLimit || null
  ]);

  return rows[0];
};

exports.findAllByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM categories
     WHERE user_id = $1 AND is_deleted = FALSE
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

exports.findById = async (id, userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM categories
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return rows[0];
};

exports.update = async (id, userId, data) => {
  const { name, budgetLimit } = data;

  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1,
         budget_limit = $2
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
    [name, budgetLimit, id, userId]
  );

  
  return rows[0];
};


exports.softDelete = async (id, userId) => {
  await pool.query(
    `UPDATE categories
     SET is_deleted = TRUE
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};