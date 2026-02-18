const router = require("express").Router();
const bookingController = require("../controller/bookingController");

router.get("/", bookingController.getBookings);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.cancelBooking);

module.exports = router;
