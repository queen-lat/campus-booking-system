require("dotenv").config();
const pool = require("./config/db");

async function seedFacilities() {
  try {
    console.log("🌱 Starting facility seeding...\n");

    // Create facilities table if it doesn't exist
    console.log("📋 Creating facilities table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        location VARCHAR(255),
        capacity INT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Facilities table created or already exists\n");

    // Create bookings table if it doesn't exist
    console.log("📋 Creating bookings table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        facility_id INT NOT NULL REFERENCES facilities(id),
        user_id INT NOT NULL REFERENCES users(id),
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Bookings table created or already exists\n");

    // Sample facilities data
    const facilities = [
      {
        name: "Engineering Lab",
        location: "Building A, Room 101",
        capacity: 30,
        description: "State-of-the-art engineering laboratory with advanced equipment"
      },
      {
        name: "Conference Room",
        location: "Building B, Floor 2",
        capacity: 20,
        description: "Professional conference room with video conferencing setup"
      },
      {
        name: "Study Hall",
        location: "Central Library, Ground Floor",
        capacity: 50,
        description: "Quiet study space for individual and group work"
      },
      {
        name: "Computer Lab",
        location: "IT Building, Room 205",
        capacity: 40,
        description: "Computer lab with 40 high-performance workstations"
      }
    ];

    // Insert or skip facilities
    console.log("📚 Seeding facilities...");
    let addedCount = 0;
    for (const facility of facilities) {
      try {
        const result = await pool.query(
          `INSERT INTO facilities (name, location, capacity, description) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (name) DO NOTHING
           RETURNING id, name;`,
          [facility.name, facility.location, facility.capacity, facility.description]
        );
        
        if (result.rows.length > 0) {
          console.log(`  ✅ Added: ${facility.name} (ID: ${result.rows[0].id})`);
          addedCount++;
        } else {
          console.log(`  ℹ️  Skipped: ${facility.name} (already exists)`);
        }
      } catch (err) {
        console.error(`  ❌ Error adding ${facility.name}:`, err.message);
      }
    }

    // Display all facilities
    console.log("\n📊 Facilities in database:");
    const { rows } = await pool.query(
      "SELECT id, name, location, capacity FROM facilities ORDER BY id"
    );
    
    if (rows.length === 0) {
      console.log("  ⚠️  No facilities found");
    } else {
      console.log(`\n  Total: ${rows.length} facilities\n`);
      rows.forEach((f) => {
        console.log(`  [ID: ${f.id}] ${f.name}`);
        console.log(`      📍 Location: ${f.location}`);
        console.log(`      👥 Capacity: ${f.capacity} people\n`);
      });
    }

    console.log("✅ Seeding completed successfully!");
    console.log(`🎉 ${addedCount} new facilities added\n`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedFacilities();
