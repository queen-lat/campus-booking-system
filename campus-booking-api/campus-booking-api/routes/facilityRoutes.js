const router = require("express").Router();
const facilityController = require("../controller/facilityController");

router.get("/", facilityController.getFacilities);
router.get("/:id", facilityController.getFacilityById);

module.exports = router;
