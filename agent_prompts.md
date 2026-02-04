# Master Prompts for Multi-Agent Execution ("Skeleton First" + Bug Zero Protocol)

This document contains 5 distinct "Master Prompts" designed to be given to separate AI agents.

---

## Global Instructions (Apply to ALL Agents)
**Protocol**: "Bug Zero"
1.  **Lint First**: Before reporting *any* task as complete, you MUST run `npm run lint` and fix all errors.
2.  **Type Safety**: Use TypeScript interfaces for all props and context values. No `any`.
3.  **React Patterns**:
    - **No Prop Drilling**: Use the provided `GameContext` or standard composition.
    - **Custom Hooks**: Extract complex logic (pouring physics, drag-and-drop) into custom hooks (e.g., `usePouringLogic`).
    - **Component Purity**: Keep components small. One file = One Component.

---

## Block 1: The Connected Skeleton (Agent A)
**Goal**: Build the **entire infrastructure** with zero defects.
**Tech**: React (Vite) + Tailwind CSS + Firebase.
**Verification Required**:
1.  `npm run lint` passes.
2.  **Vercel Deployment** is live and accessible.
3.  **Database Connection Test**: A user can click a button and update a value in Firebase that another user sees instantly.

**Detailed Tasks**:
1.  Init React + Vite + Tailwind + **ESLint**.
2.  Create `GameContext` (stores `userId`, `roomID`, `partnerId`, `phase`).
    - *Constraint*: Use an `enum` for `phase` (`LOBBY`, `TOAST`, `WRITER`, `PACT`).
3.  Setup Firebase:
    - Create `firebase.json` with basic Security Rules (allow read/write for now, but valid syntax).
    - Connect it to `GameContext`.
4.  Create EMPTY wrapper components: `<ToastPhase />`, `<WriterPhase />`, `<PactPhase />`.
5.  **DEPLOY to Vercel**.

---

## Block 2: The Janky Emoji Toast (Agent B)
**Goal**: Build the "Toast" game *inside* `<ToastPhase />`.
**Constraint**: Use `useGameContext()` to sync state. Do NOT create new Firebase listeners.
**Bug Prevention**:
- **Mobile Safari Check**: Ensure the "Toast" button is visible on iOS (use `dvh` units).
- **Physics Logic**: Isolate the "shake" detection or "fill" logic into a `useGlassFill` hook. Test it in isolation.

---

## Block 3: The Ghost Writer Module (Agent C)
**Goal**: Build the letter writer *inside* `<WriterPhase />`.
**Constraint**: Read `currentUser` from context. Save data to `/letters/{roomID}/{userId}`.
**Bug Prevention**:
- **Input Loss**: Auto-save the letter every 5 seconds to `localStorage` in case of browser refresh.
- **Visual Bugs**: Use `overflow-hidden` on the "Paper" container to prevent stickers from breaking the layout.

---

## Block 4: The Growth Pact Module (Agent D)
**Goal**: Build the contract generator *inside* `<PactPhase />`.
**Constraint**: Use standard CSS `@media print` for the PDF generation.
**Bug Prevention**:
- **Cross-Browser Styling**: Test that the "Signature Canvas" works on Touch devices (verify `onTouchStart` events).
- **Print Safety**: Ensure the print view hides all buttons/navbars using `@media print { .no-print { display: none; } }`.

---

## Block 5: Polish & Verify (Agent E)
**Goal**: Final visual polish & Lockdown.
**Tasks**:
1.  **Security Rules**: Update Firebase rules to only allow writes to `/rooms/{roomID}` if user is a member.
2.  **E2E Smoke Test**:
    - Simulate User A and User B joining the same room.
    - Verify Phase transitions sync instantly.
    - Verify Refreshing the page does NOT lose the current Phase.
3.  **Mobile Polish**: Check for "Rubber Banding" scroll effects on mobile and disable them where necessary.
