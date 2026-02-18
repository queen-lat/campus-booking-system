const pool = require("../config/db");

// join to show facility & user names 
async function getAllBookings() {
  const { rows } = await pool.query(
    `SELECT b.*, f.name AS facility_name, u.name AS user_name
     FROM bookings b
     JOIN facilities f ON f.id = b.facility_id
     JOIN users u ON u.id = b.user_id
     ORDER BY b.date DESC, b.start_time ASC`
  );
  return rows;
}

// overlap rule: newStart < existingEnd AND newEnd > existingStart
async function findConflict({ facility_id, date, start_time, end_time, excludeId = null }) {
  const params = [facility_id, date, start_time, end_time];

  let sql = `
    SELECT * FROM bookings
    WHERE facility_id = $1
      AND date = $2
      AND status <> 'cancelled'
      AND ($3 < end_time AND $4 > start_time)
  `;

  if (excludeId) {
    params.push(excludeId);
    sql += ` AND id <> $5`;
  }

  const { rows } = await pool.query(sql, params);
  return rows[0];
}

async function createBooking({ facility_id, user_id, date, start_time, end_time }) {
  const { rows } = await pool.query(
    `INSERT INTO bookings (facility_id, user_id, date, start_time, end_time, status)
     VALUES ($1,$2,$3,$4,$5,'confirmed')
     RETURNING *`,
    [facility_id, user_id, date, start_time, end_time]
  );
  return rows[0];
}

async function updateBooking(id, { date, start_time, end_time, status }) {
  const { rows } = await pool.query(
    `UPDATE bookings
     SET date=$1, start_time=$2, end_time=$3, status=$4
     WHERE id=$5
     RETURNING *`,
    [date, start_time, end_time, status, id]
  );
  return rows[0];
}

// “cancel” booking (better than delete for audit trail)
async function cancelBooking(id) {
  const { rows } = await pool.query(
    `UPDATE bookings
     SET status='cancelled'
     WHERE id=$1
     RETURNING *`,
    [id]
  );
  return rows[0];
}

// for availability
async function getBookingsForFacilityDate(facility_id, date) {
  const { rows } = await pool.query(
    `SELECT * FROM bookings
     WHERE facility_id=$1 AND date=$2 AND status <> 'cancelled'
     ORDER BY start_time ASC`,
    [facility_id, date]
  );
  return rows;
}

module.exports = {
  getAllBookings,
  findConflict,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingsForFacilityDate,
};
