const router = require("express").Router();
const availabilityController = require("../controller/availabilityController");

router.get("/", availabilityController.getAvailability);

module.exports = router;
