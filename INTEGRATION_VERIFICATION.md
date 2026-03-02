# Integration Verification Checklist

## Overview
This document verifies that frontend, backend, and database are properly integrated and working together.

---

## 1. Database Integration

### Checklist:
- [ ] PostgreSQL database is running
- [ ] Database credentials are correct in `.env`
- [ ] Tables are created (users, facilities, bookings)
- [ ] Sample data is seeded (at least one facility)
- [ ] Database connection pool is configured

### Verification Steps:

1. **Check database connection:**
   ```bash
   cd campus-booking-api/campus-booking-api
   psql -h localhost -U postgres -d campus_booking -c "SELECT * FROM facilities;"
   ```

2. **Verify migrations:**
   ```bash
   psql -h localhost -U postgres -d campus_booking -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
   ```

3. **Check sample data:**
   ```bash
   psql -h localhost -U postgres -d campus_booking -c "SELECT id, name, capacity FROM facilities;"
   ```

---

## 2. Backend API Integration

### Checklist:
- [ ] Backend server starts successfully
- [ ] Express server listening on configured PORT
- [ ] CORS is enabled
- [ ] Routes are registered correctly
- [ ] Database pool is connected

### Verification Steps:

1. **Start backend:**
   ```bash
   cd campus-booking-api/campus-booking-api
   npm install
   npm run dev
   ```
   Expected output: `Server running on http://localhost:5000`

2. **Test health endpoint:**
   ```bash
   curl http://localhost:5000/
   ```
   Expected response: `{"message":"Campus Booking API running ✅"}`

3. **Test facilities endpoint:**
   ```bash
   curl http://localhost:5000/facilities
   ```
   Expected response: Array of facility objects

4. **Check server logs:**
   - Look for any database connection errors
   - Verify no port conflicts
   - Check CORS configuration

---

## 3. Frontend Integration

### Checklist:
- [ ] Frontend builds successfully
- [ ] Next.js dev server starts
- [ ] NEXT_PUBLIC_API_BASE is set correctly
- [ ] API client is configured properly
- [ ] Frontend can reach backend

### Verification Steps:

1. **Setup frontend `.env.local`:**
   ```bash
   cd campus-booking-frontend
   echo "NEXT_PUBLIC_API_BASE=http://localhost:5000" > .env.local
   ```

2. **Start frontend:**
   ```bash
   npm install
   npm run dev
   ```
   Expected output: Frontend available at `http://localhost:3000`

3. **Check API base URL:**
   ```javascript
   // In browser console:
   console.log(process.env.NEXT_PUBLIC_API_BASE)
   // Should output: http://localhost:5000
   ```

4. **Verify API calls:**
   - Open DevTools → Network tab
   - Navigate to the homepage
   - Check that requests are going to `http://localhost:5000/facilities`

---

## 4. Frontend-Backend Communication

### Checklist:
- [ ] Facilities load on homepage
- [ ] Facility cards display correctly
- [ ] Can click on facility to view availability
- [ ] Availability API returns time slots
- [ ] Can create a booking
- [ ] Booking appears in history
- [ ] Can delete a booking

### Verification Steps:

**Test 1: Load Facilities**
1. Open https://localhost:3000
2. Homepage should display available facilities
3. Check browser console for errors
4. Network tab should show request to `/facilities` returning 200 OK

**Test 2: View Availability**
1. Click on a facility
2. Select a date
3. Time slots should load
4. Network tab should show request to `/availability?facility_id=X&date=YYYY-MM-DD`

**Test 3: Create Booking**
1. Select a time slot
2. Enter user details
3. Click "Book"
4. Network tab should show POST to `/bookings` returning 201 Created
5. Booking should appear in history without page refresh

**Test 4: View Bookings**
1. Navigate to "My Bookings" page
2. Bookings should display in a table
3. Should see correct date, time, and status

**Test 5: Delete Booking**
1. Click delete button on a booking
2. Confirm deletion
3. Booking should be removed from list
4. Network tab should show DELETE to `/bookings/:id` returning 200 OK

---

## 5. Cross-Browser Testing

### Checklist:
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Responsive on mobile (check with DevTools)

---

## 6. Error Handling

### Checklist:
- [ ] Invalid date shows error message
- [ ] Conflicting booking shows error message
- [ ] Missing fields show validation error
- [ ] Database error shows user-friendly message
- [ ] Network error handled gracefully

### Verification Steps:

1. **Test invalid booking:**
   ```bash
   curl -X POST http://localhost:5000/bookings \
     -H "Content-Type: application/json" \
     -d '{"facility_id": 999}'
   ```
   Expected: 400 Bad Request with error message

2. **Test conflicting slot:**
   - Create a booking for a time slot
   - Try to book same slot again
   - Should show conflict error

3. **Test database disconnect:**
   - Stop database server
   - Try to load facilities
   - Should show error message in UI

---

## 7. Performance Verification

### Checklist:
- [ ] Homepage loads in < 2 seconds
- [ ] Facility details load in < 1 second
- [ ] Bookings page loads in < 1 second
- [ ] Availability API responds in < 500ms
- [ ] No console warnings or errors

### Verification Steps:

1. **Check Network Performance:**
   - Open DevTools → Performance tab
   - Record loading the homepage
   - Total load time should be < 2 seconds

2. **API Response Times:**
   - Open DevTools → Network tab
   - Check response time for each API call
   - Should be < 500ms per request

3. **Console Errors:**
   - Open DevTools → Console
   - Navigate through all pages
   - Should see no errors or warnings

---

## 8. Data Consistency

### Checklist:
- [ ] Booking data consistent across refreshes
- [ ] Availability updates when booking is made
- [ ] Deleted bookings don't reappear
- [ ] User data persists correctly

### Verification Steps:

1. **Test data persistence:**
   - Create a booking
   - Refresh the page
   - Booking should still be visible

2. **Test availability updates:**
   - Check availability for a time slot (should be available)
   - Create a booking for that slot
   - Check availability again (should be booked)

3. **Test delete persistence:**
   - Delete a booking
   - Refresh page
   - Booking should not reappear

---

## 9. Integration Summary Table

| Component | Status | Verification URL | Expected Result |
|-----------|--------|------------------|-----------------|
| Database | ✓/✗ | `localhost:5432` | Connection successful |
| Backend API | ✓/✗ | `http://localhost:5000` | Health check: 200 OK |
| Frontend | ✓/✗ | `http://localhost:3000` | Page loads, no errors |
| API Integration | ✓/✗ | `http://localhost:3000/facilities` | Facilities displayed |
| Booking Flow | ✓/✗ | Create booking | Booking in history |

---

## 10. Troubleshooting

### Issue: "Cannot GET /"
**Solution:** Backend not running or wrong port configured

### Issue: CORS errors in console
**Solution:** Check CORS_ORIGIN in `.env` matches frontend URL

### Issue: "Database connection failed"
**Solution:** Verify PostgreSQL is running, credentials are correct, database exists

### Issue: Facilities not loading
**Solution:** Check `/facilities` endpoint returns data, database has facilities

### Issue: API calls to wrong URL
**Solution:** Verify `NEXT_PUBLIC_API_BASE` is set in `.env.local`

### Issue: Booking shows but then disappears
**Solution:** Check localStorage in DevTools, verify backend database is persisting

---

## Sign-Off

- [ ] All checksums passed
- [ ] Integration verified end-to-end
- [ ] Ready for deployment
- [ ] Documentation complete

**Date Verified:** _______________
**Verified By:** _______________
