# Project Documentation

## Project Name

### Project Description

Connectify is a real-time team communication application that combines **Stream Chat** (messaging, channels, unread counts, pinned messages, and direct messages) and **Stream Video** (video calls via a call page).

### Business Problem Solved

Teams need fast, reliable, and secure internal communication with real-time chat and lightweight video call initiation—without building and maintaining complex messaging infrastructure from scratch.

### Target Users

- Teams and individuals using browser-based real-time communication
- Authenticated users managed via **Clerk**

### Key Benefits

- Real-time messaging experience via Stream Chat
- Video call entry via Stream Video
- Unified authentication through Clerk
- Backend issues are tracked using Sentry

Project Screenshot Placeholder:

[INSERT_PROJECT_COVER_SCREENSHOT_HERE]

---

# 1. EXECUTIVE SUMMARY

## Project Purpose

Provide a web-based workspace for real-time team messaging (channels + DMs + pinned messages) and initiating video calls.

## Core Features (Detected)

- Authentication-gated UI using Clerk (frontend route protection)
- Stream Chat integration:
  - Channel list with unread counts
  - Channel selection via URL query parameter (`channel`)
  - Custom channel header with:
    - members count
    - pinned messages modal
    - invite button for private channels
    - “Start Video Call” action that posts a message including a call URL
- Direct message support:
  - DM channel creation/listing based on user selection
- Stream Video integration:
  - Video call page at `/call/:id`

## Technology Summary

- Frontend: React (Vite), Stream Chat React SDK, Stream Video SDK, Clerk React SDK, React Router, React Query, TailwindCSS
- Backend: Express.js (ESM), Clerk Express middleware, Stream Chat server SDK token generation, MongoDB via Mongoose
- Background/Events: Inngest functions triggered by Clerk events

## Architecture Overview

```text
User
  │
  ▼
Frontend (React + Stream Chat/Video SDKs)
  │
  ▼
Backend (Express)
  │
  ├─ Authentication: Clerk middleware
  ├─ Token issuance: Stream Chat token endpoint
  └─ Inngest: Clerk event-driven sync to MongoDB + Stream
  │
  ▼
Database (MongoDB via Mongoose)
```

## Business Value

Reduces engineering effort by outsourcing messaging/video primitives to Stream while still integrating with an application-specific authentication layer (Clerk) and user persistence (MongoDB).

---

# 2. PROJECT OVERVIEW

## Project Name

Connectify

## Objective

Create a secure, authenticated messaging and calling experience for teams.

## Scope

- Implemented in this repository:
  - Frontend React app with chat UI and call UI
  - Backend Express API endpoint to issue Stream Chat tokens (protected)
  - Clerk event-driven user synchronization via Inngest
  - MongoDB persistence for users
- Not implemented (explicitly not found in codebase):
  - Any custom username/password auth flow
  - A REST API beyond the chat token endpoint (only `/api/chat/token` is defined)

## Main Functionalities

1. Sign-in via Clerk (frontend route-based protection)
2. Connect to Stream Chat using a token fetched from backend
3. List channels (excluding DMs) and provide DM entry via user list
4. Show a custom channel header with members, pinned messages, invite modal, and call initiation message
5. Initiate Stream Video calls using a call URL

## Business Use Case

A team can communicate in real-time using chat channels, create direct messages, and start calls from within the chat experience.

## Target Audience

Authenticated end-users inside teams.

Project Screenshot Placeholder:

[INSERT_PROJECT_OVERVIEW_SCREENSHOT_HERE]

---

# 3. TECHNOLOGY STACK

## Frontend

| Area | Implemented Technology |
|---|---|
| Framework | React (Vite) |
| Routing | react-router (v7) |
| UI/Styling | TailwindCSS + custom CSS (stream-chat-theme.css, auth.css) |
| State/Data Fetching | @tanstack/react-query |
| Chat UI | stream-chat-react |
| Video UI | @stream-io/video-react-sdk |
| Auth UI | @clerk/clerk-react (UserButton + SignInButton) |
| Icons | lucide-react |
| Error Tracking | @sentry/react |
| Notifications | react-hot-toast |

Build tools:

- Vite config in `frontend/vite.config.js`

## Backend

| Area | Implemented Technology |
|---|---|
| Runtime | Node.js (Express) |
| Framework | express (v5) |
| Language / Module | ESM (`"type": "module"`) |
| Auth | Clerk Express middleware (`clerkMiddleware`) |
| Token issuance | Stream Chat SDK (`stream-chat`) |
| Background/events | Inngest (`inngest/express` integration) |
| DB | Mongoose (MongoDB) |
| Error tracking | @sentry/node |
| CORS | cors (with `origin: ENV.CLIENT_URL`, `credentials: true`) |

## Database

- Database Type: MongoDB
- ORM/ODM: Mongoose
- Storage Strategy:
  - Users are stored in MongoDB via `User` model.

## Authentication

Detected authentication implementation:

- **Clerk** for authentication
- Backend uses `@clerk/express` middleware; authorization is based on `req.auth().isAuthenticated`.

The backend does **not** implement custom JWT/auth logic; it issues Stream Chat tokens after Clerk auth.

## DevOps & Deployment

Detected deployment configuration:

- Both frontend and backend include `vercel.json`.
- Backend Vercel function routes all requests to `src/server.js`.

No explicit CI/CD pipeline config is present in the repository files enumerated.

---

# 4. FEATURES LIST

> Note: Features below are detected directly from code files.

| Feature Name | Purpose | User Benefit | Related Components |
|---|---|---|---|
| Clerk-protected routing | Gate access to main pages by sign-in status | Users must sign in to use chat/call | `frontend/src/App.jsx`, `frontend/src/pages/AuthPage.jsx` |
| Stream Chat token fetch | Obtain Stream Chat token from protected backend endpoint | Secure access to chat | `frontend/src/lib/api.js`, `backend/src/routes/chat.route.js`, `backend/src/middleware/auth.middleware.js` |
| Stream Chat client connection | Connect user to Stream Chat using received token | Real-time messaging | `frontend/src/hooks/useStreamChat.js` |
| Channel list with unread counts | Show channels where the user is a member | Quick navigation to active conversations | `frontend/src/pages/HomePage.jsx`, `frontend/src/components/CustomChannelPreview.jsx` |
| Custom channel header actions | Show members count, pinned messages, invite, and call initiation | Rich in-channel controls | `frontend/src/components/CustomChannelHeader.jsx` |
| Pinned messages modal | Display pinned messages for current channel | Fast retrieval of important content | `frontend/src/components/PinnedMessagesModal.jsx` |
| Members modal | Show channel members | Understand conversation participants | `frontend/src/components/MembersModal.jsx` (exists; content not read in this session) |
| Invite modal for private channels | Invite users in private channels | Expand private team communication | `frontend/src/components/InviteModal.jsx` (exists; content not read in this session) |
| DM creation/listing | Start a direct message channel with selected user | One-to-one collaboration | `frontend/src/components/UsersList.jsx` |
| Stream Video call page | Join video calls by call id | Video conversation without leaving app | `frontend/src/pages/CallPage.jsx`, `frontend/src/components/CallContent.jsx` (exists; content not read in this session) |
| Inngest user sync | Sync Clerk users to MongoDB and Stream user | Persistent local user mapping and Stream access | `backend/src/config/inngest.js` |
| MongoDB persistence for users | Store user fields in MongoDB | Enables app-level user records | `backend/src/models/user.model.js`, `backend/src/DB/db.js` |

Feature Screenshot Placeholder:

[INSERT_FEATURE_SCREENSHOT_HERE]

---

# 5. FOLDER STRUCTURE

## Repository Structure

```text
Connectify/
├── PROJECT_DOCUMENTATION.md
├── backend/
│   ├── instrument.mjs
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── env.js
│       │   ├── inngest.js
│       │   └── stream.js
│       ├── DB/
│       │   └── db.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── chat.controller.js
│       ├── models/
│       │   └── user.model.js
│       └── routes/
│           └── chat.route.js
└── frontend/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   ├── auth-i.png
    │   ├── logo.png
    │   ├── slack-logo.png
    │   └── vite.svg
    ├── vercel.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── components/
        │   ├── CallContent.jsx
        │   ├── ChannelListError.jsx
        │   ├── ChannelListLoading.jsx
        │   ├── CreateChannelModal.jsx
        │   ├── CustomChannelHeader.jsx
        │   ├── CustomChannelPreview.jsx
        │   ├── EmptyChannelState.jsx
        │   ├── InviteModal.jsx
        │   ├── MembersModal.jsx
        │   ├── MobileSidebar.jsx
        │   ├── PageLoader.jsx
        │   ├── PinnedMessagesModal.jsx
        │   └── UsersList.jsx
        ├── hooks/
        │   └── useStreamChat.js
        ├── lib/
        │   ├── api.js
        │   └── axios.js
        ├── pages/
        │   ├── AuthPage.jsx
        │   ├── CallPage.jsx
        │   └── HomePage.jsx
        ├── providers/
        │   └── AuthProvider.jsx
        └── styles/
            ├── auth.css
            └── stream-chat-theme.css
```

---

# 6. SYSTEM ARCHITECTURE

## Architecture Pattern

- Frontend-driven real-time UI using Stream SDKs
- Backend focused on:
  - Authentication middleware (Clerk)
  - Token generation endpoint for Stream Chat
  - Event handling endpoint for Inngest
  - MongoDB user persistence

## Request Lifecycle (High-Level)

```text
User Browser
   │
   ▼
Frontend (Stream Chat/Video SDK)
   │
   ▼
GET /api/chat/token (Clerk-protected)
   │
   ▼
Backend middleware:
  - Clerk auth check
  - Stream token generation
   │
   ▼
Stream token returned to Frontend
   │
   ▼
Stream SDK connects user and begins real-time messaging/video
```

## Data Flow

- Clerk auth state determines whether frontend can access chat/call pages.
- Frontend calls backend to retrieve a Stream Chat token.
- Stream token is used by Stream Chat React SDK to connect and render channel/message UI.

---

# 7. DATABASE DESIGN

## User Model (MongoDB via Mongoose)

File: `backend/src/models/user.model.js`

| Field | Type | Constraints | Purpose |
|---|---|---|---|
| email | String | required, unique | User email |
| name | String | required | Display name |
| image | String | required | Avatar URL |
| clerkId | String | required, unique | Clerk user id mapping |
| timestamps | Mongoose timestamps | auto | createdAt/updatedAt |

Relationships:

- No explicit relationships are defined in MongoDB models in this repository.

---

# 8. ENTITY RELATIONSHIP DIAGRAM (ERD)

```text
Users
├── email (unique, required)
├── name (required)
├── image (required)
└── clerkId (unique, required)
```

---

# 9. SECURITY ARCHITECTURE

## Implemented Security Measures (Detected)

1. Authentication (Clerk)
   - Backend uses `clerkMiddleware()`.
   - Protected route checks `req.auth().isAuthenticated`.

2. Protected API endpoint
   - Only `/api/chat/token` is protected by `protectRoute`.

3. CORS restrictions
   - Backend allows `origin: ENV.CLIENT_URL` and `credentials: true`.

## Token Strategy

- The backend does not issue a custom JWT to the frontend.
- The backend issues **Stream Chat tokens** via `streamClient.createToken(userIdString)`.
- Token generation depends on the authenticated Clerk user id.

## Authorization

- Authorization is binary in the codebase: authenticated vs not authenticated.
- No role-based authorization logic is present.

## Validation

- Request validation for `/api/chat/token` is not implemented (endpoint uses only auth context).

## Encryption

- No explicit encryption logic is in the repository code.
- Encryption is delegated to TLS/HTTPS in deployment.

---

# 10. AUTHENTICATION FLOW

Detected: **Clerk authentication + backend-protected token issuance for Stream Chat**.

```text
User
  │
  ▼
Frontend (Clerk) sign-in
  │
  ▼
GET /api/chat/token
  │
  ▼
Backend: Clerk middleware attaches req.auth()
  │
  ▼
protectRoute checks req.auth().isAuthenticated
  │
  ▼
Generate Stream Chat token using req.auth().userId
  │
  ▼
Return { token } to frontend
  │
  ▼
Frontend connects to Stream Chat with token
```

---

# 11. APPLICATION FLOW

Detected for the authenticated chat experience.

```text
App Start
   │
   ▼
Load React routes (App.jsx)
   │
   ▼
If signed in:
  - Render HomePage
If not signed in:
  - Render AuthPage
   │
   ▼
HomePage initializes Stream Chat
   │
   ▼
Fetch Stream token from backend (/api/chat/token)
   │
   ▼
Connect Stream Chat client
   │
   ▼
Render channel list and selected channel window
   │
   ▼
User interacts (select channel, open modals)
   │
   ▼
Stream provides real-time messages
```

---

# 12. BACKEND INTERNAL FLOW

## Token Endpoint Flow

```text
Request: GET /api/chat/token
  │
  ▼
Clerk middleware (clerkMiddleware)
  │
  ▼
protectRoute (auth check)
  │
  ▼
getStreamToken (Stream token generation)
  │
  ▼
Response: { token }
```

---

# 13. FRONTEND INTERNAL FLOW

## Home Page Flow

```text
Entry Point: App.jsx
   │
   ▼
HomePage.jsx
   │
   ▼
useStreamChat hook
   │
   ▼
react-query -> getStreamToken() -> backend /api/chat/token
   │
   ▼
StreamChat.connectUser()
   │
   ▼
Render Stream Chat components:
  - ChannelList
  - Channel + Window
  - Thread
```

---

# 14. API DOCUMENTATION

Detected APIs from repository.

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/chat/token` | Generates and returns a Stream Chat token for the authenticated Clerk user | Yes |

## Endpoint Details

### Endpoint Name

- `Get Stream Chat Token`

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/api/chat/token` |
| Auth Required | Yes (Clerk) |
| Request Body | None |
| Query Parameters | None |

#### Internal Flow

```text
Route (chat.route.js)
  │
  ▼
Middleware: protectRoute (auth.middleware.js)
  │
  ▼
Controller: getStreamToken (middleware/chat.controller.js)
  │
  ▼
Stream token generation (config/stream.js)
  │
  ▼
Response: { token }
```

#### Success Response

```json
{
  "token": "<stream-chat-token>"
}
```

#### Error Response

```json
{
  "message": "Unauthorized - you must be logged in"
}
```

or

```json
{
  "error": "<error-message>"
}
```

---

# 15. THIRD-PARTY INTEGRATIONS

Detected integrations:

| Integration | Where Used | Purpose |
|---|---|---|
| Clerk | Backend + Frontend | Authentication and auth context |
| Stream Chat | Frontend + Backend | Real-time messaging + token issuance |
| Stream Video | Frontend | Video calling UI and join logic |
| Inngest | Backend | Event-driven sync triggered by Clerk user events |
| Sentry | Frontend + Backend | Error tracking |
| MongoDB/Mongoose | Backend | Persist user records |
| TailwindCSS | Frontend | Styling foundation |

Integration flow details (verified):

1. Clerk user created event triggers Inngest function `sync-user`.
2. In that function:
   - MongoDB `User` record is created.
   - Stream user is upserted via `upsertStreamUser()`.
   - User is added to discoverable channels via `addUserToPublicChannels()`.

---

# 16. ENVIRONMENT VARIABLES

Detected environment variables in backend (`backend/src/config/env.js`).

| Variable | Purpose | Required |
|---|---|---|
| PORT | Backend server port | Optional (default 5001) |
| MONGO_URI | MongoDB connection string | Required (connectDB uses ENV.MONGO_URI) |
| NODE_ENV | Environment name for Sentry | Optional |
| CLERK_PUBLISHABLE_KEY | Clerk frontend config (not directly used in backend code shown) | Optional/Unknown |
| CLERK_SECRET_KEY | Clerk backend auth secret (used implicitly by Clerk middleware) | Required for auth |
| STREAM_API_KEY | Stream Chat token generation | Required |
| STREAM_API_SECRET | Stream Chat token generation | Required |
| SENTRY_DSN | Sentry configuration | Optional (used by Sentry.init) |
| INNGEST_EVENT_KEY | Inngest event key (configured in inngest.js usage) | Optional/Unknown |
| INNGEST_SIGNING_KEY | Inngest signing key | Optional/Unknown |
| CLIENT_URL | Allowed CORS origin | Required for CORS |

Environment variables for frontend are referenced as Vite env variables:

| Variable | Purpose | Required |
|---|---|---|
| VITE_API_BASE_URL | Axios base URL | Required (used by axios instance) |
| VITE_STREAM_API_KEY | Stream Video API key and Stream Chat usage | Required (used in hooks/pages) |

Environment variable example:

```env
MONGO_URI=
CLERK_SECRET_KEY=
STREAM_API_KEY=
STREAM_API_SECRET=
CLIENT_URL=
VITE_API_BASE_URL=
VITE_STREAM_API_KEY=
SENTRY_DSN=
```

---

# 17. DEPENDENCIES

## Frontend Dependencies

Major packages (detected from `frontend/package.json`):

| Package | Purpose |
|---|---|
| react / react-dom | UI |
| vite | Build tool |
| stream-chat / stream-chat-react | Messaging UI and client |
| stream-chat-react | Stream Chat React components |
| @stream-io/video-react-sdk | Video call UI |
| @clerk/clerk-react | Auth UI + hooks |
| @sentry/react | Frontend error tracking |
| @tanstack/react-query | Data fetching/caching |
| axios | API requests |
| tailwindcss + @tailwindcss/vite | Styling |
| framer-motion | Animations |
| lucide-react | Icons |
| react-router | Routing |
| react-hot-toast | Notifications |

## Backend Dependencies

Major packages (detected from `backend/package.json`):

| Package | Purpose |
|---|---|
| express | Backend server |
| @clerk/express | Clerk middleware |
| cors | CORS config |
| dotenv | Env loading |
| mongoose | MongoDB ODM |
| stream-chat | Stream token generation and Stream user management |
| inngest | Inngest event functions |
| @sentry/node | Backend error tracking |
| cross-env / nodemon | Dev tooling |

---

# 18. INSTALLATION GUIDE

> Commands assume Node.js is installed.

## 1) Backend Setup

```bash
cd backend
npm install
```

Create environment variables required by the backend (at least):

```env
MONGO_URI=
CLERK_SECRET_KEY=
STREAM_API_KEY=
STREAM_API_SECRET=
CLIENT_URL=
SENTRY_DSN=
```

Run the backend in development:

```bash
npm run dev
```

## 2) Frontend Setup

```bash
cd frontend
npm install
```

Create environment variables for the frontend (Vite):

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_STREAM_API_KEY=
```

Run the frontend:

```bash
npm run dev
```

---

# 19. DEPLOYMENT GUIDE

Detected deployment environment: Vercel.

## Backend Hosting

- Backend has `backend/vercel.json` routing all routes to `src/server.js` using `@vercel/node`.

## Frontend Hosting

- Frontend has `frontend/vercel.json`.

## Environment Configuration

- Configure backend env vars (MongoDB, Clerk, Stream, Sentry, CORS).
- Configure frontend Vite env vars (API base URL and Stream API key).

Production build process (frontend):

```bash
npm run build
npm run preview
```

---

# 20. RUNTIME FLOW

```text
Request
   │
   ▼
Express Middleware
   │
   ├─ Clerk middleware
   │
   ├─ CORS handling
   │
   ▼
Authentication Checks (protectRoute)
   │
   ▼
Business Logic
   │
   └─ Generate Stream Chat token
   ▼
Database (MongoDB only on Inngest functions)
   ▼
Response
```

---

# 21. CHALLENGES & LEARNINGS

## Technical Challenges (Detected/Implied by Code)

- Multi-provider integration (Clerk + Stream Chat + Stream Video)
- Secure token issuance for Stream Chat based on authenticated user context
- Keeping user identity consistent between Clerk and Stream (upsert via Inngest)

## Solutions Implemented

- Clerk middleware for auth context
- Protected token endpoint `/api/chat/token`
- Inngest functions to sync Clerk user creation/deletion to MongoDB and Stream

## Key Learnings

- Real-time SDKs rely on short-lived capabilities; backend token generation is essential.

---

# 22. COMMON ERRORS & TROUBLESHOOTING

## Installation Errors

- If dependency install fails, ensure Node.js version is compatible with package.json.

## Environment Variable Issues

- If Stream connections fail, verify:
  - `STREAM_API_KEY`, `STREAM_API_SECRET`
  - frontend `VITE_STREAM_API_KEY`
- If `/api/chat/token` returns 401:
  - Ensure Clerk sign-in is complete and `CLIENT_URL` CORS matches frontend origin.

## Authentication Issues

- If token generation fails:
  - Check backend `CLERK_SECRET_KEY`.

---

# 23. PERFORMANCE ANALYSIS

## Current Optimizations (Detected)

- React Query controls token fetch with `enabled: !!user?.id`.
- Token fetch is cached by query key `['streamToken']`.

## Potential Bottlenecks

- Stream Chat token generation on every query (depends on caching strategy and query key behavior).
- Inngest sync iterates over discoverable public channels and adds members (may increase event processing time with large channel counts).

## Scalability Considerations

- Token endpoint is lightweight but relies on Stream SDK calls.
- Inngest `addUserToPublicChannels` scales with number of discoverable channels.

---

# 24. SECURITY REVIEW

## Existing Security Measures

- Clerk middleware and `protectRoute` ensure only authenticated users can access Stream token endpoint.
- Backend CORS is restricted to `ENV.CLIENT_URL`.

## Security Risks (Based on Code)

- Authorization is only “authenticated vs not”; no finer-grained permissions.
- Error responses sometimes return raw error messages (`res.status(500).json({ error: error.message })`).

## Recommended Improvements

- Replace raw error message with generic error in production.
- Consider adding rate limiting to token endpoint.
- Add role/permission checks if multiple channel types require access control.

---

# 25. FUTURE ENHANCEMENTS

Realistic improvements based on current architecture:

1. Add backend endpoints for managing channels/members explicitly (if needed) rather than relying purely on Stream SDK client behaviors.
2. Add more granular authorization (e.g., per-channel private access) if required.
3. Add caching for Stream token issuance.
4. Implement logging around Inngest performance and Stream user management.

---

# 26. DEVELOPER NOTES

## Architecture Decisions (Detected)

- Backend is intentionally minimal and focuses on protected token issuance.
- Identity mapping strategy:
  - Clerk user id (`clerk/user.created`) is persisted to MongoDB and used as Stream user id.

## Maintainability Notes

- The codebase uses ESM and modern JS.
- Frontend uses modular components for modals and custom channel rendering.

## Refactoring Opportunities (Based on Detected Code)

- `AuthProvider.jsx` sets up an axios interceptor but does not appear to provide useful value to children context (AuthContext value is `{}`). If not required, it can be simplified.
- The token endpoint uses middleware filename `chat.controller.js` but exports `getStreamToken` used as controller.

## Technical Debt Observations

- Some files exist but were not read in this session (e.g., `CreateChannelModal.jsx`, `MembersModal.jsx`, `InviteModal.jsx`, `CallContent.jsx`). Any documentation sections referencing their behavior are limited to what was detected in files read.

---

Final Line:

Written by Yash Lagare

