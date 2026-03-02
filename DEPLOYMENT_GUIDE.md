# Campus Booking System - Deployment Guide

## Overview
This guide covers deploying the Campus Booking System (Frontend + Backend + Database) to free/trial cloud services.

---

## Table of Contents
1. [Deployment Architecture](#deployment-architecture)
2. [Option 1: Render.com (Recommended for Free Tier)](#option-1-rendercom-recommended)
3. [Option 2: Railway.app](#option-2-railwayapp)
4. [Option 3: Vercel + Heroku](#option-3-vercel--heroku)
5. [Integration Testing](#integration-testing)
6. [Post-Deployment](#post-deployment)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend (Next.js)                    │
│     Deployed on: Vercel/Render/Railway          │
│     URL: https://your-app.example.com           │
└─────────────────┬───────────────────────────────┘
                  │ API calls (REST)
                  ▼
┌─────────────────────────────────────────────────┐
│       Backend (Express.js + Node.js)            │
│     Deployed on: Render/Railway/Heroku          │
│     URL: https://api.your-app.example.com       │
└─────────────────┬───────────────────────────────┘
                  │ Database queries
                  ▼
┌─────────────────────────────────────────────────┐
│      Database (PostgreSQL)                      │
│   Hosted: Render/Railway/ElephantSQL            │
│   Connection: postgresql://...                  │
└─────────────────────────────────────────────────┘
```

---

## Option 1: Render.com (Recommended)

### Step 1: Prepare the Backend

1. **Create `render.yaml` in backend root:**

```yaml
services:
  - type: web
    name: campus-booking-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        fromDatabase:
          name: campus_booking_db
          property: connectionString
      - key: CORS_ORIGIN
        value: "https://campus-booking-frontend.onrender.com"
  
  - type: pserv
    name: campus_booking_db
    plan: free
    ipAllowList: []
    postgreSQLVersion: "15"
```

2. **Update `package.json` to ensure proper start script:**

```json
{
  "name": "campus-booking-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

3. **Update backend `app.js` to use DATABASE_URL:**

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");

const app = express();

// Use DATABASE_URL if available (Render), otherwise construct from env variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000"
}));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Campus Booking API running ✅" }));

app.use("/facilities", facilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/availability", availabilityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = pool;
```

### Step 2: Create Render Account & Deploy

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - **Name:** campus-booking-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables in the dashboard
7. Click "Deploy"

### Step 3: Deploy Frontend

1. Click "New +" → "Static Site"
2. Select your repository
3. Configure:
   - **Name:** campus-booking-frontend
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - **Environment Variables:** 
     - `NEXT_PUBLIC_API_BASE=https://campus-booking-api.onrender.com`
4. Click "Deploy"

### Step 4: Verify Deployment

- Backend URL: `https://campus-booking-api.onrender.com`
- Frontend URL: `https://campus-booking-frontend.onrender.com`
- Visit the frontend URL and test the API integration

---

## Option 2: Railway.app

### Step 1: Setup Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add database:
   - Click "Add Service" → "PostgreSQL"
   - Database is automatically created and connected

### Step 2: Deploy Backend

1. Click "Add Service" → "GitHub Repo"
2. Select your repository containing the backend
3. Configure environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CORS_ORIGIN=https://your-frontend-url.railway.app`
4. Railway auto-detects Node.js and deploys

### Step 3: Deploy Frontend

1. Create a new Railway project
2. Add a new service from your frontend repo
3. Configure build settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add environment variable:
   - `NEXT_PUBLIC_API_BASE=https://your-backend-url.railway.app`

### Step 4: Database Connection

Railway automatically creates a `DATABASE_URL` environment variable with the PostgreSQL connection string.

---

## Option 3: Vercel + Heroku

### Frontend: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure project root: `campus-booking-frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_BASE=https://your-heroku-backend.herokuapp.com`
5. Deploy

### Backend: Heroku (Free tier retired, use Render or Railway instead)

**Note:** Heroku's free tier has been discontinued. Use Render or Railway for backend hosting.

---

## Integration Testing

### Test 1: Check API Health
```bash
curl https://your-backend-url.onrender.com/
```

Expected response:
```json
{"message": "Campus Booking API running ✅"}
```

### Test 2: Fetch Facilities
```bash
curl https://your-backend-url.onrender.com/facilities
```

### Test 3: Full Frontend Integration
1. Open the deployed frontend URL
2. Verify that facilities load
3. Click on a facility to view availability
4. Create a test booking
5. Check booking history
6. Delete a booking

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] API connections working (check browser console for errors)
- [ ] Database migrations executed
- [ ] Sample data seeded (if needed)
- [ ] CORS configuration correct
- [ ] Environment variables set correctly
- [ ] SSL/HTTPS working
- [ ] Error handling working properly

---

## Environment Variables Reference

### Backend (.env or via dashboard)

```env
# Production environment
NODE_ENV=production
PORT=5000

# Database (Render provides DATABASE_URL automatically)
DATABASE_URL=postgresql://user:password@host:5432/database

# CORS - Match your frontend URL
CORS_ORIGIN=https://campus-booking-frontend.onrender.com

# Logging
LOG_LEVEL=info
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE=https://campus-booking-api.onrender.com
```

---

## Troubleshooting

### Issue: CORS Error
**Solution:** Update `CORS_ORIGIN` environment variable in backend to match frontend URL

### Issue: Database Connection Failed
**Solution:** Verify `DATABASE_URL` is set correctly and database is running

### Issue: 404 Not Found
**Solution:** Check that your deployment URLs are correct and API routes match

### Issue: Build Failures
**Solution:** Check build logs in your service dashboard for specific errors

---

## Cost Breakdown (Free Tier)

| Service | Cost | Limits |
|---------|------|--------|
| Render (Web Service) | Free | 750 hrs/month |
| Render (PostgreSQL) | Free | 100MB storage, 5 connections |
| Vercel (Frontend) | Free | Deploy on push, auto SSL |
| Railway (Starter Plan) | Free | $5/month, good for learning |

---

## Performance Monitoring

After deployment, monitor:
- Response times
- Error rates
- Database query performance
- API usage

Use built-in dashboards in Render/Railway to track metrics.

---

## Next Steps

1. Set up monitoring and logging
2. Configure backups for database
3. Set up CI/CD pipeline for automated deployments
4. Add authentication for API security
5. Implement rate limiting
6. Set up error tracking (Sentry, etc.)

---

## Support Links

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
