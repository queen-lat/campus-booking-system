const pool = require("../config/db");

async function getAllFacilities() {
  const { rows } = await pool.query("SELECT * FROM facilities ORDER BY id ASC");
  return rows;
}

async function getFacilityById(id) {
  const { rows } = await pool.query("SELECT * FROM facilities WHERE id=$1", [id]);
  return rows[0];
}

module.exports = {
  getAllFacilities,
  getFacilityById,
};
