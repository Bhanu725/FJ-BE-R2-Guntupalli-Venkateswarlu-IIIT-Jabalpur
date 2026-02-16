const pool = require("../config/db");


/* ============================================
   CREATE CATEGORY (NO TYPE ANYMORE)
============================================ */

exports.create = async ({ userId, name, budgetLimit }) => {

  const query = `
    INSERT INTO categories (user_id, name, budget_limit)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    userId,
    name,
    budgetLimit || null
  ]);

  return rows[0];
};


/* ============================================
   GET ALL CATEGORIES
============================================ */

exports.findAllByUser = async (userId) => {

  const { rows } = await pool.query(
    `SELECT *
     FROM categories
     WHERE user_id = $1
       AND is_deleted = FALSE
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};


/* ============================================
   FIND BY ID
============================================ */

exports.findById = async (id, userId) => {

  const { rows } = await pool.query(
    `SELECT *
     FROM categories
     WHERE id = $1
       AND user_id = $2
       AND is_deleted = FALSE`,
    [id, userId]
  );

  return rows[0];
};


/* ============================================
   UPDATE CATEGORY
============================================ */

exports.update = async (id, userId, data) => {

  const { name, budgetLimit } = data;

  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1,
         budget_limit = $2
     WHERE id = $3
       AND user_id = $4
     RETURNING *`,
    [name, budgetLimit || null, id, userId]
  );

  return rows[0];
};


/* ============================================
   SOFT DELETE
============================================ */

exports.softDelete = async (id, userId) => {

  await pool.query(
    `UPDATE categories
     SET is_deleted = TRUE
     WHERE id = $1
       AND user_id = $2`,
    [id, userId]
  );
};
