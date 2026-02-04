# The Love Sync Protocol - Implementation Plan ("Skeleton First" Edition)

## Goal Description
Build "The Love Sync Protocol," a playful, synchronized web experience.
**Architecture Change**: We are using a **"Skeleton First"** approach. The *first* step is to build a fully deployed, connected "Lobby" that handles all routing and Firebase connections. Subsequent features (Toast, Ghost, Pact) will be built *inside* this existing live skeleton to prevent "Integration Hell."

## User Review Required
> [!IMPORTANT]
> **Deployment First Strategy**: we will deploy to Vercel and connect Firebase in **Block 1**.
> **Action Required**: The user must be ready to create a Firebase project and copy keys immediately upon starting Block 1.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **State/Logic**: React Context (Global "GameContext")
- **Backend**: Firebase Realtime Database
- **Deployment**: Vercel (Connected in Step 1)

## Quality Assurance ("Bug Zero" Protocol)
To ensure robustness for a non-coder maintainer:
- **Linting**: Every phase must pass `npm run lint` before completion.
- **Type Safety**: TypeScript is enforced to prevent "undefined is not a function" errors.
- **Auto-Save**: Critical user data (letters) must auto-save to local storage.
- **Mobile First**: All UI elements are tested against `dvh` (Dynamic Viewport Height) to prevent Safari bar issues.

## Development Phasing

### Block 1: The Connected Skeleton (Agent A)
*The most critical phase. Do not proceed until this is live.*
- **Goal**: Initialize project, setup Tailwind, **Connect Firebase**, **Setup Vercel**, and build the Global "GameContext" & Router.
- **Deliverable**: A live Vercel URL where 2 users can join a "Lobby" and see each other's status change in real-time.
- **Key Tasks**:
    - Initialize Git repository and first commit.
    - Project Init & Tailwind Setup (Vite already initialized).
    - Create `GameContext` (User ID, Partner ID, Current Phase).
    - Setup Firebase connection.
    - Create placeholder pages for Phase 1, 2, 3.
    - **PUSH TO GITHUB & DEPLOY TO VERCEL**.

### Block 2: The Janky Emoji Toast (Agent B)
- **Goal**: Build the pouring minigame *inside* the Phase 1 placeholder.
- **Context**: Use the existing `useGameContext()` to sync "Glass Fill Level".
- **Key Tasks**: Emoji animations, "Fill" logic, Sync trigger when full.

### Block 3: The Ghost Writer (Agent C)
- **Goal**: Build the time capsule *inside* the Phase 2 placeholder.
- **Context**: Use existing `currentUser` to save letters to `/letters/{userId}`.
- **Key Tasks**: Typewriter UI, Sticker drag-and-drop, "Lock" mechanism.

### Block 4: The Growth Pact (Agent D)
- **Goal**: Build the contract generator *inside* the Phase 3 placeholder.
- **Context**: Read data from Phase 2 (optional) or start fresh.
- **Key Tasks**: Goal inputs, Card flip aimation, `window.print()` styling for PDF generation.

### Block 5: Polish & Verify (Agent E)
- **Goal**: Visual polish and final walkthrough.
- **Key Tasks**: Smooth transitions between routes, mobile browser styling fixes (dvh), final E2E test.
