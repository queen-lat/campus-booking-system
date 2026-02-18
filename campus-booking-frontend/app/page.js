import Link from "next/link";
import { API } from "../lib/api";

export default async function HomePage() {
  const facilities = await API.getFacilities();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Campus Facilities</h1>
      <p className="text-gray-600 mt-1">
        Select a facility to view availability and create a booking.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {facilities.map((f) => (
          <div key={f.id} className="border rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{f.name}</h3>
            <p className="text-sm text-gray-600">{f.location}</p>
            <p className="text-sm mt-1">Capacity: {f.capacity}</p>

            <Link
              className="inline-block mt-3 text-blue-600 underline"
              href={`/facilities/${f.id}`}
            >
              View availability →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link className="text-blue-600 underline" href="/bookings">
          View booking history →
        </Link>
      </div>
    </main>
  );
}
