# Amended Product Spec: "The Love Sync Protocol"

## Core Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Firebase Realtime Database
- **Styling**: Tailwind CSS + `animate.css`
- **Deployment**: Vercel + Firebase (Manual Config required)

## Amendments & Corrections

### 1. Deployment Strategy ("The One-Click Requirement")
- **Original**: "One-click" setup involving just copying API keys.
- **Correction**: **"Low-Code, 3-Step Setup"**.
    - **Why**: Firebase projects cannot be automatically created via Vercel env vars. The user MUST create the project in the Firebase Console first to *get* the keys.
    - **Revised Workflow**:
        1.  User deploys frontend to Vercel (Git integration).
        2.  User creates Firebase project (Google Console) & copies config object.
        3.  User pastes config values into Vercel Environment Variables.

### 2. Phase 1: The Janky Emoji Toast
- **Addition**: **Touch Support**.
    - **Why**: "Video call" context implies mobile usage. ensure `onTouchStart` and `onTouchEnd` are mapped to pouring logic.

### 3. Phase 2: The Ghost Writer
- **Refinement**: **Sticker "Robustness"**.
    - Confirming the use of CSS `position: fixed` or `absolute` with `%` based coordinates (vw/vh) for responsiveness.
