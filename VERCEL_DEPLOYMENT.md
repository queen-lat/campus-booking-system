# Campus Booking System - Vercel Deployment Guide

## Overview
This guide covers deploying the Campus Booking System to Vercel (frontend) and Render (backend).

---

## Quick Summary

- **Frontend (Next.js):** Vercel ✅
- **Backend (Express.js):** Render.com (Vercel doesn't support long-running servers)
- **Database:** PostgreSQL on Render

**Why Render for Backend?**
- Vercel is optimized for serverless/Next.js
- Express.js needs persistent connections
- Render provides both backend hosting AND free PostgreSQL database

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Select "Import Git Repository"
3. Search for `queen-lat/campus-booking-system`
4. Click "Import"

### Step 3: Configure Project Settings

1. **Project Name:** `campus-booking-frontend`
2. **Framework Preset:** Next.js (auto-detected)
3. **Root Directory:** Set to `campus-booking-frontend`
4. **Build Command:** `npm run build` (default)
5. **Output Directory:** `.next` (default)

### Step 4: Environment Variables

Add environment variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_BASE` | `https://campus-booking-api.onrender.com` |

*(Replace with your actual backend URL after deploying to Render)*

### Step 5: Deploy

Click "Deploy" button and wait for deployment to complete.

**Your Frontend URL will be:**
```
https://campus-booking-frontend.vercel.app
```

Or a custom domain if configured.

---

## Part 2: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create PostgreSQL Database

1. From Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name:** `campus-booking-db`
   - **Database:** `campus_booking`
   - **User:** `postgres`
   - **Region:** Choose closest to you
   - **Plan:** Free (sufficient for learning)
4. Click "Create Database"
5. Copy the connection string (looks like: `postgresql://...`)

### Step 3: Create Web Service for Backend

1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `campus-booking-api`
   - **Environment:** Node
   - **Region:** Same as database
   - **Build Command:** `cd campus-booking-api/campus-booking-api && npm install`
   - **Start Command:** `cd campus-booking-api/campus-booking-api && npm start`

### Step 4: Add Environment Variables

On the Render dashboard, go to your service's "Environment" tab and add:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste your PostgreSQL connection string>
CORS_ORIGIN=https://campus-booking-frontend.vercel.app
```

### Step 5: Deploy

Click "Create Web Service" and Render will automatically deploy.

**Your Backend URL will be:**
```
https://campus-booking-api.onrender.com
```

### Step 6: Run Database Migrations on Render

1. Go to your Render service
2. Click "Shell" tab
3. Run:
   ```bash
   cd campus-booking-api/campus-booking-api && node migrate.js && npm run seed
   ```

This creates tables and seeds the 4 facilities.

---

## Part 3: Update Frontend with Backend URL

After backend is deployed, update the frontend environment variable:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Edit `NEXT_PUBLIC_API_BASE` to your Render URL:
   ```
   https://campus-booking-api.onrender.com
   ```
5. Save and Vercel will redeploy automatically

---

## Step-by-Step Commands for Git Push

### Prepare Backend for Render

Add a `Procfile` in `campus-booking-api/campus-booking-api/`:

```
web: npm start
```

### Update package.json

Ensure your backend `package.json` has:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "migrate": "node migrate.js",
    "seed": "node seed.js"
  }
}
```

---

## Verification Checklist

After deployment, verify everything works:

### ☐ Frontend
- [ ] Open https://campus-booking-frontend.vercel.app
- [ ] Homepage loads without errors
- [ ] Facilities display correctly
- [ ] No console errors in browser DevTools

### ☐ Backend
- [ ] Test `/facilities` endpoint:
  ```bash
  curl https://campus-booking-api.onrender.com/facilities
  ```
- [ ] Should return 4 facilities as JSON

### ☐ Full Integration
- [ ] Click on a facility on the frontend
- [ ] Availability loads (check Network tab)
- [ ] Create a test booking
- [ ] Booking appears in history
- [ ] Delete booking works

---

## Testing API Endpoints

### Test 1: Get Facilities
```bash
curl https://campus-booking-api.onrender.com/facilities
```

### Test 2: Get Availability
```bash
curl "https://campus-booking-api.onrender.com/availability?facility_id=1&date=2026-03-10"
```

### Test 3: Create Booking
```bash
curl -X POST https://campus-booking-api.onrender.com/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "facility_id": 1,
    "user_id": "user123",
    "user_name": "Test User",
    "date": "2026-03-10",
    "start_time": "09:00",
    "end_time": "09:30"
  }'
```

---

## Troubleshooting

### Issue: "Cannot GET /facilities"
**Solution:** Backend service hasn't started yet. Wait 2-3 minutes for Render cold start.

### Issue: CORS Error
**Solution:** Verify `CORS_ORIGIN` in backend environment variables matches your Vercel frontend URL.

### Issue: Database Connection Failed
**Solution:** Check `DATABASE_URL` is correctly set and PostgreSQL service is running on Render.

### Issue: 502 Bad Gateway
**Solution:** Backend crashed. Check Render logs for errors.

---

## Public URLs Example

Once deployed, you'll have:

**Frontend:**
```
https://campus-booking-frontend.vercel.app
```

**Backend API:**
```
https://campus-booking-api.onrender.com
```

**API Endpoints:**
```
https://campus-booking-api.onrender.com/facilities
https://campus-booking-api.onrender.com/bookings
https://campus-booking-api.onrender.com/availability?facility_id=1&date=2026-03-10
```

---

## Monitoring & Logs

### Vercel Logs
- Go to project → "Deployments" tab
- Click on deployment to see build/runtime logs

### Render Logs
- Go to service → "Logs" tab
- View real-time server output

---

## Cost

- **Vercel Frontend:** Free ✅
- **Render Backend:** Free (up to 750 hours/month) ✅
- **PostgreSQL Database:** Free (100MB) ✅

---

## Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Share public URL with stakeholders
3. ✅ Add custom domain (optional)
4. ✅ Set up monitoring (optional)
5. ✅ Add authentication (future enhancement)

---

## Support Links

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://docs.render.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
