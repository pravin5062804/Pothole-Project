# Backend Specifications for Unbuilt Frontend Features
## Crowdsourced Civic Issue Reporting & Resolution System (PS26-057)

This document specifies the backend APIs, data schemas, and integration contracts for backend features that are fully implemented and ready on the server, but have not yet been built as standalone UI screens in the frontend client.

---

## 1. Field Worker Resolution Evidence Submission

### Overview
When field repair crews complete the on-site physical fix (e.g. patching a pothole, clearing garbage, repairing a drain), they must upload evidence photos and work notes. The backend transitions the issue into `pending_confirmation` rather than immediately closing the ticket.

### Endpoint
- **Method**: `POST`
- **URL**: `/api/verification/:id/submit-evidence`
- **Auth**: Required (`worker` or `admin` JWT)
- **Headers**: `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`

### Request Body (Multipart)
| Field | Type | Description |
|---|---|---|
| `evidencePhotos` | File / Binary (up to 3) | After-fix photos uploaded to Cloudinary CDN |
| `resolutionNotes` | String | Description of materials used and work done |

### Backend Behavior & Response
- Automatically sets status to `pending_confirmation`.
- Initializes `confirmationWindowExpiresAt` (3 days from submission).
- Pushes live Socket.IO event `issue_status_updated` to citizen followers.
- Returns updated issue object with `resolutionEvidence` array.

---

## 2. Community Resolution Verification & Dispute Modal

### Overview
Citizens in the local area or the original reporters verify if the fix was actually completed or if it was inadequate.

### Endpoints
#### 2.1 Submit Vote
- **Method**: `POST`
- **URL**: `/api/verification/:id/vote`
- **Auth**: Optional / Citizen Auth
- **Headers**: `Content-Type: multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `vote` | `'confirm' \| 'dispute'` | Required vote decision |
| `comment` | String | Citizen feedback on the quality of the fix |
| `photo` | File (Optional) | Citizen proof photo if disputing resolution |
| `voterName` | String | Citizen identifier |

#### 2.2 Get Issue Votes Tally
- **Method**: `GET`
- **URL**: `/api/verification/:id/votes`
- **Response**: `{ success: true, tallies: { confirms: N, disputes: N }, votes: [...] }`

### Decision Logic:
- **Confirm**: Moves status to `resolved` once confirmed.
- **Dispute**: Moves status to `reopened`, sets `disputedResolution: true`, recalculates and boosts `priorityScore`, and alerts municipal admin.

---

## 3. Municipal Admin Worker Assignment & Triage Dashboard

### Overview
Municipal staff triage unassigned issues, filter by ward/category/priority, and assign repair teams.

### Endpoints
- **Method**: `PATCH`
- **URL**: `/api/issues/:id/assign`
- **Auth**: Required (`admin` JWT)
- **Body (JSON)**:
```json
{
  "workerId": "66ce789a1b2c3d4e5f6a7b8c",
  "note": "Assigned to Ward A road maintenance crew."
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Worker assigned successfully.",
  "issue": { ... }
}
```

---

## 4. Auth & Role-Based UI (Citizen / Worker / Admin)

### Endpoints
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Profile**: `GET /api/auth/me`
- **Seed Demo Accounts**: `POST /api/auth/seed-demo` (generates pre-configured admin, worker, and citizen accounts)

### Demo Accounts Available:
- **Admin**: `admin@civicreport.org` / `AdminPassword123!`
- **Worker**: `worker@civicreport.org` / `WorkerPassword123!`
- **Citizen**: `citizen@civicreport.org` / `CitizenPassword123!`

---

## 5. Real-Time Socket.IO Subscriptions

### Client Event Listeners:
```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

// 1. Subscribe to a specific issue's room for live status changes
socket.emit('join_issue', issueId);

socket.on('issue_status_updated', (data) => {
  console.log('Live issue status change:', data);
  // data: { issueId, ticketId, status, note, resolutionEvidence, ... }
});

// 2. Subscribe to Admin live incoming issue feed
socket.emit('join_admin_feed');

socket.on('new_issue_created', (newIssue) => {
  console.log('New issue reported:', newIssue);
});
```

---

## 6. Duplicate Cluster Map & Turf.js Geo-Radius

### Overview
When reports occur within 75 meters of an existing active issue of the same category:
- The backend automatically merges the report into the parent issue.
- Increments `recurrenceCount`.
- Recalculates `priorityScore = severityWeight * recurrenceCount * categoryMultiplier`.
- Links all citizen reporter records in `reporters` array.
- Frontend Map view can render clustering circles with radius using Leaflet or Mapbox.
