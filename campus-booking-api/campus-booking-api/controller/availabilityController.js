const Booking = require("../models/bookingsModel");
const { generateSlots } = require("../utils/time");

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

exports.getAvailability = async (req, res, next) => {
  try {
    const { facility_id, date } = req.query;

    if (!facility_id || !date) {
      return res.status(400).json({ message: "facility_id and date are required" });
    }

    const bookings = await Booking.getBookingsForFacilityDate(Number(facility_id), date);
    const slots = generateSlots();

    const result = slots.map((slot) => {
      const booked = bookings.some((b) =>
        overlaps(slot.start_time, slot.end_time, b.start_time, b.end_time)
      );
      return { ...slot, available: !booked };
    });

    res.status(200).json({ facility_id: Number(facility_id), date, slots: result });
  } catch (err) {
    next(err);
  }
};
