const Facility = require("../models/facilityModels");

exports.getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.getAllFacilities();
    res.status(200).json(facilities);
  } catch (err) {
    next(err);
  }
};

exports.getFacilityById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid facility id" });

    const facility = await Facility.getFacilityById(id);
    if (!facility) return res.status(404).json({ message: "Facility not found" });

    res.status(200).json(facility);
  } catch (err) {
    next(err);
  }
};
