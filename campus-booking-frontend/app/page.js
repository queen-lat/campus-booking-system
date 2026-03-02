import Link from "next/link";
import { API } from "../lib/api";

export default async function HomePage() {
  const facilities = await API.getFacilities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Navigation */}
      <nav className="border-b border-pink-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-600 to-pink-700">
                <span className="text-lg font-bold text-white">📍</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Campus Booking</h1>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Link href="/facilities" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                Facilities
              </Link>
              <Link href="/bookings" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold tracking-tight mb-6">
              Book Campus Facilities
            </h2>
            <p className="text-xl text-pink-100">
              Reserve study rooms, conference halls, sports facilities, and more. Easy scheduling with real-time availability.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Section Header */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-2">Available Facilities</h3>
          <p className="text-base text-slate-600">
            Browse and select from our campus facilities. Click on any facility to view availability and make a booking.
          </p>
        </div>

        {/* Facilities Grid */}
        {facilities && facilities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <Link key={f.id} href={`/facilities/${f.id}`}>
                <div className="group h-full rounded-xl border border-pink-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-pink-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 group-hover:text-pink-600 transition">
                        {f.name}
                      </h4>
                    </div>
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                      ✓ Available
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {f.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>📍</span>
                        <span>{f.location}</span>
                      </div>
                    )}
                    {typeof f.capacity !== "undefined" && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>👥</span>
                        <span>Capacity: {f.capacity} people</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                    <span className="text-xs font-medium text-pink-600 group-hover:text-pink-700">
                      View & Book →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-pink-200 bg-white p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-lg font-semibold text-slate-900 mb-2">No Facilities Available</p>
            <p className="text-sm text-slate-600">
              Please check back later or contact support for more information.
            </p>
          </div>
        )}
      </main>

      {/* Stats Section */}
      <section className="bg-white border-t border-pink-200">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{facilities?.length || 0}</div>
              <p className="text-slate-600">Available Facilities</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
              <p className="text-slate-600">Access Available</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">30min</div>
              <p className="text-slate-600">Booking Slots</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-200 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Campus Booking</h4>
              <p className="text-sm text-slate-400">
                Professional facility booking system for campus communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/facilities" className="hover:text-white transition">Facilities</Link></li>
                <li><Link href="/bookings" className="hover:text-white transition">My Bookings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Campus Booking System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}