# Connectify — Production Documentation (Frontend + Backend)

Author: Yash Lagare

---

## 1. Project Overview

### Project name
Connectify

### Purpose
Connectify provides secure, real-time team communication with:
- Authentication via Clerk
- Real-time chat via Stream Chat
- Real-time video calling via Stream Video
- User synchronization and lifecycle automation via Inngest (event-driven)

### High-level system summary
The system is split into two deployable applications:
- **Frontend (Vite + React)**: Auth-gated app that connects the signed-in user to Stream services and renders chat/call UIs.
- **Backend (Express)**: Hosts middleware-protected API endpoints (currently `/api/chat/token`) and provides Stream token generation and infrastructure wiring (CORS, Clerk, MongoDB connection, Sentry, Inngest wiring).

### Business problem solved
Modern teams need fast, secure collaboration. Connectify reduces friction by enabling:
- Instant messaging with unread counts, channel discovery, and direct messaging
- Private/public channels with membership management
- One-click video meetings initiated from chat

---

## 2. Technology Stack

### Frontend
- **Framework**: React (v19) + Vite
- **Routing**: `react-router` v7
- **Auth**: Clerk (`@clerk/clerk-react`, `@clerk/clerk-react` UI)
- **State / Server state**: `@tanstack/react-query`
- **Real-time chat SDK**: `stream-chat-react`
- **Real-time video SDK**: `@stream-io/video-react-sdk`
- **HTTP client**: Axios (`axios` + custom instance)
- **Notifications**: `react-hot-toast`
- **Error reporting**: `@sentry/react`
- **Styling**: Tailwind (via `@tailwindcss/vite`), plus component CSS (`src/index.css`, `src/styles/*`)
- **Icons**: `lucide-react`

### Backend
- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Auth/Session middleware**: Clerk Express middleware (`@clerk/express`)
- **Database**: MongoDB via Mongoose (`mongoose`)
- **Authentication token strategy for Stream**: Stream Chat token created server-side using Stream API keys/secrets
- **Real-time chat infrastructure**: `stream-chat` (server SDK)
- **Event automation**: Inngest (`inngest/express` + `Inngest` functions)
- **Error reporting**: `@sentry/node`
- **CORS**: `cors`
- **Environment management**: `dotenv`

---

## 3. Features List (FULL — detected from code)

### Authentication & access control
- Frontend route gating using Clerk session state:
  - `/` requires signed-in user; redirects signed-out users to `/auth`
  - `/auth` is opposite-gated
  - `/call/:id` requires signed-in user
- Backend middleware `protectRoute` rejects unauthenticated requests with **401**.

### Real-time messaging (Stream Chat)
- Client connects to Stream Chat using:
  - Server-generated token from `GET /api/chat/token`
  - Stream API key configured in `VITE_STREAM_API_KEY`
- Channel list and chat UI:
  - Channel list rendered via `ChannelList` (Stream React UI)
  - Message UI via `MessageList`, `MessageInput`, and `Thread`
- Unread count displayed in channel preview (`channel.countUnread()`)
- Active channel selection stored in URL query param `channel`.

### Channel management
- Create channel modal (`CreateChannelModal`):
  - Public channel creation (discoverable)
  - Private channel creation (private visibility)
  - Channel ID normalization/derivation from name:
    - lowercase, whitespace to `-`, remove invalid characters, slice to 20
- Member management:
  - For public channels: auto-selects all users as initial members.
  - For private channels: allows selecting members before creation.
- Invite users to private channels (`InviteModal`):
  - Fetches non-member users and calls `channel.addMembers(...)`.
- Channel header actions (`CustomChannelHeader`):
  - Member list modal
  - Pinned messages modal
  - Video call initiation

### Direct messages (DMs)
- DMs created dynamically from selected user list:
  - Channel ID derived by sorting two user IDs and joining with `-`, then slicing to 64.
  - Members are set to both user IDs.
- DM channel previews are hidden from the main channel list (`CustomChannelPreview` returns `null` for DM channels).
- DM users list shows online indicator and unread count.

### Pinning and pinned messages UI
- Channel header fetches pinned messages using `channel.query()` and renders them in `PinnedMessagesModal`.

### Video calling (Stream Video)
- Video call page at `/call/:id`:
  - Initializes `StreamVideoClient` using `VITE_STREAM_API_KEY` and Stream token
  - Creates or joins call session: `videoClient.call("default", callId)` then `join({ create: true })`
- In-call navigation behavior:
  - When call state becomes `LEFT`, user is navigated back to `/`.

### Inngest event automation (user lifecycle)
- Inngest functions are defined for:
  - `clerk/user.created`:
    - Connect DB
    - Create a MongoDB `User` record
    - Upsert user in Stream and add to discoverable public channels
  - `clerk/user.deleted`:
    - Connect DB
    - Delete `User` record
    - Delete user from Stream
- Inngest is mounted at `/api/inngest`.

### Observability
- Sentry integration:
  - Frontend Sentry initialized in `main.jsx`
  - Backend Sentry error handler enabled via `Sentry.setupExpressErrorHandler(app)`
- Backend debug route:
  - `GET /debug-sentry` returns a plain text response.

---

## 4. Folder Structure Explanation

### Backend: `backend/src/`
- `server.js`
  - Express app wiring: JSON parsing, CORS, Clerk middleware
  - Routes:
    - `/api/inngest` (Inngest express handler)
    - `/api/chat` (chat token endpoint)
  - Mongo connection and Sentry setup
- `config/`
  - `env.js`: Loads environment variables into `ENV`
  - `inngest.js`: Defines Inngest functions for Clerk events
  - `stream.js`: Stream Chat server SDK utilities
- `DB/`
  - `db.js`: MongoDB connection via `mongoose.connect(ENV.MONGO_URI)`
- `models/`
  - `user.model.js`: Mongoose `User` schema
- `middleware/`
  - `auth.middleware.js`: `protectRoute` middleware using Clerk auth state
  - `chat.controller.js`: `getStreamToken` controller that calls Stream token generator
- `routes/`
  - `chat.route.js`: Express Router for `/api/chat/token`

### Frontend: `frontend/src/`
- `main.jsx`
  - React root rendering
  - ClerkProvider configuration
  - React Query setup
  - Sentry initialization
- `App.jsx`
  - Route definitions and redirects based on `useAuth().isSignedIn` / `isLoaded`
- `providers/`
  - `AuthProvider.jsx`: Installs Axios interceptor to attach `Authorization: Bearer <Clerk token>`
- `lib/`
  - `axios.js`: Axios instance with `VITE_API_BASE_URL` and `withCredentials: true`
  - `api.js`: `getStreamToken()` calling `GET /chat/token`
- `hooks/`
  - `useStreamChat.js`: connects user to Stream Chat using server token
- `pages/`
  - `AuthPage.jsx`: sign-in landing page UI
  - `HomePage.jsx`: chat UI (channel list, message window)
  - `CallPage.jsx`: video call UI
- `components/`
  - `CreateChannelModal.jsx`: creates public/private channels
  - `CustomChannelHeader.jsx`: header + actions (members/pins/invite/video call)
  - `CustomChannelPreview.jsx`: channel preview (hidden for DMs)
  - `InviteModal.jsx`: invites members to private channel
  - `MembersModal.jsx`: modal listing channel members
  - `PinnedMessagesModal.jsx`: modal listing pinned messages
  - `UsersList.jsx`: user directory and DM initiation
  - `CallContent.jsx`: Stream video call UI and navigation on leave
  - `PageLoader.jsx`: loader UI (not inspected in this run)

---

## 5. System Architecture

### Client-server architecture
- **Client (Frontend)**
  - Auth-managed using Clerk
  - Requests Stream token from backend
  - Uses Stream SDKs directly for real-time messaging/video

- **API Layer (Backend endpoints)**
  - Provides Stream Chat token only through protected route

- **Backend services (internal)**
  - Stream token creation using server-side Stream credentials
  - Mongo connection for user lifecycle (Inngest)
  - Sentry error handling

- **Database**
  - MongoDB stores `User` records synchronized by Inngest events

### Request lifecycle (high-level)
1. User signs in via Clerk on the frontend.
2. Frontend requests Stream token from `GET /api/chat/token`.
3. Backend verifies authentication via Clerk middleware state.
4. Backend generates Stream token using `streamClient.createToken(userId)`.
5. Frontend connects to Stream Chat using Stream token.
6. Real-time traffic flows directly through Stream services.

### Data communication model
- REST (Axios) for token retrieval.
- WebSocket/realtime for chat and video, handled by Stream SDKs.

---

## 6. DFD (Data Flow Diagram) Explanation

### Level 0
**Actors**
- End user
- Clerk identity provider
- Connectify backend API
- Stream Chat service
- Stream Video service
- MongoDB

**High-level data exchange**
- User → Clerk → Frontend authentication state
- Frontend → Backend `/api/chat/token` for authorization bootstrap
- Backend → Stream Chat token creation
- Frontend → Stream Chat (connect, realtime messaging)
- Frontend → Stream Video (call join, realtime media)
- Clerk events → Inngest → MongoDB + Stream user provisioning

### Level 1
#### Authentication process
- Frontend gets JWT-like token via Clerk (`getToken()`), adds it to Axios request headers.
- Backend uses Clerk middleware auth state (`req.auth().isAuthenticated`) to allow/deny token endpoint access.

#### CRUD operations
- MongoDB CRUD is performed by Inngest functions:
  - Create: `User.create(newUser)` on `clerk/user.created`
  - Delete: `User.deleteOne({ clerkId: id })` on `clerk/user.deleted`
- Stream user CRUD is performed in the same Inngest flows:
  - Upsert user
  - Delete user

#### Data processing flow
- Token generation flow:
  - userId derived from Clerk session in request (`requestAnimationFrame.auth().userId`)
  - Stream token generated by `generateStreamToken(userId)`

---

## 7. ERD (Entity Relationship Diagram) Explanation

### Entities detected
1. **User** (`backend/src/models/user.model.js`)
   - Fields:
     - `email`: String (unique, required)
     - `name`: String (required)
     - `image`: String (required)
     - `clerkId`: String (unique, required)
     - `timestamps`: createdAt / updatedAt (enabled by `{ timestamps: true }`)

### Relationships
- The codebase does not define explicit relational models beyond the `User` collection.
- Relationship logic exists conceptually:
  - `User` represents a mapping between `clerkId` and Stream user ID.
  - Stream channels and Stream DMs exist in Stream’s own datastore (not modeled as Mongo collections in this repo).

---

## 8. SECURITY ARCHITECTURE

### Authentication mechanism
- **Clerk**
  - Frontend uses `ClerkProvider`.
  - Protected backend endpoint uses Clerk Express middleware.

### Authorization
- Backend endpoint `/api/chat/token` is protected by `protectRoute`:
  - If `req.auth().isAuthenticated` is false → return **401 Unauthorized**.

### Protected routes
- `GET /api/chat/token`
  - Middleware: `protectRoute`

### Password encryption
- No password handling exists in this codebase.
- Authentication is delegated entirely to Clerk.

### Middleware validation
- `protectRoute` checks Clerk auth state and blocks unauthorized access.

### Token management strategy
- **Stream Chat token**
  - Generated server-side using Stream secret credentials.
  - Returned to frontend as `{ token }`.
  - Frontend uses token to call `client.connectUser(user, token)`.

### Cookie / credential handling
- Axios instance sets `withCredentials: true` on the frontend.
- Backend CORS enables `credentials: true` and restricts origin to `ENV.CLIENT_URL`.

---

## 9. JWT AUTH FLOW (Diagram Explanation)

> Note: In this codebase, “JWT” terminology refers to the token produced by Clerk (`getToken()`), while the backend returns a **Stream Chat token**.

### Step-by-step flow
1. **Login request**
   - User signs in using Clerk UI on `/auth`.
2. **Credential validation**
   - Performed by Clerk (not implemented in this repository).
3. **JWT generation**
   - Frontend uses `useAuth().getToken()` to obtain a Clerk token.
4. **Token returned**
   - Clerk returns token to the frontend.
5. **Storage (cookie/localStorage)**
   - Storage mechanism is managed by Clerk SDK (repo does not directly store the token).
6. **Protected API request**
   - Frontend calls `GET /chat/token` via Axios.
   - `AuthProvider` interceptor attaches `Authorization: Bearer <Clerk token>`.
7. **JWT verification middleware**
   - Backend `protectRoute` checks `req.auth().isAuthenticated`.
8. **Access granted/denied**
   - Granted: backend generates Stream Chat token.
   - Denied: backend returns `401`.

### Text diagram
User → Clerk Sign-In → Frontend (`getToken()`) → Backend `/api/chat/token` → protectRoute (Clerk auth check) → Stream token generated → Response `{ token }` → Frontend stores token in memory usage → Stream SDK connects → Protected realtime messaging

### Token expiration
- The codebase does not explicitly define expiration behavior.
- Stream token creation and Clerk token expiration are handled by their respective SDKs/servers.

### Security risks handled
- Backend does not expose Stream secrets to the client.
- Backend endpoint is protected by Clerk middleware.

### Why middleware is needed
- Prevents unauthenticated users from generating Stream tokens.

---

## 10. APPLICATION FLOW (STEPWISE)

### App startup
1. Frontend bootstraps in `main.jsx`.
2. ClerkProvider is initialized using `VITE_CLERK_PUBLISHABLE_KEY`.
3. QueryClientProvider mounts React Query.
4. AuthProvider installs an Axios request interceptor that attaches Clerk tokens.
5. Sentry is initialized.

### Route loading
6. In `App.jsx`, routes are resolved based on `useAuth()` state:
   - If signed in → `/` and `/call/:id` render app pages.
   - If signed out → redirect to `/auth`.

### Authentication check
7. `HomePage` and `CallPage` rely on `useUser()` and `useAuth()` readiness to fetch tokens.

### API request cycle (Stream token)
8. `useStreamChat` (HomePage) uses React Query to call `getStreamToken()`:
   - `GET /chat/token` (Axios)
   - Query enabled when `user?.id` is available.

9. Backend `GET /api/chat/token`:
   - Clerk auth check via `protectRoute`
   - Token generation via `generateStreamToken(userId)`
   - Response: `{ token }`

### State update and rendering
10. Frontend receives token:
   - StreamChat client connects using `connectUser(...)`.
   - UI renders Stream `Chat` component with channel list and message views.

### Video rendering flow (CallPage)
11. `CallPage` fetches token similarly via React Query.
12. On successful token retrieval, it creates a `StreamVideoClient` and joins the call with `create: true`.
13. `CallContent` monitors call state and navigates back to home on leave.

### Database update lifecycle
14. MongoDB and Stream user provisioning occur asynchronously via Inngest when Clerk emits:
   - `clerk/user.created`
   - `clerk/user.deleted`

---

## 11. BACKEND INTERNAL FLOW

Route → Middleware → Controller → Service → Model → Database → Response

### For `GET /api/chat/token`
1. **Route**: `backend/src/routes/chat.route.js`
   - `router.get('/token', protectRoute, getStreamToken)`
2. **Middleware**: `protectRoute`
   - blocks if not authenticated
3. **Controller**: `backend/src/middleware/chat.controller.js`
   - calls `generateStreamToken(requestAnimationFrame.auth().userId)`
4. **Service**: `backend/src/config/stream.js`
   - calls `streamClient.createToken(userIdString)`
5. **Response**
   - returns JSON `{ token }`

### Inngest flows (user provisioning)
Route/trigger (event) → connectDB → model operations → stream operations
- `clerk/user.created`:
  - `User.create(newUser)`
  - `upsertStreamUser(...)`
  - `addUserToPublicChannels(...)`
- `clerk/user.deleted`:
  - `User.deleteOne({ clerkId: id })`
  - `deleteStreamUser(id)`

---

## 12. FRONTEND INTERNAL FLOW

App entry point → Routing → State management → API integration → Component hierarchy

### Entry point
- `frontend/src/main.jsx`
  - initializes providers: Clerk, Router, React Query, AuthProvider

### Routing
- `frontend/src/App.jsx`
  - redirects based on `isSignedIn` and `isLoaded`

### State management & API integration
- `frontend/src/providers/AuthProvider.jsx`
  - installs Axios interceptor adding `Authorization` header with Clerk token
- `frontend/src/hooks/useStreamChat.js`
  - fetches Stream token via React Query (`getStreamToken()`)
  - connects user to Stream Chat and sets `chatClient`

### Component hierarchy (Home)
- `HomePage`
  - `Chat` (Stream)
    - Left sidebar
      - `ChannelList`
      - Custom preview: `CustomChannelPreview`
      - DM directory: `UsersList`
    - Main chat area
      - `Channel` (active channel from URL)
        - `Window`
          - `CustomChannelHeader`
          - `MessageList`
          - `MessageInput`
        - `Thread`
    - `CreateChannelModal` conditional

### Component hierarchy (Call)
- `CallPage`
  - `StreamVideo` → `StreamCall` → `CallContent`

---

## 13. API DOCUMENTATION (Analyzed from backend routes)

### Base URL and prefixes
- Backend mounts chat routes under: `/api/chat`
- Frontend calls `/chat/token` relative to `VITE_API_BASE_URL`.

### API endpoint table

| Method | Endpoint | Description | Auth Required | Request Body | Response |
| ------ | -------- | ----------- | ------------- | ------------ | -------- |
| GET | `/api/chat/token` | Generate Stream Chat token for the authenticated Clerk user | Yes | None | `{ token }` |

### Endpoint details

#### Endpoint: Generate Stream Token
- **Purpose**: Provide Stream Chat token so the frontend can connect via Stream Chat SDK.
- **HTTP Method**: GET
- **Route Path**: `/api/chat/token` (implemented as `router.get('/token', ...)` mounted at `/api/chat`)
- **Auth required**: Yes
- **Middleware used**: `protectRoute`

**Request**
- URL params: none
- Query params: none
- Headers:
  - `Authorization: Bearer <Clerk token>` attached by Axios interceptor

**Response**
- Success (200):
  ```json
  { "token": "<stream_token>" }
  ```
- Error (401):
  ```json
  { "message": "Unauthorized - you must be logged in" }
  ```
- Error (500):
  ```json
  { "error": "<error message>" }
  ```

**Flow**
- Route (`chat.route.js`) → Middleware (`auth.middleware.js`) → Controller (`chat.controller.js`) → Service (`stream.js`) → Response

---

## 14. Dependencies Installation

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create/verify `.env`:
   - `PORT`
   - `MONGO_URI`
   - `NODE_ENV`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `STREAM_API_KEY`
   - `STREAM_API_SECRET`
   - `SENTRY_DSN`
   - `INNGEST_EVENT_KEY`
   - `INNGEST_SIGNING_KEY`
   - `CLIENT_URL`
4. `npm run dev`

Important backend dependencies (from `backend/package.json`):
- `express`, `cors`, `mongoose`
- `@clerk/express`
- `stream-chat`
- `inngest`
- `@sentry/node`, `dotenv`, `cross-env`, `nodemon`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create/verify `.env` for Vite:
   - `VITE_API_BASE_URL`
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SENTRY_DSN`
   - `VITE_STREAM_API_KEY`
4. `npm run dev`

Main frontend dependencies (from `frontend/package.json`):
- `react`, `react-dom`, `react-router`
- `@clerk/clerk-react`, `@sentry/react`
- `@tanstack/react-query`, `axios`
- `stream-chat`, `stream-chat-react`, `@stream-io/video-react-sdk`
- `react-hot-toast`, `lucide-react`, `tailwindcss` tooling

---

## 15. Environment Variables

### Backend environment variables (`backend/src/config/env.js`)
- `PORT` (default: 5001)
- `MONGO_URI`
- `NODE_ENV`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `STREAM_API_KEY`
- `STREAM_API_SECRET`
- `SENTRY_DSN`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `CLIENT_URL`

### Frontend environment variables (Vite imports)
- `VITE_API_BASE_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_SENTRY_DSN`
- `VITE_STREAM_API_KEY`

> The repo references these names directly; exact values and additional `.env` entries are not enumerated beyond usage in code.

---

## 16. How To Run Project

### Run backend
1. Open terminal.
2. `cd backend`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

Expected behavior:
- Express app starts on `ENV.PORT` when not in production.
- MongoDB connection is established before listening.

### Run frontend
1. In a new terminal:
2. `cd frontend`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

Expected behavior:
- User visits the frontend.
- If signed out, redirects to `/auth`.
- If signed in, connects to Stream via backend token endpoint.

---

## 17. Runtime Flow (After Startup)

1. Frontend loads and initializes Clerk + Sentry.
2. AuthProvider installs Axios interceptor.
3. User signs in (Clerk).
4. HomePage renders.
5. `useStreamChat` fetches Stream token by calling `GET /api/chat/token`.
6. Backend validates authentication and generates Stream token.
7. Frontend connects to Stream Chat; real-time messages load.
8. Users can:
   - create channels
   - invite members
   - start DMs
   - start video calls, which navigates to `/call/:id`
9. In background, Inngest provisions and synchronizes Stream users on Clerk user lifecycle events.

---

## 18. Common Errors & Fixes

### Frontend: Stream token fails
- Symptom: chat UI stuck loading / shows `Something went wrong...`
- Possible causes:
  - `VITE_API_BASE_URL` misconfigured
  - Backend CORS origin mismatch with `ENV.CLIENT_URL`
  - Unauthenticated request to `/api/chat/token`
- Fix:
  - Verify `VITE_API_BASE_URL` points to backend (including scheme/port)
  - Ensure `CLIENT_URL` in backend `.env` matches the frontend origin
  - Confirm Clerk session is loaded (`isLoaded`) before token request

### Backend: MongoDB connection failure
- Symptom: backend process exits on startup
- Possible causes:
  - `MONGO_URI` incorrect or unreachable
- Fix:
  - Validate MongoDB URI and network access

### Backend: CORS errors
- Symptom: browser blocks requests
- Fix:
  - Set `CLIENT_URL` properly in `backend/.env`

### Stream token generation errors
- Symptom: server responds 500 with `{ error: ... }`
- Fix:
  - Validate `STREAM_API_KEY` and `STREAM_API_SECRET`

### Inngest not working
- Symptom: users not created/synced into Mongo/Stream
- Fix:
  - Validate `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`
  - Ensure Inngest endpoint is reachable at `/api/inngest`

---

## 19. Developer Notes

### Scalability improvements
- Cache Stream token requests per session if token lifespan allows (reduce token endpoint load).
- Add pagination/limits for user queries and channel discovery where appropriate.

### Performance suggestions
- `UsersList` uses React Query with `staleTime: 5 minutes` (good baseline). Consider:
  - reducing query frequency under slow networks
  - memoizing derived channelId computations
- Consider debouncing channel search inputs (not present in current code; only channel creation exists).

### Security improvements
- Ensure backend CORS is strictly configured to match the production frontend URL.
- Standardize error payloads and avoid returning raw `error.message` from 500 in production.

---

Author: Yash Lagare
