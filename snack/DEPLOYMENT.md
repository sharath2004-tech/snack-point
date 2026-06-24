# Deployment Guide: Vercel + Render

## 🚀 Frontend Deployment (Vercel)

### Step 1: Connect to GitHub
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Select your GitHub repository `snack-point`
4. Click "Import"

### Step 2: Configure Environment
1. In the "Environment Variables" section, add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-render-backend.onrender.com/api` (update after backend is deployed)
2. Click "Deploy"

### Step 3: Custom Domain (Optional)
- In Vercel dashboard, go to Settings → Domains
- Add your custom domain or use the default `.vercel.app`

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend
1. Ensure `server/.env.example` is in the repo (already done)
2. The `package.json` has `engines: { "node": ">=18.0.0" }` (already set)

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Select "Deploy an existing repository from GitHub"
4. Choose your `snack-point` repo and click "Connect"

### Step 3: Configure Service
Fill in the following:
- **Name:** `snack-point-api` (or any name)
- **Environment:** `Node`
- **Region:** Choose nearest to you
- **Branch:** `main`
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`
- **Plan:** Free or Starter (depending on needs)

### Step 4: Add Environment Variables
In the "Environment" section, click "Add Environment Variable" for each:
```
PORT=5000
MONGO_URI=mongodb+srv://2004sharath:LCjk7u6ZQYcuPHJl@cluster0.15o2inv.mongodb.net/snackpoint?retryWrites=true&w=majority
JWT_SECRET=snackpoint_super_secret_jwt_key_2024_change_in_production
NODE_ENV=production
CLIENT_URL=https://your-vercel-domain.vercel.app
SERVER_URL=https://your-render-backend.onrender.com
```

### Step 5: Deploy
Click "Create Web Service" and wait for the deployment to complete.

---

## 🔗 Connect Frontend & Backend

After backend is deployed on Render:

1. Copy your Render backend URL (e.g., `https://snack-point-api.onrender.com`)
2. Go to Vercel dashboard → Project Settings → Environment Variables
3. Update `VITE_API_URL` to your Render URL + `/api`
4. Redeploy on Vercel (Vercel will auto-redeploy when you update env vars)

---

## 📝 Important Notes

- **MongoDB Atlas:** Your `MONGO_URI` is already configured in the code
- **Uploads:** Images uploaded on production will be stored in Render's ephemeral storage (lost on redeploy). For persistence, consider adding AWS S3
- **CORS:** Backend is configured to accept requests from your Vercel frontend
- **Free tier:** Both Vercel and Render free tiers have limitations (auto-sleep on inactivity)

---

## 🧪 Test Deployment

After both are live:
1. Visit your Vercel frontend URL
2. Try logging in (test account: `admin@snackpoint.com` / `admin123`)
3. Try uploading an image from Admin → Menu tab
4. Check if images load correctly

---

## 🆘 Troubleshooting

**CORS errors?**
- Check `CLIENT_URL` in server `.env` matches your Vercel domain

**API calls fail?**
- Check `VITE_API_URL` in Vercel env vars points to your Render backend
- Verify Render backend is running (check logs)

**Images not loading?**
- Check `SERVER_URL` in Render `.env` is set to your Render domain
- Verify `/uploads` directory exists and is writable

