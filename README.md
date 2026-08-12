# Connectify - Enterprise Real-Time Communication & Video Collaboration Platform

### Project Description
Connectify is a full-stack, enterprise-grade real-time collaboration application combining high-performance messaging (channels, direct messaging, unread badges, pinned messages, media lightbox, custom emoji status, and AI thread summarization) with lightweight, 1-click video calling and Discord-style instant audio huddles.

### Business Problem Solved
Modern hybrid teams require seamless, low-latency messaging and rapid video/voice call initiation without leaving their workplace workflow. Connectify eliminates context switching by combining real-time text channels, voice huddles, and Stream Video calls under a unified, Clerk-authenticated infrastructure.

### Target Users
- Distributed product engineering and design teams requiring low-latency chat and voice huddles.
- Enterprise workgroups needing authenticated, channel-based communication.
- Remote collaborators seeking integrated 1-click video room creation.

### Key Benefits
- Seamless Clerk authentication with automatic backend event synchronization via Inngest.
- Low-latency real-time chat powered by Stream Chat SDK.
- 1-click Stream Video call creation directly within channels.
- Discord-style instant Audio Huddle channels with live audio waveforms.
- Zero-dependency Web Audio API sound synthesis and full-screen Image Lightbox.
- Dark/Light Theme Engine with custom glassmorphic styling and Command Palette search (`Cmd+K` / `Ctrl+K`).
- AI Channel & Thread Summarization.

Project Screenshot Placeholder:

<img width="1892" height="904" alt="connectify" src="https://github.com/user-attachments/assets/c2f3f293-7b57-44b5-a245-e25c9975bedf" />


---

## Recent Changes (Dev notes)

- Fixed OpenRouter integration: backend now calls the correct API base `https://openrouter.ai/api/v1` and exposes a protected summarization endpoint at `POST /api/chat/summarize` (server-only, keeps API key secret).
- Moved `OPENROUTER_API_KEY` to backend `.env` — do NOT store secrets in the frontend `.env` (Vite environment files are bundled client-side).
- Improved sidebar layout CSS to prevent channel/DM list clipping and ensure the last item remains visible (added `min-height:0` and bottom padding to the channel list container).
- Frontend `AISummaryModal` now calls the backend summarization route instead of embedding AI keys in the browser.
- Added deployment guidance for separate Vercel frontend and backend apps: set `VITE_API_BASE_URL` in frontend env to the backend URL, and set `CLIENT_URL` plus `OPENROUTER_API_KEY` in backend env.
- Example production setup:
  - Frontend Vercel env: `VITE_API_BASE_URL=https://connectify-backend.vercel.app/api`
  - Backend Vercel env: `CLIENT_URL=https://connectify-frontend.vercel.app`, `OPENROUTER_API_KEY=<your-secret>`


# 1. EXECUTIVE SUMMARY

## Project Purpose
Connectify delivers a unified, authenticated workplace messaging platform with real-time text channels, direct messages, voice huddles, and video calling.

## Core Features
- Authentication-gated interface managed by Clerk (`@clerk/clerk-react` and `@clerk/express`).
- Stream Chat integration for channels, direct messages, unread counters, and member lists.
- Stream Video SDK integration for high-definition video calling at `/call/:id`.
- Discord-style 1-Click Audio Huddles with sticky bottom control bar and active speaker waveform animations.
- Command Palette Search (`Cmd+K` / `Ctrl+K`) for rapid navigation across channels, users, and actions.
- AI Channel Summarizer generating discussion breakdowns and key action items.
- Custom User Status modal with emoji presets and real-time presence indicators.
- Full-screen Image Lightbox modal with zoom, reset, and download capabilities.
- Zero-dependency Web Audio API synthesizer for instant UI sound feedback.
- Automated user synchronization between Clerk, MongoDB Atlas, and Stream Chat via Inngest webhooks.

## Technology Summary
- **Frontend**: React 19, Vite 7, React Router 7, TailwindCSS 4, TanStack Query 5, Stream Chat React SDK, Stream Video SDK, Framer Motion, Lucide Icons, Sentry React SDK.
- **Backend**: Node.js (ESM), Express 5, Clerk Express Middleware, Stream Chat Node SDK, Mongoose ODM, Inngest Webhook Engine, Sentry Node SDK.
- **Database**: MongoDB Atlas via Mongoose schema validation.

## Architecture Overview

```text
User Browser
   │
   ▼
Frontend (React 19 + Vite + Stream SDKs)
   │
   ├─► Clerk Authentication API
   ├─► Stream Chat & Stream Video Edge Network
   └─► Connectify Backend (Express 5 REST API)
           │
           ├─► Mongo DB (Mongoose ODM User Sync)
           └─► Inngest Webhook Service (Async Event Processing)
```

## Business Value
Reduces engineering overhead by leveraging enterprise-grade SaaS primitives (Stream Chat/Video, Clerk) while retaining full control over custom business logic, database persistence, and user event synchronization.

---

# 2. PROJECT OVERVIEW

## Objective
Provide an authenticated, real-time messaging and video conferencing application built with enterprise-grade frontend aesthetics and resilient backend architecture.

## Scope
- **Implemented**:
  - React single-page application with responsive glassmorphism UI.
  - Express REST API issuing JWT tokens for Stream Chat.
  - Clerk auth integration with route guards and session management.
  - Async event handler syncing Clerk user events (`user.created`, `user.deleted`) to MongoDB and Stream Chat.
  - Video calling route at `/call/:id` utilizing Stream Video SDK.
  - Sticky Audio Huddle bar for voice channels.
  - Command Palette Search (`Cmd+K`), Image Lightbox, AI Channel Summaries, and Custom User Status.
- **Not Implemented**:
  - Custom password-reset endpoints (delegated entirely to Clerk).
  - Billing/Stripe subscription layer.

## Main Functionalities
1. Authentication via Clerk (Google, GitHub, Email/Password).
2. Authenticated retrieval of Stream Chat tokens via backend API `/api/chat/token`.
3. Real-time channel list rendering with unread message badges.
4. Channel creation (Public & Private) with member invitation controls.
5. Direct messaging user discovery list.
6. Custom channel header featuring member counts, pinned message viewer, invite modal, and video call trigger.
7. Stream Video call execution on route `/call/:id`.
8. Command Palette Search (`Cmd+K` / `Ctrl+K`).
9. AI Channel & Thread Summarization with action item extraction.
10. Discord-style Audio Huddle bar with live waveform animation and mic/screen share toggles.

## Business Use Case
A remote team requires an authenticated, internal workspace to collaborate in public/private channels, send direct messages, join voice huddles, and initiate video meetings without third-party app switching.

## Target Audience
Teams, organizations, and developers seeking an open-architecture, production-ready workplace messaging platform.

Project Screenshot Placeholder:

<img width="1822" height="911" alt="image" src="https://github.com/user-attachments/assets/bcdf0e42-d402-4856-a728-9ea4f7d04e8f" />


---

# 3. TECHNOLOGY STACK

## Frontend

| Area | Implemented Technology | Version |
|---|---|---|
| Framework | React | ^19.2.0 |
| Build Tool | Vite | ^7.2.4 |
| Routing | React Router | ^7.6.3 |
| Styling | TailwindCSS | ^4.2.4 |
| Data Fetching | TanStack Query (React Query) | ^5.83.0 |
| Chat SDK | `stream-chat-react` & `stream-chat` | ^13.3.0 / ^9.14.0 |
| Video SDK | `@stream-io/video-react-sdk` | ^1.19.2 |
| Authentication SDK | `@clerk/clerk-react` | ^5.37.0 |
| Icons | `lucide-react` | ^1.14.0 |
| Error Monitoring | `@sentry/react` | ^10.1.0 |
| Toast Notifications | `react-hot-toast` | ^2.5.2 |
| Animations | `framer-motion` | ^12.38.0 |

## Backend

| Area | Implemented Technology | Version |
|---|---|---|
| Runtime | Node.js (ESM Module Mode) | v20+ |
| Web Framework | Express | ^5.1.0 |
| Authentication Middleware | `@clerk/express` | ^1.7.4 |
| Chat Token SDK | `stream-chat` | ^8.60.0 |
| Database ODM | `mongoose` | ^8.16.5 |
| Async Event Engine | `inngest` | ^3.54.0 |
| Error Monitoring | `@sentry/node` | ^10.1.0 |
| Environment Loader | `dotenv` & `cross-env` | ^17.2.1 / ^10.1.0 |

## Database

- **Database Type**: MongoDB Atlas (Cloud NoSQL Database)
- **ODM**: Mongoose 8
- **Storage Strategy**:
  - `User` collection stores synchronized user profile data (`clerkId`, `email`, `name`, `image`).
  - Channel messaging history and member lists are persisted on Stream Chat's real-time edge storage.

## Authentication

- **Provider**: **Clerk** (`@clerk/clerk-react` on frontend, `@clerk/express` on backend).
- **Backend Guard**: Express middleware verifies Clerk session using `req.auth().isAuthenticated`.
- **Chat Access**: Protected endpoint `/api/chat/token` issues signed Stream Chat tokens for authenticated Clerk user IDs.

## DevOps & Deployment

- **Hosting**: Vercel Serverless Functions (`vercel.json` configured for both frontend and backend).
- **Event Relay**: Inngest Cloud serving webhooks at `/api/inngest`.
- **Error Tracking**: Sentry monitoring configured on client and server runtimes.

---

# 4. FEATURES LIST

| Feature Name | Purpose | User Benefit | Related Components |
|---|---|---|---|
| Clerk Protected Routing | Gates app navigation based on sign-in status | Secure workspace access | [App.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/App.jsx), [AuthPage.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/pages/AuthPage.jsx) |
| Stream Chat Token Fetch | Issues signed Stream Chat tokens via backend API | Secure messaging connection | [api.js](file:///d:/MY-PROJECTS/Connectify/frontend/src/lib/api.js), [chat.route.js](file:///d:/MY-PROJECTS/Connectify/backend/src/routes/chat.route.js) |
| Channel & DM Sidebar | Lists active channels and direct messaging targets | Rapid conversation navigation | [HomePage.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/pages/HomePage.jsx), [CustomChannelPreview.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/CustomChannelPreview.jsx) |
| Channel Creation Modal | Allows creating public or private channels | Custom team workspace setup | [CreateChannelModal.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/CreateChannelModal.jsx) |
| Custom Channel Header | Shows channel name, member count, pinned messages, & call button | In-channel actions & stats | [CustomChannelHeader.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/CustomChannelHeader.jsx) |
| Stream Video Call Room | Initiates and joins video calls with screen share & grid controls | Seamless face-to-face meetings | [CallPage.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/pages/CallPage.jsx), [CallContent.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/CallContent.jsx) |
| 1-Click Audio Huddles | Joins sticky voice channels with live audio waveforms | Instant voice huddle without page changes | [AudioHuddleBar.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/AudioHuddleBar.jsx) |
| Command Palette (`Cmd+K`) | Keyboard search across channels, users, & call actions | High-speed workspace search | [CommandKModal.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/CommandKModal.jsx) |
| AI Channel Summarizer | Generates message breakdowns and task checklists | Rapid catch-up on long threads | [AISummaryModal.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/AISummaryModal.jsx) |
| Custom User Status | Allows setting custom status with emoji presets | Transparent presence sharing | [UserStatusModal.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/UserStatusModal.jsx) |
| Full-Screen Image Lightbox | Image modal with zoom in/out, reset, and download | High-res media previewing | [ImageLightbox.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/components/ImageLightbox.jsx) |
| Dark/Light Theme Engine | Toggles theme tokens and glassmorphism styling | Custom visual ergonomics | [ThemeContext.jsx](file:///d:/MY-PROJECTS/Connectify/frontend/src/context/ThemeContext.jsx), [index.css](file:///d:/MY-PROJECTS/Connectify/frontend/src/index.css) |
| Web Audio Sound FX | Synthesizes audio tones for send, receive, and call joins | Tactile UI feedback | [sounds.js](file:///d:/MY-PROJECTS/Connectify/frontend/src/lib/sounds.js) |


---

# 5. FOLDER STRUCTURE

```text
Connectify/
├── backend/
│   ├── src/
│   │   ├── DB/
│   │   │   └── db.js                 # MongoDB connection logic via Mongoose
│   │   ├── config/
│   │   │   ├── env.js                # Environment variable schema & validation
│   │   │   ├── inngest.js            # Inngest client & event handler functions
│   │   │   └── stream.js             # Stream Chat server client & user management
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # Clerk session authentication guard
│   │   │   └── chat.controller.js    # Controller issuing Stream Chat JWT tokens
│   │   ├── models/
│   │   │   └── user.model.js         # Mongoose User schema definition
│   │   ├── routes/
│   │   │   └── chat.route.js         # Protected REST endpoint for chat tokens
│   │   └── server.js                 # Express app initialization & server entry point
│   ├── instrument.mjs                # Sentry backend instrumentation
│   ├── package.json                  # Backend dependencies & scripts
│   └── vercel.json                   # Vercel backend serverless configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AISummaryModal.jsx    # AI Thread summary generator modal
│   │   │   ├── AudioHuddleBar.jsx    # Sticky Discord-style audio huddle bar
│   │   │   ├── CallContent.jsx       # Stream Video calling UI controls
│   │   │   ├── ChannelListError.jsx  # Channel list error fallback view
│   │   │   ├── ChannelListLoading.jsx# Channel list skeleton loading state
│   │   │   ├── CommandKModal.jsx     # Cmd+K global search modal palette
│   │   │   ├── CreateChannelModal.jsx# Channel creation modal dialog
│   │   │   ├── CustomChannelHeader.jsx# Channel header with call & action triggers
│   │   │   ├── CustomChannelPreview.jsx# Channel item preview card
│   │   │   ├── EmptyChannelState.jsx # Empty state UI card
│   │   │   ├── ImageLightbox.jsx     # Full-screen image preview lightbox
│   │   │   ├── InviteModal.jsx       # Member invitation modal for private channels
│   │   │   ├── MembersModal.jsx      # Channel member list modal
│   │   │   ├── MobileSidebar.jsx     # Responsive mobile navigation drawer
│   │   │   ├── PageLoader.jsx        # Full-page spinner loader
│   │   │   ├── PinnedMessagesModal.jsx# Pinned messages overview modal
│   │   │   ├── UsersList.jsx         # Direct messaging target user list
│   │   │   └── UserStatusModal.jsx   # Custom emoji status setter modal
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # Dark/Light theme & sound FX state provider
│   │   ├── hooks/
│   │   │   └── useStreamChat.js      # Custom React hook connecting Stream Chat
│   │   ├── lib/
│   │   │   ├── api.js                # Axios REST client fetching Stream tokens
│   │   │   └── sounds.js             # Zero-dependency Web Audio API synthesizer
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx          # Clerk sign-in / sign-up auth page
│   │   │   ├── CallPage.jsx          # Stream Video call room page
│   │   │   └── HomePage.jsx          # Main workspace dashboard & chat container
│   │   ├── providers/
│   │   │   └── AuthProvider.jsx      # Auth verification wrapper
│   │   ├── styles/
│   │   │   ├── auth.css              # Authentication page styles
│   │   │   └── stream-chat-theme.css # Master glassmorphic CSS overrides for Stream
│   │   ├── App.jsx                   # React Router route configuration
│   │   ├── index.css                 # TailwindCSS base directives & theme variables
│   │   └── main.jsx                  # Application entry point & provider tree
│   ├── package.json                  # Frontend dependencies & build scripts
│   └── vite.config.js                # Vite build configuration
├── PROJECT_DOCUMENTATION.md          # Comprehensive Master Project Documentation
└── README.md                         # Repository Readme file
```

---

# 6. SYSTEM ARCHITECTURE

```text
User Browser (React 19 SPA)
   │
   ├─► Clerk Authentication API
   │      │
   │      └─► Webhook Events (user.created, user.deleted)
   │              │
   │              ▼
   ├─► Connectify Backend (Express REST API)
   │      │
   │      ├─► MongoDB Atlas (User Collection)
   │      └─► Inngest Webhook Engine (Syncs Users to Database & Stream)
   │
   └─► Stream Edge Network
          ├─► Stream Chat SDK (Real-Time Messaging & Channels)
          └─► Stream Video SDK (WebRTC Audio/Video Calls)
```

## Architecture Pattern
- **Client-Server Architecture**: Separated React SPA frontend and Express REST API backend.
- **Event-Driven Synchronization**: Async event handling using Inngest to sync authentication changes from Clerk into MongoDB and Stream Chat.
- **Decoupled SaaS Primitives**: Externalized real-time messaging and WebRTC video infrastructure to Stream SDKs.

## Request Lifecycle
1. User authenticates via Clerk on frontend.
2. Frontend calls `/api/chat/token` with Clerk session headers.
3. Backend middleware validates Clerk session via `@clerk/express`.
4. Backend generates signed Stream Chat JWT token using server secret.
5. Frontend establishes WebSocket connection to Stream Chat edge network.

---

# 7. DATABASE DESIGN

## Entity: `User`

- **Collection Name**: `users`
- **Purpose**: Persists synchronized user profiles received from Clerk events for directory listing and membership management.

| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | Auto-generated MongoDB primary key |
| `clerkId` | String | Yes | Yes | Primary user identifier issued by Clerk |
| `email` | String | Yes | Yes | User email address |
| `name` | String | Yes | No | Display name (First + Last Name) |
| `image` | String | Yes | No | Avatar URL hosted on Clerk CDN |
| `createdAt` | Date | Auto | No | Creation timestamp generated by Mongoose |
| `updatedAt` | Date | Auto | No | Modification timestamp generated by Mongoose |

---

# 8. ENTITY RELATIONSHIP DIAGRAM (ERD)

```text
+-----------------------------------+
|               USER                |
+-----------------------------------+
| _id       : ObjectId (PK)         |
| clerkId   : String (Unique)       |
| email     : String (Unique)       |
| name      : String                |
| image     : String                |
| createdAt : Date                  |
| updatedAt : Date                  |
+-----------------------------------+
                  │
                  │ 1:N Sync
                  ▼
+-----------------------------------+
|       STREAM CHAT USER (EDGE)     |
+-----------------------------------+
| id        : String (clerkId)      |
| name      : String                |
| image     : String                |
+-----------------------------------+
```

---

# 9. SECURITY ARCHITECTURE

- **Authentication**: Managed via Clerk OAuth and passwordless authentication.
- **Authorization**: Backend REST endpoints enforce session verification using `req.auth().isAuthenticated`.
- **Stream Token Security**: Stream Chat server secret is stored exclusively on backend environment variables (`STREAM_SECRET_KEY`); client tokens are generated server-side.
- **CORS Configuration**: Restricts origin requests strictly to `ENV.CLIENT_URL` with `credentials: true`.
- **Environment Isolation**: Sensitive credentials (`CLERK_SECRET_KEY`, `STREAM_SECRET_KEY`, `MONGODB_URI`) are strictly loaded via server-side process environment variables.

---

# 10. AUTHENTICATION FLOW

```text
User Login Action (Frontend)
           │
           ▼
Clerk SDK Authenticates User
           │
           ▼
Client Fetches Stream Token (/api/chat/token)
           │
           ▼
Express Server (`clerkMiddleware`) Verifies Session
           │
           ▼
Stream Chat Server SDK Signs JWT Token
           │
           ▼
Frontend Connects WebSocket to Stream Chat Network
```

---

# 11. APPLICATION FLOW

```text
Application Startup
       │
       ▼
Check Clerk Authentication (`useAuth`)
       │
   ┌───┴───────────────────────┐
   ▼                           ▼
Authenticated            Unauthenticated
   │                           │
   ▼                           ▼
Fetch Stream Token      Redirect to /auth
   │                           │
   ▼                           ▼
Connect Stream Chat      Render Clerk SignIn Component
   │
   ▼
Render Workspace Dashboard (/home)
   │
   ├─► Select Channel ──► Render Chat Window & Header
   ├─► Click Video Call ──► Open /call/:id (Stream Video)
   ├─► Click Audio Huddle ──► Attach Sticky AudioHuddleBar
   └─► Press Cmd+K ──► Open CommandKModal Search
```

---

# 12. BACKEND INTERNAL FLOW

```text
HTTP GET /api/chat/token
           │
           ▼
`clerkMiddleware()` Populates `req.auth()`
           │
           ▼
`protectRoute` Checks `req.auth().isAuthenticated`
           │
     ┌─────┴─────────────────────┐
     ▼                           ▼
Is Authorized               Unauthorized
     │                           │
     ▼                           ▼
`getStreamToken()`          Return 401 JSON
     │
     ▼
Generate Signed Token (`generateStreamToken`)
     │
     ▼
Return HTTP 200 `{ token: "..." }`
```

---

# 13. FRONTEND INTERNAL FLOW

```text
[main.jsx] Entry Point
       │
       ▼
[ClerkProvider] -> [QueryClientProvider] -> [AuthProvider] -> [ThemeProvider]
       │
       ▼
[App.jsx] Router Engine
       │
       ├─► Route /auth ──► [AuthPage.jsx]
       ├─► Route /call/:id ──► [CallPage.jsx]
       └─► Route / ──► [HomePage.jsx]
                             │
                             ├─► [useStreamChat] Hook
                             ├─► [ChannelList] Sidebar
                             ├─► [CustomChannelHeader]
                             └─► [MessageList] + [MessageInput]
```

---

# 14. API DOCUMENTATION

| Method | Endpoint | Description | Auth Required | Request Body | Success Response |
|---|---|---|---|---|---|
| `GET` | `/` | Backend Health Check | No | None | `"backend is working!"` |
| `GET` | `/debug-sentry` | Sentry Error Handler Test | No | None | `"Hello error"` |
| `GET` | `/api/chat/token` | Fetch signed Stream Chat JWT | Yes (Clerk) | None | `{ "token": "JWT_STRING" }` |
| `POST` | `/api/inngest` | Inngest Webhook Endpoint | Signature Verified | Clerk Event Data | Event Acknowledgment |

### Endpoint: `GET /api/chat/token`
- **Purpose**: Generates signed Stream Chat JWT token for the authenticated user.
- **Authentication**: Required (Valid Clerk Session).
- **Middleware**: `clerkMiddleware()`, `protectRoute`.
- **Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Error Response (401 Unauthorized)**:
```json
{
  "message": "Unauthorized - you must be logged in"
}
```

---

# 15. THIRD-PARTY INTEGRATIONS

- **Clerk**: User authentication, session management, OAuth providers, and user management UI components.
- **Stream Chat**: Infrastructure for real-time messaging, channels, unread counts, pinned messages, and threads.
- **Stream Video**: WebRTC infrastructure for room creation, grid/speaker views, screen sharing, and call controls.
- **Inngest**: Background event routing engine processing Clerk webhooks to keep MongoDB and Stream Chat in sync.
- **Sentry**: Full-stack application monitoring and automatic exception tracking for frontend and backend.
- **MongoDB Atlas**: Cloud database storing user profiles.

---

# 16. ENVIRONMENT VARIABLES

## Backend Environment Variables (`backend/.env`)

| Variable | Purpose | Required |
|---|---|---|
| `PORT` | Local Express server port (default 5000) | Yes |
| `CLIENT_URL` | Frontend client origin for CORS configuration | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `STREAM_API_KEY` | Stream Chat public API key | Yes |
| `STREAM_SECRET_KEY` | Stream Chat secret key for signing tokens | Yes |
| `CLERK_PUBLISHABLE_KEY` | Clerk public API key | Yes |
| `CLERK_SECRET_KEY` | Clerk backend secret key | Yes |
| `SENTRY_DSN` | Sentry backend error monitoring DSN | Yes |

## Frontend Environment Variables (`frontend/.env`)

| Variable | Purpose | Required |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Public Clerk publishable key for React SDK | Yes |
| `VITE_STREAM_API_KEY` | Public Stream API key for React Chat & Video SDKs | Yes |
| `VITE_API_URL` | Connectify backend API URL (`http://localhost:5000/api`) | Yes |
| `VITE_SENTRY_DSN` | Sentry frontend error monitoring DSN | Yes |

---

# 17. DEPENDENCIES

## Frontend Dependencies
- `react`, `react-dom`: Core UI library.
- `@clerk/clerk-react`: Authentication components and hooks.
- `stream-chat-react`, `stream-chat`: Stream Chat UI components and API client.
- `@stream-io/video-react-sdk`: Stream Video calling components.
- `tailwindcss`, `@tailwindcss/vite`: Utility-first CSS styling framework.
- `@tanstack/react-query`: Server-state fetching and caching.
- `lucide-react`: Icon set for visual controls.
- `framer-motion`: Fluid UI micro-animations.
- `react-hot-toast`: Toast notifications.
- `@sentry/react`: Frontend error monitoring.

## Backend Dependencies
- `express`: Web server framework.
- `@clerk/express`: Clerk authentication middleware.
- `mongoose`: MongoDB ODM schema builder.
- `stream-chat`: Stream Chat server SDK for token generation and user management.
- `inngest`: Background event execution engine.
- `@sentry/node`: Backend exception tracking.
- `cors`: Cross-origin resource sharing middleware.

---

# 18. INSTALLATION GUIDE

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB Database URI
- Clerk Account (Publishable Key & Secret Key)
- Stream Account (API Key & Secret Key)

### Step 1: Clone Repository
```bash
git clone https://github.com/YashLagare/Connectify.git
cd Connectify
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Backend Environment
Create `backend/.env` file:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
SENTRY_DSN=your_sentry_dsn
```

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 5: Configure Frontend Environment
Create `frontend/.env` file:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_URL=http://localhost:5000/api
VITE_SENTRY_DSN=your_sentry_dsn
```

### Step 6: Start Application in Development Mode

Run Backend:
```bash
cd ../backend
npm run dev
```

Run Frontend:
```bash
cd ../frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

# 19. DEPLOYMENT GUIDE

## Vercel Deployment

Both `frontend/` and `backend/` directories include pre-configured `vercel.json` files for instant one-click deployment.

### Deploying Backend
1. Connect `backend/` directory to a new Vercel Project.
2. Environment Variables: Add all keys from `backend/.env`.
3. Output directory: Standard Node.js Serverless Function.

### Deploying Frontend
1. Connect `frontend/` directory to a Vercel Project.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables: Set `VITE_API_URL` to your production backend URL.

---

# 20. RUNTIME FLOW

```text
User Sends Message (Client)
           │
           ▼
Stream Chat WebSocket Sends Payload to Edge
           │
           ▼
Edge Broadcasts Event to Channel Subscribers
           │
           ▼
Subscribers Receive Event (`message.new`)
           │
           ▼
Connectify `soundFX.playReceive()` Plays Chime
           │
           ▼
React Component Updates Message List UI
```

---

# 21. CHALLENGES & LEARNINGS

## Technical Challenges
- **Event Synchronization**: Ensuring real-time consistency between Clerk authentication events, MongoDB Atlas, and Stream Chat user objects without latency.
- **Solution**: Built an asynchronous event handler using Inngest webhooks (`clerk/user.created`, `clerk/user.deleted`) to ensure atomic database writes and Stream user upserts.
- **UI Customization**: Overriding Stream Chat default styles to implement glassmorphism themes without breaking Stream's core layout mechanics.
- **Solution**: Created a structured CSS token layer in `index.css` and `stream-chat-theme.css`.

---

# 22. COMMON ERRORS & TROUBLESHOOTING

| Symptom | Cause | Resolution |
|---|---|---|
| `401 Unauthorized` on `/api/chat/token` | Missing or invalid Clerk session token in request | Ensure user is signed in via Clerk before fetching chat token |
| `Stream Chat connection error` | Incorrect `VITE_STREAM_API_KEY` or missing backend token | Verify Stream credentials in both `.env` files |
| `MongoDB connection failure` | IP whitelist restriction or invalid connection string | Update MongoDB Atlas Network Access rules to allow server IP |
| `Inngest webhook fails` | Inngest signing secret missing or invalid event payload | Check Inngest dashboard logs and verify event schemas |

---

# 23. PERFORMANCE ANALYSIS

- **Lighthouse Score**: High performance achieved through Vite ES module bundling and component code-splitting.
- **Real-Time Efficiency**: Outsourcing WebSocket state management to Stream Chat edge network reduces backend memory overhead to near zero.
- **Styling Overhead**: Single Tailwind v4 bundle build ensures low CSS file weight (< 80kB gzipped).

---

# 24. SECURITY REVIEW

- **Strict Access Control**: Route authentication verified on both frontend (`useAuth`) and backend (`protectRoute`).
- **Secret Isolation**: `STREAM_SECRET_KEY` and `CLERK_SECRET_KEY` are never exposed to the client bundle.
- **CORS Protection**: Access strictly restricted to configured client origin.

---

# 25. FUTURE ENHANCEMENTS

- **Web Push Notifications**: Service Worker integration for background browser notifications.
- **Screen Recording**: In-call recording capabilities for Stream Video meetings.
- **Multi-Tenant Workspaces**: Organization-based channel separation and RBAC permissions.

---

# 26. DEVELOPER NOTES

- **Architecture Choice**: Utilizing SaaS building blocks (Clerk + Stream + Inngest) allowed focusing on premium UX polish and domain-specific feature building.
- **Maintainability**: Clear separation of concern between `components/`, `hooks/`, `context/`, and `pages/`.

---

Written by Yash Lagare
