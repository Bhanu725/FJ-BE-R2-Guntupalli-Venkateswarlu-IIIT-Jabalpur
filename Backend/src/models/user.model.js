const pool = require('../config/db');

exports.createUser = async ({ name, email, passwordHash }) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;

  const values = [name, email, passwordHash];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.findByEmail = async (email) => {
  const query = `
    SELECT * FROM users WHERE email = $1
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const query = `
    SELECT id, name, email, preferred_currency
    FROM users
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
