# Crowdsourced Civic Issue Reporting & Resolution System

A MERN stack-based civic utility platform designed to bridge the trust gap between citizens and municipal authorities. Citizens can report civic issues (potholes, garbage accumulation, drainage failures) with geo-tagged images, which are automatically categorized, de-duplicated using geo-clustering, prioritized, and verified by the reporting community.

---

## 🚀 Key Features

*   **Photo & GPS-tagged Reporting:** Report civic issues easily by taking a photo and automatically extracting or attaching GPS location.
*   **AI classification:** Automatic classification of issues (Potholes, Garbage, Drainage) using computer vision with confidence-score routing.
*   **Duplicate Detection (Deduplication):** Prevents duplicate entries using geo-clustering and text/image similarity, merging close-proximity complaints and increasing recurrence weight.
*   **Priority Scoring:** Algorithmic ranking of reports based on severity and recurrence count, surfacing high-priority issues to municipal dashboards.
*   **Trust Verification Layer:** Issues marked "Resolved" by workers go to a **Pending Confirmation** state. The community and the original reporter verify the resolution before the ticket officially closes.
*   **Admin Dashboard:** Dedicated workspace for municipal staff to assign tasks, visualize duplicate clusters, and manage disputes.
*   **Field Worker Portal:** Interface for field workers to claim tasks, view exact coordinates, and upload photo evidence of completed resolutions.

---

## 📁 Project Structure

```text
Civic Reporting System/
├── client/                     # Frontend client (Vite + React)
│   ├── public/
│   ├── src/
│   └── package.json
├── server/                     # Backend server (Node + Express + Mongoose)
│   ├── public/
│   │   └── uploads/            # Temporary storage for uploaded photos
│   ├── src/
│   │   ├── config/             # DB & Cloudinary configuration
│   │   ├── controllers/        # Request handling and business logic
│   │   ├── middlewares/        # Authentication, Multer file upload, error handling
│   │   ├── models/             # Mongoose schemas (User, Report)
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # AI CV models and geo-clustering algorithms
│   │   ├── utils/              # Priority rank calculators and helper functions
│   │   └── app.js              # Server entry point
│   ├── .env.example            # Environment template config
│   ├── .gitignore              # Git ignore rules for node_modules/env
│   └── package.json
├── PRD.md                      # Product Requirements Document
└── README.md                   # This document
```

---

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), CSS (Vanilla Custom CSS)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Media Storage:** Cloudinary (for image uploads)
*   **AI Classifications:** CV/ML Service (Stub/API)
*   **Geo Calculations:** MongoDB GeoJSON / Geospatial Queries

---

## 💻 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas Instance)

### Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 👥 Authors

*   **Team:** Nyx Coders
*   **College:** Vivekanand Education Society's Arts, Science and Commerce College, Chembur, Mumbai
