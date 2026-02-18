import { API } from "../../lib/api";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const cls =
    s === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${cls}`}>
      {status}
    </span>
  );
}

export default async function BookingsPage() {
  const bookings = await API.getBookings();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Booking History</h1>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2 text-left">Facility</th>
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Time</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="border p-2">
                  {b.facility_name || b.facility_id}
                </td>
                <td className="border p-2">
                  {b.user_name || b.user_id}
                </td>
                <td className="border p-2">
                  {String(b.date).slice(0, 10)}
                </td>
                <td className="border p-2">
                  {String(b.start_time).slice(0, 5)} -{" "}
                  {String(b.end_time).slice(0, 5)}
                </td>
                <td className="border p-2">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
