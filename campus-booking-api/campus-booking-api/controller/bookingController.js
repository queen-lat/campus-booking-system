const Booking = require("../models/bookingsModel");
const User = require("../models/usersModel");

function isValidTimeRange(start_time, end_time) {
  return start_time && end_time && start_time < end_time;
}

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.getAllBookings();
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { facility_id, user_id, user_name, date, start_time, end_time } = req.body || {};

    if (!facility_id || !user_id || !user_name || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields (facility_id, user_id, user_name, date, start_time, end_time)" });
    }

    if (!isValidTimeRange(start_time, end_time)) {
      return res.status(400).json({ message: "Invalid time range (start_time must be < end_time)" });
    }

    // Get or create user
    const user = await User.getOrCreateUser({ external_id: user_id, name: user_name });

    const conflict = await Booking.findConflict({ facility_id, date, start_time, end_time });
    if (conflict) {
      return res.status(409).json({ message: "Booking conflict: time slot already booked" });
    }

    const created = await Booking.createBooking({ facility_id, user_id: user.id, date, start_time, end_time });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid booking id" });

    const { facility_id, date, start_time, end_time, status } = req.body;

    if (!facility_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields (facility_id, date, start_time, end_time)" });
    }

    if (!isValidTimeRange(start_time, end_time)) {
      return res.status(400).json({ message: "Invalid time range (start_time must be < end_time)" });
    }

    const conflict = await Booking.findConflict({
      facility_id,
      date,
      start_time,
      end_time,
      excludeId: id,
    });

    if (conflict) {
      return res.status(409).json({ message: "Booking conflict: time slot already booked" });
    }

    const updated = await Booking.updateBooking(id, {
      date,
      start_time,
      end_time,
      status: status || "confirmed",
    });

    if (!updated) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid booking id" });

    const cancelled = await Booking.cancelBooking(id);
    if (!cancelled) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking cancelled successfully", booking: cancelled });
  } catch (err) {
    next(err);
  }
};
