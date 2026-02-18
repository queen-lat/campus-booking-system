"use client";

import { useEffect, useState } from "react";
import { API } from "../../../lib/api";

export default function FacilityPage({ params }) {
  const facilityId = params.id;

  const [facility, setFacility] = useState(null);
  const [date, setDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const f = await API.getFacility(facilityId);
    setFacility(f);

    const a = await API.getAvailability(facilityId, date);
    setSlots(a.slots || []);
    setSelectedSlot(null);
  }

  useEffect(() => {
    load().catch((e) => setMsg(e.message));
  }, [facilityId, date]);

  async function book() {
    setMsg("");

    if (!selectedSlot) {
      setMsg("Select an available slot first.");
      return;
    }

    try {
      await API.createBooking({
        facility_id: Number(facilityId),
        user_id: 1, // demo user
        date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      });

      setMsg("✅ Booking created!");
      await load();
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  }

  if (!facility) return <div className="p-6">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{facility.name}</h1>
      <p className="text-gray-600">
        {facility.location} • Capacity {facility.capacity}
      </p>

      <div className="mt-6">
        <label className="text-sm font-medium">
          Select date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-2 ml-2"
          />
        </label>
      </div>

      <h2 className="text-lg font-semibold mt-6">
        Availability (30-minute slots)
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
        {slots.map((s) => {
          const selected =
            selectedSlot &&
            selectedSlot.start_time === s.start_time &&
            selectedSlot.end_time === s.end_time;

          return (
            <button
              key={s.start_time}
              disabled={!s.available}
              onClick={() => setSelectedSlot(s)}
              className={`border rounded-lg p-2 text-sm ${
                s.available ? "" : "opacity-40"
              } ${selected ? "ring-2 ring-blue-500" : ""}`}
            >
              <div>
                {s.start_time.slice(0, 5)} -{" "}
                {s.end_time.slice(0, 5)}
              </div>
              <div className="text-xs">
                {s.available ? "Available" : "Booked"}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={book}
        className="bg-blue-600 text-white rounded-lg p-2 mt-5"
      >
        Book Selected Slot
      </button>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </main>
  );
}
