require("dotenv").config();
const express = require("express");
const cors = require("cors");

const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Campus Booking API running ✅" }));

app.use("/facilities", facilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/availability", availabilityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
