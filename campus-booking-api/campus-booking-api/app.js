require("dotenv").config();
const express = require("express");
const cors = require("cors");

const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Campus Booking API running ✅" }));

app.use("/facilities", facilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/availability", availabilityRoutes);

const PORT = process.env.PORT || 5000;

// Initialize database on startup
async function startServer() {
  try {
    console.log("🔄 Initializing database...");
    
    // Run migrations
    const runMigration = require("./migrate");
    await runMigration();
    
    // Seed facilities
    const seedFacilities = require("./seed");
    await seedFacilities();
    
    console.log("✅ Database initialization complete!");
    
    // Start the server
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    process.exit(1);
  }
}

startServer();
