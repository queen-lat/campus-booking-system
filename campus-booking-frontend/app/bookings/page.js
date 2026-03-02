"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();

  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";

  if (s === "cancelled") {
    return (
      <span className={`${base} border-red-300 bg-red-100 text-red-700`}>
        Cancelled
      </span>
    );
  }

  if (s === "pending") {
    return (
      <span className={`${base} border-amber-300 bg-amber-100 text-amber-700`}>
        Pending
      </span>
    );
  }

  if (s === "approved" || s === "confirmed") {
    return (
      <span className={`${base} border-emerald-300 bg-emerald-100 text-emerald-700`}>
        {status}
      </span>
    );
  }

  // default: "active"/"booked"/unknown
  return (
    <span className={`${base} border-pink-300 bg-pink-100 text-pink-700`}>
      {status || "Unknown"}
    </span>
  );
}

function fmtDate(d) {
  try {
    return String(d).slice(0, 10);
  } catch {
    return "-";
  }
}

function fmtTime(t) {
  try {
    return String(t).slice(0, 5);
  } catch {
    return "-";
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load bookings from localStorage
    try {
      const localBookings = JSON.parse(localStorage.getItem("localBookings") || "[]");
      setBookings(localBookings);
    } catch (e) {
      console.error("Error loading bookings:", e);
      setBookings([]);
    }
    setLoading(false);
  }, []);

  const handleDeleteBooking = (bookingId) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem("localBookings", JSON.stringify(updatedBookings));
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-950">
      {/* Top bar */}
      <header className="border-b border-pink-200 bg-pink-100/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">📋 Booking History</h1>
            <p className="text-sm text-pink-700">
              Track your bookings and status updates.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-pink-300 bg-pink-100 px-3 py-2 text-sm font-medium hover:bg-pink-200 transition"
          >
            ← Back to facilities
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-2xl border border-pink-300 bg-pink-100">
          <div className="flex items-center justify-between border-b border-pink-200 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-pink-900">All bookings</h2>
              <p className="mt-1 text-sm text-pink-700">
                {Array.isArray(bookings) ? bookings.length : 0} total
              </p>
            </div>

            <div className="text-xs text-pink-600">
              ✨ Your bookings appear here
            </div>
          </div>

          {/* Empty state */}
          {!loading && (!bookings || bookings.length === 0) ? (
            <div className="p-8 text-center">
              <p className="text-sm text-pink-900">No bookings yet.</p>
              <p className="mt-1 text-xs text-pink-700">
                Create a booking from a facility availability page.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-4 py-2 text-sm font-bold text-white hover:from-pink-500 hover:to-pink-600 transition shadow-md"
              >
                Browse facilities →
              </Link>
            </div>
          ) : loading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-pink-900">Loading bookings…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-pink-200/50 text-xs uppercase tracking-wide text-pink-800 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Facility</th>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-pink-200">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-pink-200/30 transition">
                      <td className="px-5 py-4">
                        <div className="font-medium text-pink-900">
                          {b.facility_name || b.facility_id || "—"}
                        </div>
                        <div className="text-xs text-pink-700">
                          ID: {b.facility_id || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-pink-900">
                          {b.user_name || b.user_id || "—"}
                        </div>
                        {b.user_name && b.user_id && (
                          <div className="text-xs text-pink-700">({b.user_id})</div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-pink-900">{fmtDate(b.date)}</td>

                      <td className="px-5 py-4 text-pink-900">
                        {fmtTime(b.start_time)} – {fmtTime(b.end_time)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={b.status} />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-pink-200 px-5 py-4 text-xs text-pink-700 bg-pink-50/50">
                💡 Tip: Your bookings are saved locally in your browser.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}