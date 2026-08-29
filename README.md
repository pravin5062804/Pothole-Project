# 🏛️ CivicLink — Crowdsourced Civic Issue Reporting & Resolution System

A full-stack **MERN** civic utility platform designed to bridge the trust gap between citizens and municipal authorities. Citizens can report civic issues (potholes, garbage accumulation, streetlight failures, drainage blocks) with geo-tagged photos, which are automatically categorized via **Groq Vision AI**, de-duplicated using **geo-clustering (Turf.js)**, algorithmically prioritized, and verified by the reporting community through a decentralized resolution confirmation workflow.

---

## 🚀 Key Features

* 📸 **Photo & GPS-Tagged Reporting:** Citizens can capture and submit geo-located reports with multipart image uploads.
* 🤖 **AI Vision Classification:** Automated issue categorization with confidence scoring powered by Groq Vision models. Low confidence reports are automatically routed for manual review.
* 📍 **Geospatial Deduplication (75m Radius):** Geo-clustering with Turf.js identifies nearby duplicate complaints, auto-merging them and boosting their recurrence count.
* ⚡ **Dynamic Priority Algorithm:** Issues are scored dynamically based on severity weight, citizen recurrence merges, and aging factors.
* 🤝 **Community Trust & Verification Layer:** When an issue is resolved by a field worker, it enters `pending_confirmation`. Citizens vote (`confirm` / `dispute`) to ensure work was actually completed before the ticket closes.
* 🔐 **Interactive Auth Modal & RBAC:** Full-featured popup modal for Login & Signup supporting **Admin**, **Field Worker**, and **Citizen** roles with JWT authentication.
* 📡 **Real-Time Live Updates:** Socket.IO integration broadcasts live issue status changes, newly reported tickets, and community votes.
* 📊 **Executive Analytics Dashboard:** Municipal metrics tracking total reports, resolution rate, active citizens, and category distribution.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React 19 + Vite
* **Styling:** Vanilla CSS + Tailwind CSS v4
* **Routing:** React Router v7
* **Icons:** Lucide React
* **HTTP Client:** Axios (with Bearer JWT interceptors)
* **Real-Time:** Socket.IO Client

### Backend (Server)
* **Runtime:** Node.js (ES Modules) + Express.js
* **Database:** MongoDB Atlas + Mongoose ODM (GeoJSON `2dsphere` spatial indexing)
* **AI & Vision:** Groq Cloud SDK (`llama-3.3-70b-versatile`, `llama-3.2-11b-vision-preview`)
* **Geo-Calculations:** `@turf/turf` + MongoDB `$near` geospatial clustering
* **Media Uploads:** Multer + Cloudinary (with dev base64 fallback)
* **Authentication:** JSON Web Tokens (JWT) + Bcrypt password hashing
* **Security & Rate Limiting:** Helmet, Express Rate Limit, CORS

---

## 📁 Project Structure

```text
Civic Reporting System/
├── client/                     # Frontend Client (Vite + React)
│   ├── src/
│   │   ├── api/                # Axios API handlers (authApi, issueApi)
│   │   ├── components/         # Modular UI, AuthModal, Layout, Home
│   │   ├── context/            # AuthContext (global state & modal controls)
│   │   ├── pages/              # Report, Track, Dashboard, About, Contact
│   │   └── App.jsx             # Main Router & Modal Provider
│   └── package.json
├── server/                     # Backend Server (Node + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # DB, Cloudinary & ENV configs
│   │   ├── controllers/        # Auth, Issue, Verification controllers
│   │   ├── middlewares/        # JWT Auth, Multer, Rate Limiting, Validation
│   │   ├── models/             # User, Issue, ConfirmationVote schemas
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # AI Vision, Geo Deduplication, Priority Rank
│   │   ├── sockets/            # Socket.IO handlers
│   │   ├── seed.js             # MongoDB data seeder
│   │   └── server.js           # Server & Socket.IO bootstrap
│   ├── .env                    # Server environment variables
│   └── package.json
├── backend.md                  # Detailed backend architectural documentation
└── README.md                   # Project overview and setup guide
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

---

### 2. Backend Setup
1. Navigate to the server folder:
   ```powershell
   cd server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure `.env` (refer to `.env.example`):
   ```env
   PORT=5001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/civic_reporting_db
   JWT_SECRET=civic_reporting_secret_jwt_key_2026
   CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
   ```
4. Seed the database with realistic demo issues and accounts:
   ```powershell
   npm run seed
   ```
5. Start the backend server in development mode:
   ```powershell
   npm run dev
   ```

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```powershell
   cd client
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_SOCKET_URL=http://localhost:5001
   ```
4. Start Vite development server:
   ```powershell
   npm run dev
   ```
5. Open your browser at: `http://localhost:5173`

---

## 🔑 Demo Credentials

Use the **1-Click Quick Demo Login** inside the Login modal or log in with:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@gmail.com` | `admin123` | Assign tasks, view stats, manage disputes |
| 👷 **Field Worker** | `worker@gmail.com` | `worker123` | Update status, upload resolution proof photos |
| 👤 **Citizen** | `aarav.citizen@example.com` | `password123` | Report issues, track tickets, confirm resolutions |

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new citizen, worker, or admin |
| `POST` | `/api/auth/login` | Login and receive signed JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/issues` | Query civic issues with filters (category, ward, status) |
| `POST` | `/api/issues` | Submit new report with photo & GPS |
| `GET` | `/api/issues/:id` | Get issue details with timeline and duplicate merge log |
| `PATCH`| `/api/issues/:id/status` | Update issue status (Worker/Admin) with evidence |
| `POST` | `/api/verification/:id/vote` | Submit citizen community confirmation vote |
| `GET` | `/api/issues/stats/overview` | Dashboard analytics and statistics |

*(For full backend specifications, see [`backend.md`](file:///d:/PC-Data/MERN/.Projects/Civic%20Reporting%20System/backend.md))*

---

## 👥 Authors

* **Team:** Nyx Coders
* **College:** Vivekanand Education Society's Arts, Science and Commerce College, Chembur, Mumbai
