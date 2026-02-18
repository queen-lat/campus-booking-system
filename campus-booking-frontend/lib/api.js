const BASE = process.env.NEXT_PUBLIC_API_BASE;

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export const API = {
  getFacilities: () => apiFetch("/facilities"),
  getFacility: (id) => apiFetch(`/facilities/${id}`),
  getBookings: () => apiFetch("/bookings"),
  createBooking: (payload) =>
    apiFetch("/bookings", { method: "POST", body: JSON.stringify(payload) }),
  cancelBooking: (id) => apiFetch(`/bookings/${id}`, { method: "DELETE" }),
  getAvailability: (facilityId, date) =>
    apiFetch(`/availability?facility_id=${facilityId}&date=${date}`),
};
