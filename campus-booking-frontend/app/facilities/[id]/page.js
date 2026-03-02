"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, use } from "react";
import { API } from "../../../lib/api";

function Badge({ variant = "neutral", children }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  const styles =
    variant === "success"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
      : variant === "warning"
      ? "border-amber-300 bg-amber-50 text-amber-700"
      : variant === "danger"
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-pink-300 bg-pink-100 text-pink-700";

  return <span className={`${base} ${styles}`}>{children}</span>;
}

function fmtTime(t) {
  return String(t || "").slice(0, 5);
}

export default function FacilityPage({ params }) {
  const { id } = use(params);
  const facilityId = id;

  const [facility, setFacility] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null); // {type:"success"|"error"|"info", text:string}

  // ✅ error state must be INSIDE component
  const [error, setError] = useState("");

  // Booking modal
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Simple user identity fields
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  async function load() {
    setMsg(null);
    setError("");
    setLoading(true);

    const f = await API.getFacility(facilityId);
    setFacility(f);

    const a = await API.getAvailability(facilityId, date);
    setSlots(a?.slots || []);
    setSelectedSlot(null);

    setLoading(false);
  }

  useEffect(() => {
    if (!facilityId) return;

    load().catch((e) => {
      setLoading(false);
      setError(e?.message || "Failed to load facility/availability");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityId, date]);

  // Optional: auto-refresh every 10s
  useEffect(() => {
    if (!facilityId) return;

    const t = setInterval(() => {
      API.getAvailability(facilityId, date)
        .then((a) => setSlots(a?.slots || []))
        .catch(() => {});
    }, 10000);

    return () => clearInterval(t);
  }, [facilityId, date]);

  const selectedLabel = useMemo(() => {
    if (!selectedSlot) return "";
    return `${fmtTime(selectedSlot.start_time)}–${fmtTime(selectedSlot.end_time)}`;
  }, [selectedSlot]);

  async function book() {
    setMsg(null);

    if (!selectedSlot) {
      setMsg({ type: "info", text: "Select an available slot first." });
      return;
    }

    if (!userName.trim() || !userId.trim()) {
      setMsg({ type: "error", text: "Please enter your name and ID to book." });
      return;
    }

    try {
      setSubmitting(true);

      // FAKE: Simulating successful booking without backend call
      const newBooking = {
        id: Math.floor(Math.random() * 100000),
        facility_id: Number(facilityId),
        facility_name: facility.name,
        user_name: userName,
        user_id: userId,
        date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      console.log("🎭 FAKE BOOKING:", newBooking);

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem("localBookings") || "[]");
      existingBookings.push(newBooking);
      localStorage.setItem("localBookings", JSON.stringify(existingBookings));

      setOpen(false);
      setUserName("");
      setUserId("");
      setSelectedSlot(null);
      setMsg({ type: "success", text: "✅ Booking created successfully!" });
    } catch (e) {
      setMsg({ type: "error", text: "❌ " + (e?.message || "Booking failed.") });
    } finally {
      setSubmitting(false);
    }
  }

  // If facility hasn't loaded yet, show loading (but also show error if present)
  if (!facility) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
        {error ? (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-4 text-red-200">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          "Loading…"
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 text-pink-950">
      {/* Top bar */}
      <header className="border-b border-pink-200 bg-pink-100/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{facility.name}</h1>
            <p className="text-sm text-pink-700">
              {facility.location} • Capacity {facility.capacity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-pink-300 bg-pink-100 px-3 py-2 text-sm font-medium hover:bg-pink-200 transition"
            >
              ← Back
            </Link>
            <Link
              href="/bookings"
              className="rounded-xl border border-pink-300 bg-pink-100 px-3 py-2 text-sm font-medium hover:bg-pink-200 transition"
            >
              Booking history
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        {/* ✅ show load errors */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-100 p-4 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Alerts */}
        {msg && (
          <div
            className={`mb-6 rounded-2xl border p-4 ${
              msg.type === "success"
                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                : msg.type === "error"
                ? "border-red-300 bg-red-100 text-red-700"
                : "border-pink-300 bg-pink-100 text-pink-700"
            }`}
          >
            <p className="text-sm font-medium">{msg.text}</p>
          </div>
        )}

        {/* Controls */}
        <div className="rounded-2xl border border-pink-300 bg-pink-100 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-base font-semibold">✨ Availability</h2>
              <p className="mt-1 text-sm text-pink-700">
                Select a date, then click an available slot to book.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="success">Available</Badge>
                <Badge variant="danger">Booked</Badge>
                <Badge variant="warning">Auto-refresh (10s)</Badge>
              </div>
            </div>

            <div className="w-full md:w-[260px]">
              <label className="text-xs font-medium text-pink-700">Select date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-pink-300 bg-white px-3 py-2 text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
        </div>

        {/* Slots grid */}
        <div className="mt-6 rounded-2xl border border-pink-300 bg-pink-100 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-pink-800 font-medium">
              {loading ? "Loading slots…" : `${slots.length} slots`}
            </p>

            <button
              onClick={() => load().catch((e) => setError(e?.message || "Refresh failed"))}
              className="rounded-xl border border-pink-300 bg-pink-200 px-3 py-2 text-xs font-medium hover:bg-pink-300 transition"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((s) => {
              const isSelected =
                selectedSlot &&
                selectedSlot.start_time === s.start_time &&
                selectedSlot.end_time === s.end_time;

              const available = !!s.available;

              return (
                <button
                  key={`${s.start_time}-${s.end_time}`}
                  disabled={!available}
                  onClick={() => {
                    setSelectedSlot(s);
                    setOpen(true);
                  }}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    available
                      ? "border-pink-400 bg-white hover:bg-pink-50 hover:shadow-md"
                      : "border-pink-200 bg-pink-50/50 opacity-50 cursor-not-allowed",
                    isSelected ? "ring-2 ring-pink-400 shadow-lg bg-pink-100" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-pink-900">
                        {fmtTime(s.start_time)} – {fmtTime(s.end_time)}
                      </div>
                      <div className="mt-1 text-xs text-pink-600">30 minutes</div>
                    </div>

                    {available ? (
                      <Badge variant="success">Available</Badge>
                    ) : (
                      <Badge variant="danger">Booked</Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {slots.length === 0 && !loading && (
            <div className="mt-6 rounded-2xl border border-pink-300 bg-white p-6 text-center">
              <p className="text-sm text-pink-900">No slots returned for this date.</p>
              <p className="mt-1 text-xs text-pink-600">
                Check your backend availability generator.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {open && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-pink-400 bg-pink-50 shadow-2xl">
            <div className="border-b border-pink-200 bg-gradient-to-r from-pink-100 to-pink-50 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-pink-900">✨ Create booking</h3>
                  <p className="mt-1 text-sm text-pink-700">
                    {facility.name} • {date} • {selectedLabel}
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-pink-300 bg-pink-100 px-3 py-2 text-sm text-pink-900 hover:bg-pink-200 transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-pink-700">Your name</label>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g., Latifah"
                    className="mt-1 w-full rounded-xl border border-pink-300 bg-white px-3 py-2 text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-pink-700">
                    Student/Staff ID
                  </label>
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g., 108xxxx"
                    className="mt-1 w-full rounded-xl border border-pink-300 bg-white px-3 py-2 text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-pink-300 bg-pink-100 p-4 text-sm text-pink-900 font-medium">
                📅 You're booking: <span className="font-bold text-pink-700">{selectedLabel}</span>
              </div>
            </div>

            <div className="border-t border-pink-200 bg-pink-100/50 px-5 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-pink-300 bg-pink-100 px-3 py-2 text-sm text-pink-900 hover:bg-pink-200 transition"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={book}
                className="rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-4 py-2 text-sm font-bold text-white hover:from-pink-500 hover:to-pink-600 transition disabled:opacity-70 shadow-md"
              >
                {submitting ? "Booking…" : "Confirm booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}