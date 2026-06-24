# 🍔 Snack Point — 3D Food Ordering Platform

A modern, Awwwards-inspired 3D food ordering website with React, Three.js, Node.js & MongoDB.

## Quick Start

### 1. Backend
```bash
cd server && npm install
# Edit server/.env with your MONGO_URI
node seed.js       # Seed demo data
npm run dev        # Start on :5000
```

### 2. Frontend
```bash
# From project root
npm install
npm run dev        # Start on :5173
```

## Demo Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@snackpoint.com | admin123 |
| Cook | cook@snackpoint.com | cook123 |
| Customer | customer@snackpoint.com | customer123 |

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4
- **3D**: Three.js, React Three Fiber, Drei, Post-processing (Bloom)
- **Animation**: GSAP (ScrollTrigger), Framer Motion
- **Charts**: Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT + bcryptjs

## Features
- 🍔 3D floating burger hero with bloom & sparkles
- 🛒 Cart → Token → Track → Collect order flow
- 👨‍🍳 Cook dashboard with real-time order management
- 📊 Admin dashboard with revenue charts & user management
- 📱 Fully responsive mobile design

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
