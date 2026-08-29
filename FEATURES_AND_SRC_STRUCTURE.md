# Technical Spec: Features & Source Structure
## Crowdsourced Civic Issue Reporting & Resolution System (PS26-057)

This document is meant to be dropped in as a context/spec file for an AI coding
agent (e.g. Antigravity) building this project. It covers the tech stack, the
feature list broken into buildable units, and a proposed source tree.

---

## 1. Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, React Router, Axios, Tailwind CSS |
| Core Backend | Node.js, Express.js, MongoDB Atlas, Mongoose |
| Auth & Security | JWT, bcrypt.js, Helmet, CORS, express-rate-limit |
| Issue Reporting / Media | Multer, Cloudinary, GeoJSON/Geospatial (MongoDB), Turf.js |
| Real-time & Comms | Socket.IO, Nodemailer, express-validator |
| AI Integration (optional service) | Python, FastAPI, YOLO / OpenCV |

## 2. High-Level Architecture

- **Client (React SPA)** — citizen web app (report + track) and municipal admin
  dashboard, sharing a component library, split by route/role.
- **API Server (Node/Express)** — REST APIs for auth, issue CRUD, deduplication,
  priority scoring, status transitions, and resolution verification.
- **AI Service (Python/FastAPI, optional/separate deployable)** — receives an
  image, returns issue classification + confidence score. Called by the Node
  backend as an internal service.
- **MongoDB Atlas** — primary datastore, using geospatial indexes (`2dsphere`)
  for issue locations and duplicate-cluster queries.
- **Cloudinary** — image storage/CDN for reported issue photos and worker
  "resolved" evidence photos.
- **Socket.IO** — pushes live status updates to citizens tracking a report.

## 3. Feature Breakdown (Buildable Units)

### 3.1 Auth & Users
- Citizen signup/login (JWT), municipal admin/worker roles.
- Role-based route guards (citizen / admin / field worker).
- Password hashing via bcrypt.js.

### 3.2 Issue Reporting
- Endpoint to submit: photo (Multer → Cloudinary), GPS coordinates (GeoJSON
  Point), category (optional citizen guess), free-text description.
- Server-side validation via express-validator.

### 3.3 AI Classification Integration
- Node backend calls FastAPI service with the uploaded image URL/buffer.
- Store returned `issueType` + `confidence` on the issue document.
- If `confidence < threshold`, flag `needsManualReview: true`.

### 3.4 Deduplication / Geo-Clustering
- On new report, query existing open issues within a radius (`2dsphere`
  geo-query) of the same category.
- Use Turf.js for distance/area calculations; combine with basic image/text
  similarity to avoid false merges.
- On match: increment `recurrenceCount` on the existing issue, link the new
  report as a "duplicate report" rather than creating a new issue.

### 3.5 Priority Scoring
- Compute `priorityScore = severity * recurrenceCount` (or weighted variant).
- Recompute on every new duplicate merge or severity update.
- Expose sortable/filterable priority on the admin dashboard.

### 3.6 Status Lifecycle & Live Tracking
- Status enum: `reported -> verified -> assigned -> in_progress ->
  pending_confirmation -> resolved` (plus `reopened` / `disputed`).
- Socket.IO room per issue (or per reporter) to push status changes live.
- Email notifications (Nodemailer) on key transitions.

### 3.7 Resolution Verification Layer
- Worker action: mark issue as done + upload evidence photo →
  status becomes `pending_confirmation`.
- Notify original reporter(s) + nearby subscribed users to confirm/dispute.
- Confirmation endpoint: majority/first-confirm rule (define threshold) moves
  status to `resolved`; a dispute (or no confirmation within N days) moves
  status to `reopened` and re-enters the priority queue with a
  `disputedResolution: true` flag.

### 3.8 Municipal Admin Dashboard
- Filter/sort by category, ward/area, status, priority score, dispute flag.
- View duplicate clusters (map + list) and per-issue history/timeline.

### 3.9 Security & Rate Limiting
- Helmet for HTTP headers, CORS config scoped to the frontend origin.
- Rate limiting on report-submission and auth endpoints to deter spam/abuse.

## 4. Data Model (Draft)

```
User {
  _id, name, email, passwordHash, role: 'citizen' | 'admin' | 'worker',
  createdAt
}

Issue {
  _id,
  category: 'pothole' | 'garbage' | 'drainage',
  description,
  photos: [cloudinaryUrl],
  location: { type: 'Point', coordinates: [lng, lat] },   // 2dsphere index
  aiClassification: { label, confidence },
  needsManualReview: Boolean,
  severity: Number,
  recurrenceCount: Number,
  priorityScore: Number,
  status: 'reported' | 'verified' | 'assigned' | 'in_progress' |
          'pending_confirmation' | 'resolved' | 'reopened',
  disputedResolution: Boolean,
  assignedWorker: ObjectId (ref User),
  reporters: [ObjectId] (ref User, first + duplicate reporters),
  resolutionEvidence: [cloudinaryUrl],
  ward: String,
  createdAt, updatedAt
}

ConfirmationVote {
  _id, issueId, userId, vote: 'confirm' | 'dispute', comment, photo, createdAt
}
```

## 5. Proposed Source Tree

```
civic-issue-platform/
├── client/                        # React SPA
│   ├── src/
│   │   ├── api/                   # Axios instance + endpoint wrappers
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── report/            # report form, photo/GPS capture
│   │   │   ├── tracking/          # citizen status timeline
│   │   │   ├── verification/      # confirm/dispute resolution UI
│   │   │   └── admin/             # dashboard widgets, filters, map view
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ReportIssue.jsx
│   │   │   ├── TrackIssue.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Login.jsx / Signup.jsx
│   │   ├── context/                # auth context, socket context
│   │   ├── hooks/
│   │   ├── routes/                 # role-based route guards
│   │   └── App.jsx
│   └── tailwind.config.js
│
├── server/                         # Node/Express API
│   ├── src/
│   │   ├── config/                 # db.js, cloudinary.js, env.js
│   │   ├── models/                 # User.js, Issue.js, ConfirmationVote.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── issueController.js
│   │   │   ├── dedupeController.js
│   │   │   ├── priorityController.js
│   │   │   └── verificationController.js
│   │   ├── routes/
│   │   ├── middleware/             # auth.js, rateLimit.js, validate.js
│   │   ├── services/
│   │   │   ├── aiClassifierClient.js   # calls FastAPI service
│   │   │   ├── geoClusterService.js    # Turf.js logic
│   │   │   └── notificationService.js  # Nodemailer + Socket.IO emit
│   │   ├── sockets/
│   │   └── app.js
│   └── server.js
│
├── ai-service/                     # Python FastAPI (optional deployable)
│   ├── main.py
│   ├── model/                      # YOLO/OpenCV weights + inference code
│   └── requirements.txt
│
└── README.md
```

## 6. Suggested Build Order (maps to PRD rollout plan)

1. Auth (User model, JWT, bcrypt) + basic React shell with routing.
2. Issue reporting flow: form → Multer/Cloudinary upload → GeoJSON storage.
3. AI service stub + integration (classification + confidence).
4. Geo-clustering/dedup service + priority scoring.
5. Status lifecycle + Socket.IO live updates on the citizen tracking page.
6. Resolution verification layer (worker "done" → confirm/dispute → resolve/reopen).
7. Admin dashboard (filters, priority sort, duplicate clusters, dispute flags).
8. Security hardening (Helmet, CORS, rate limiting) + deployment polish.
