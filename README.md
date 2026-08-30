# 🏛️ CivicLink — Crowdsourced Civic Issue Reporting & Resolution System

A modern, full-stack **MERN** civic governance platform designed to eliminate the trust and communication gap between citizens, municipal authorities, and on-ground maintenance crews. Citizens report infrastructure hazards (potholes, garbage accumulation, streetlight blackouts, drainage overflow, water pipe bursts) with geo-tagged photos. Reports are categorized via **Groq Vision AI**, deduplicated within 75-meter hotspots using **Turf.js geospatial clustering**, dispatched through a **Smart Priority Queue System**, and verified by local residents through an on-site **Community Resolution Confirmation & Dispute Layer**.

---

## 🌟 Core System Portals

The platform is split into 3 role-based interfaces with synchronized real-time data:

### 1. 👤 Citizen Action & Verification Portal (`/` & `/track`)
- 📸 **Geo-Tagged Report Submission:** Multipart image uploads with Leaflet GPS location picker (Default Street & Satellite modes).
- 🎉 **Celebratory Report Done Modal:** Instant receipt card with monospace Ticket ID (`#CR-2026-XXXX`), 1-click copy, and 3-step resolution roadmap.
- 🎯 **"My Filed Reports" Tracker:** Citizens automatically see and track only their own reported issues by default with scope toggle to view citywide issues.
- ⏱️ **Estimated SLA Time Badges:** Live resolution timeline estimates (*e.g., 4–8h Emergency SLA, 24–48h Standard Pothole SLA*).
- 🗳️ **Community Resolution Verification:** When crews finish work, citizens inspect **Before & After photos** and vote to **Confirm Fix** or **Dispute Inadequate Work** (with proof photo attachment).

### 2. 🛠️ Dedicated Field Crew Worker Portal (`/worker`)
- 🔐 **Worker Security Gate:** Restricted exclusively to field crew accounts (`worker@gmail.com` / `worker123`).
- 📋 **Work Order Queue:** Filter jobs by *Assigned*, *In Progress (On-Site)*, *Pending Citizen Verification*, and *Completed*.
- ▶️ **Start Work Action:** One-click transition to `in_progress` with timestamped technician arrival log.
- 📸 **Resolution Evidence Submission Modal:** Upload up to 3 after-fix photos directly to Cloudinary CDN with work description and materials used.

### 3. 👑 Municipal Admin Operations Portal (`/admin`)
- 🎨 **Clean White Sidebar Layout:** Modern, clutter-free municipal workspace without hero banners.
- 🗺️ **Geospatial Incident & Crew Tracking Map:** Interactive Leaflet map with category-specific pins (🚗 Potholes, 💧 Drainage, 🗑️ Garbage, 💡 Streetlights, 🚰 Water), 75m geo-radius cluster circles, and live crew dispatch status badges.
- ⚡ **Smart Priority Auto-Dispatch Queue:** 
  - **Category-to-Ward Matching:** Auto-routes complaints to specialized units (e.g. *Ward 1 Road Crew, Ward 4 Drainage Unit*).
  - **Workload Load Balancing:** Dispatches to least-loaded active field technicians.
  - **1-Click Batch Auto-Dispatch:** Dispatches all unassigned issues in the queue simultaneously.
  - **Manual Override:** Admin can manually dispatch custom teams or adjust priority anytime.
- 👥 **Ward Crew Deployment Tracker:** Real-time monitoring of 8+ municipal wards, supervisors, and active repair loads.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Custom Modern Emerald & Slate Design Tokens
- **Interactive Maps:** Leaflet.js + React-Leaflet (Street View & Satellite Aerial modes)
- **Animation & Transitions:** Framer Motion
- **Routing:** React Router v7
- **Icons:** Lucide React
- **HTTP Client:** Axios (with Bearer JWT interceptors)
- **Real-Time Client:** Socket.IO Client

### Backend (Server)
- **Runtime:** Node.js (ES Modules) + Express.js
- **Database:** MongoDB Atlas + Mongoose ODM (GeoJSON `2dsphere` spatial indexing)
- **AI Vision Engine:** Groq Cloud SDK (`llama-3.3-70b-versatile`, `llama-3.2-11b-vision-preview`)
- **Geospatial Processing:** `@turf/turf` + MongoDB `$near` geospatial clustering
- **Smart Queue Dispatcher:** Custom Priority Queue Service with Workload Balancing
- **Media CDN:** Multer + Cloudinary (with fallback handling)
- **Real-Time Engine:** Socket.IO (room-based status broadcasts)
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt password hashing
- **Security:** Helmet, Express Rate Limit, CORS

---

## 📁 Folder Structure

```text
Civic Reporting System/
├── client/                                 # Frontend Application
│   ├── src/
│   │   ├── api/                            # Axios API layer (authApi, issueApi)
│   │   ├── components/
│   │   │   ├── admin/                      # Admin Sidebar, Heatmap, StatsGrid, StatusModal
│   │   │   ├── worker/                     # WorkerEvidenceModal, Work Order Cards
│   │   │   ├── tracking/                   # CommunityVerificationSection (Vote & Dispute)
│   │   │   ├── reporting/                  # ReportSuccessModal (Done celebration receipt)
│   │   │   ├── auth/                       # AuthModal (RBAC Login & Signup)
│   │   │   ├── layout/                     # Citizen Navbar, Footer, ScrollToTop
│   │   │   └── ui/                         # LocationPickerMap (Leaflet GPS selector)
│   │   ├── context/                        # AuthContext (global state & authentication)
│   │   ├── pages/                          # HomePage, ReportIssuePage, TrackIssuePage,
│   │   │                                   # AdminPage, WorkerPage, DashboardPage, About, Contact
│   │   ├── services/                       # SocketService.js (Real-time Socket.IO events)
│   │   └── App.jsx                         # Main Router & Role Route Protection
│   └── package.json
├── server/                                 # Backend Server Application
│   ├── src/
│   │   ├── config/                         # DB, Cloudinary & ENV configurations
│   │   ├── controllers/                    # authController, issueController, verificationController
│   │   ├── middlewares/                    # auth, upload (Multer), rateLimit, validate
│   │   ├── models/                         # User, Issue, ConfirmationVote schemas
│   │   ├── routes/                         # authRoutes, issueRoutes, verificationRoutes
│   │   ├── services/                       # aiService, geoClusterService, priorityService,
│   │   │                                   # queueDispatchService, notificationService
│   │   ├── sockets/                        # Socket.IO event emitters & room handlers
│   │   ├── seed.js                         # Database bootstrap seeder
│   │   └── server.js                       # Express server bootstrap & Socket.IO initialization
│   ├── .env                                # Backend environment configuration
│   └── package.json
├── UNIMPLEMENTED_FRONTEND_FEATURES.md      # Specification checklist
├── backend.md                              # Backend API architecture document
└── README.md                               # Project documentation
```

---

## 🔑 Demo Access Credentials

The system auto-bootstraps demo accounts on startup. You can log in using:

| Role | Portal URL | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Chief Admin** | `/admin` | `admin@gmail.com` | `admin123` | Full municipal controls, Auto-Dispatch Queue, Heatmap, SLA Analytics |
| 👷 **Field Worker** | `/worker` | `worker@gmail.com` | `worker123` | View assigned jobs, start repair, upload after-fix proof photos & notes |
| 👤 **Citizen** | `/` or `/track` | `citizen@gmail.com` | `citizen123` | File geo-tagged reports, track tickets, confirm/dispute resolutions |

---

## ⚡ Installation & Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)

---

### 2. Backend Setup
1. Open a terminal and navigate to `server/`:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Configure `server/.env`:
   ```env
   PORT=5001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/civic_reporting_db
   JWT_SECRET=civic_reporting_secret_jwt_key_2026
   CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server starts on port `5001` with REST endpoints at `http://localhost:5001/api` and Socket.IO at `http://localhost:5001`.*

---

### 3. Frontend Setup
1. Open a second terminal and navigate to `client/`:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Configure `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_SOCKET_URL=http://localhost:5001
   ```
4. Start Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit: `http://localhost:5173`

---

## 📡 REST API Specifications

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new citizen, worker, or admin account |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive signed JWT |
| `GET` | `/api/auth/me` | Private | Fetch authenticated user profile |

### Civic Issue Routes (`/api/issues`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/issues` | Public / Optional Auth | Submit new report with photo (Multer) and GPS coordinates |
| `GET` | `/api/issues` | Public | Fetch issues with filtering by status, category, ward, and search query |
| `GET` | `/api/issues/:id` | Public | Fetch detailed issue timeline, audit logs, and coordinates |
| `PATCH`| `/api/issues/:id/status` | Private (Admin / Worker) | Update status milestone with official dispatch log |
| `PATCH`| `/api/issues/:id/assign` | Private (Admin) | Assign repair crew or field technician to an issue |
| `POST` | `/api/issues/:id/auto-dispatch` | Private (Admin) | Auto-dispatch single issue via Smart Priority Queue engine |
| `POST` | `/api/issues/queue/batch-dispatch` | Private (Admin) | Batch auto-dispatch all unassigned issues in the queue |
| `GET` | `/api/issues/stats/overview` | Public | Fetch municipal KPI dashboard metrics and ward breakdowns |

### Community Verification & Evidence Routes (`/api/verification`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/verification/:id/submit-evidence` | Private (Worker / Admin) | Upload resolution proof photos & work notes |
| `POST` | `/api/verification/:id/vote` | Public / Citizen | Submit community confirmation vote (`confirm` or `dispute`) |
| `GET` | `/api/verification/:id/votes` | Public | Get live confirms vs disputes tally and citizen comments |

---

## 🔄 Lifecycle of a Civic Complaint

```
[1. Citizen Reports Issue] ──► [2. AI Vision & 75m Deduplication] ──► [3. Smart Priority Queue Auto-Dispatch]
          │                                                                     │
          ▼                                                                     ▼
[Done Celebration Modal]                                              [4. Field Crew Arrives On-Site]
          │                                                                     │
          ▼                                                                     ▼
[5. Real-Time Tracking (/track)] ◄── [7. Citizen Confirmation Vote] ◄── [6. Fix Evidence Photo Upload]
```

---

## 👥 Authors & Credits

- **Project:** Crowdsourced Civic Issue Reporting & Resolution System (PS26-057)
- **Team:** Nyx Coders
- **Institution:** Vivekanand Education Society's Arts, Science and Commerce College, Chembur, Mumbai
