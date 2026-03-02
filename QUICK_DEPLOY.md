# Quick Start: Deploy to Vercel + Render

## 2-Minute Quick Setup

### Frontend to Vercel (2 minutes)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `queen-lat/campus-booking-system`
4. **Root Directory:** `campus-booking-frontend`
5. **Environment Variable:**
   - Key: `NEXT_PUBLIC_API_BASE`
   - Value: `https://campus-booking-api.onrender.com` (you'll update this after backend deploys)
6. Click "Deploy"

**Your Frontend URL:** `https://[your-project].vercel.app`

---

### Backend to Render (5 minutes)

1. Go to https://render.com
2. **Step 1: Create Database**
   - Click "New" → "PostgreSQL"
   - Name: `campus-booking-db`
   - Copy the connection string

3. **Step 2: Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - **Build Command:** `cd campus-booking-api/campus-booking-api && npm install`
   - **Start Command:** `cd campus-booking-api/campus-booking-api && npm start`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[paste PostgreSQL connection string]
   CORS_ORIGIN=[your Vercel frontend URL]
   ```

5. **Deploy** and wait for green status

6. **Run Setup Commands** (in Render Shell):
   ```bash
   cd campus-booking-api/campus-booking-api
   node migrate.js
   npm run seed
   ```

**Your Backend URL:** `https://campus-booking-api.onrender.com`

---

### Update Frontend with Backend URL

1. Go to Vercel project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_BASE` to your Render URL
3. Vercel redeploys automatically

---

## Final URLs

- **Frontend:** https://campus-booking-frontend.vercel.app
- **Backend API:** https://campus-booking-api.onrender.com
- **API Test:** https://campus-booking-api.onrender.com/facilities

---

## Test It Works

1. Open your frontend URL
2. See 4 facilities displayed
3. Click a facility → view availability
4. Create a booking
5. Check booking history

✅ Done!
