const pool = require("../config/db");

// Get or create a user by external_id and name
async function getOrCreateUser({ external_id, name }) {
  try {
    // First, try to find existing user by external_id
    const { rows: existing } = await pool.query(
      `SELECT * FROM users WHERE external_id = $1`,
      [external_id]
    );

    if (existing.length > 0) {
      return existing[0];
    }

    // If not found, create new user
    // Generate a placeholder email using external_id since email is required
    const placeholderEmail = `${external_id}@campus.local`;
    const { rows: created } = await pool.query(
      `INSERT INTO users (external_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [external_id, name, placeholderEmail, 'user']
    );

    return created[0];
  } catch (err) {
    throw err;
  }
}

async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return rows[0];
}

module.exports = {
  getOrCreateUser,
  getUserById,
};
