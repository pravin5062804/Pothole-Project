# Product Requirements Document
## Crowdsourced Civic Issue Reporting & Resolution System

**Problem Statement:** PS26-057 (Transportation)
**Team:** Nyx Coders
**College:** Vivekanand Education Society's Arts, Science and Commerce College, Chembur, Mumbai

---

## 1. Problem Statement

Municipalities struggle with unorganized citizen complaints about potholes, garbage
accumulation, and drainage failures, leading to delayed repairs and public frustration.
Complaints today are scattered across phone calls, social media, and word of mouth —
with no central pipeline, no deduplication, and no way for a citizen to verify that a
"resolved" ticket was actually resolved.

## 2. Goals & Objectives

- Replace scattered complaint channels with a single, unified reporting pipeline.
- Cut duplicate complaints reaching municipal staff via automatic geo-based detection.
- Give citizens real-time visibility into the status of their reported issue.
- Close the loop: let the reporting community verify that a "resolved" issue is
  genuinely resolved, instead of relying solely on the assigned worker's word.

## 3. Non-Goals (MVP Scope)

- No support for issue categories beyond potholes, garbage accumulation, and drainage
  failures at MVP stage (architecture must allow easy extension later).
- No native mobile app at MVP — citizen-facing surface is a responsive web app.
- No WhatsApp/SMS reporting channel at MVP (fast-follow, post-MVP).
- No government grievance portal integration at MVP (future enhancement).

## 4. Target Users

| User | Needs |
|---|---|
| Citizen / Reporter | Fast, low-friction way to report an issue and track it to resolution |
| Municipal Staff / Admin | A triaged, de-duplicated, prioritized worklist instead of raw complaint noise |
| Field Worker | Clear issue location + details, simple way to mark work done |
| Reporting Community | Ability to confirm or dispute a "resolved" status before a ticket closes |

## 5. User Stories

1. **As a citizen**, I want to submit a photo, my GPS location, and a short
   description of a civic issue, so that I don't have to call or search for the
   right department.
2. **As a citizen**, I want the system to automatically detect and merge my report
   with existing reports of the same issue, so duplicate effort isn't wasted.
3. **As a citizen**, I want to see the live status of my report (Reported → Verified
   → In Progress → Resolved), so I know it's being handled.
4. **As a citizen**, I want to be asked to confirm whether an issue marked "resolved"
   is actually fixed, so fake or premature closures are caught.
5. **As a municipal admin**, I want a dashboard that filters issues by category,
   area, and urgency, so I can allocate repair crews efficiently.
6. **As a municipal admin**, I want issues auto-ranked by a severity × recurrence
   score, so the worst/most-reported problems surface first.
7. **As a field worker**, I want to mark an assigned issue as resolved with
   evidence (photo), so the loop can move to citizen verification.

## 6. Core Feature Requirements

### 6.1 Photo + GPS Reporting
- One-tap issue submission with photo upload and geo-tagged location capture.
- Short free-text description field.

### 6.2 AI Classification
- A CV model classifies the uploaded photo into issue type (pothole / garbage /
  drainage) with a confidence score.
- Low-confidence classifications route to manual review instead of auto-accept.

### 6.3 Duplicate Detection (Deduplication)
- Geo-clustering merges reports of the same issue within a defined radius.
- Combine GPS proximity with image/description similarity to reduce false merges.
- Each merge increments a "recurrence count" used in prioritization.

### 6.4 Priority Scoring
- Severity × recurrence score ranks and routes issues to the admin queue.
- Ranking must be visible/explainable on the admin dashboard (not a black box).

### 6.5 Live Status Tracking
- Status lifecycle: `Reported → Verified → Assigned → In Progress → Pending Confirmation → Resolved`.
- Citizens see real-time updates on their submitted/merged reports.

### 6.6 Resolution Verification Layer (community confirmation)
- When a worker marks an issue "Resolved," it moves to **Pending Confirmation**,
  not straight to Resolved.
- Original reporter(s) and nearby community members are notified and asked to
  confirm or dispute the fix (e.g. thumbs up/down, optional photo).
- If disputed or unconfirmed past a set window, the issue reopens and is
  re-flagged to the admin queue with a "disputed resolution" tag.
- This closes the trust gap instead of taking the worker's "resolved" mark at
  face value.

### 6.7 Admin Dashboard
- Filter by category, area/ward, urgency, and status.
- View duplicate clusters, priority scores, and disputed-resolution flags.

## 7. Success Metrics

- Reduction in duplicate tickets reaching municipal staff.
- Reduction in average time from report to verified resolution.
- % of "resolved" tickets confirmed by the community vs. disputed/reopened.
- Citizen adoption / reports submitted per pilot ward.

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Inconsistent image quality hurts model accuracy | Data augmentation + manual-review fallback for low-confidence cases |
| False duplicate merging | Combine GPS radius with description/image similarity |
| Low citizen adoption | Minimal-friction UI; WhatsApp/SMS as fast-follow |
| Workers gaming the resolution status | Community verification layer (Section 6.6) makes "resolved" a claim, not a fact, until confirmed |
| Scaling to new issue types | Modular classification pipeline built for easy extension |

## 9. Rollout Plan

1. Requirements, wireframes, dataset prep
2. Backend APIs, DB schema, reporting flow
3. CV model + duplicate detection + priority engine
4. Municipal dashboard + real-time tracking + resolution verification flow
5. Testing, deployment, demo polish
6. Pilot in one Mumbai ward, gather feedback, then scale

## 10. Future Enhancements (Post-MVP)

- Expand detection to streetlights, water leakage, illegal dumping.
- WhatsApp/SMS reporting channel for wider accessibility.
- Predictive analytics to flag high-risk zones before issues are reported.
- Integration with government grievance portals.
