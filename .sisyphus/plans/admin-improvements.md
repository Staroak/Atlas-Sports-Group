# Admin Portal Improvements

## TL;DR

> **Quick Summary**: Six improvements to the admin portal — add a public login link, build first-time password setup for invited admins, restructure the program edit form (remove display order, merge tabs, add live card preview), and add per-program registration URLs.
> 
> **Deliverables**:
> - "Login" text link in public site header
> - Auth callback route + set-password page for Supabase invite flow
> - Middleware whitelist for `/admin/set-password`
> - ProgramForm restructured: 2 tabs instead of 3, display order hidden
> - Sticky live card preview on program edit page
> - `registration_url` column + field in form + public site integration
> 
> **Estimated Effort**: Medium-Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: DB migration → Type updates → Registration URL integration → Build verification

---

## Context

### Original Request
User wants six changes:
1. Add a login button to the public site header
2. First-time admin password setup via Supabase invite
3. Remove "display order" from program edit form (keep DB column)
4. Merge Ages & Schedule tab into Basic Info tab
5. Live card preview while editing programs (sticky bottom bar)
6. Editable registration URL per program (default: google.ca)

### Interview Summary
**Key Discussions**:
- Login button: Small, subtle "Login" text link, top-right of header, links to `/admin/login`
- Preview style: Card preview (matching `/programs` listing card), sticky bottom bar
- Display order: Hide from UI only, keep DB column for future drag-drop
- Admin onboarding: No admin users exist yet — need full invite flow
- Registration URL: New text input in form, public "Register Now" buttons use it

**Research Findings**:
- ProgramForm.tsx: 428 lines, 3 tabs, hidden inputs pattern at lines 192-205
- Header.tsx: Stateless, no auth. Desktop nav + mobile hamburger + "Register Now" CTA
- Login page uses client-side `supabase.auth.signInWithPassword()`
- No auth callback route exists — needs to be created for invite flow
- `registration_open` and `registration_message` columns already exist in DB (from prior migration)
- Program card is inline JSX in `programs/page.tsx:71-138`, not a reusable component
- `dbProgramToLegacy()` at `queries/programs.ts:6-24` maps DB fields to frontend

### Metis Review
**Identified Gaps** (addressed):
- Middleware blocks `/admin/set-password` — must whitelist alongside `/admin/login`
- No auth callback route for Supabase invite token exchange — must create `/auth/callback`
- `admin_users` row auto-created on password set — middleware allows `/admin/set-password` without it
- Registration URL appears in 3+ locations on public site — must update all
- Program card not a reusable component — must extract for preview reuse
- `database.ts` types need Row/Insert/Update additions for `registration_url`

---

## Work Objectives

### Core Objective
Improve admin portal usability (login access, form UX, live preview) and enable per-program registration links.

### Concrete Deliverables
- `Header.tsx` with "Login" text link
- `/auth/callback/route.ts` — auth callback for invite token exchange
- `/admin/set-password/page.tsx` — password setup page
- `middleware.ts` — whitelist `/admin/set-password`
- `ProgramForm.tsx` — restructured (2 tabs, no display order, registration URL field)
- `ProgramCard.tsx` — extracted reusable component
- `ProgramForm.tsx` — sticky preview bar using ProgramCard
- DB migration for `registration_url` column
- Updated types, schema, queries, and public site links

### Definition of Done
- [ ] `npm run build` passes with zero errors
- [ ] Login link visible in header, navigates to `/admin/login`
- [ ] `/admin/set-password` renders for invited users
- [ ] Program form has 2 tabs (Basic Info with ages/schedule, Details)
- [ ] Display order input not visible in form
- [ ] Card preview updates live at bottom of edit page
- [ ] Registration URL field in form, public "Register Now" uses it
- [ ] All existing functionality unchanged

### Must Have
- Login link in both desktop and mobile nav
- Auth callback route handles Supabase invite tokens
- Middleware allows `/admin/set-password` without `admin_users` row
- Hidden inputs preserved for all fields (including display_order)
- Registration URL defaults to `https://google.ca` when empty/null

### Must NOT Have (Guardrails)
- Must NOT add auth state awareness to public Header (keep it a plain link)
- Must NOT remove display_order hidden input, useState hook, or server action field
- Must NOT use `supabase.auth.admin.*` from client code (requires service role key)
- Must NOT expand set-password into password reset/forgot password/change password
- Must NOT add URL validation UI, "test URL" button, or analytics to registration URL
- Must NOT add mobile/desktop toggle, zoom, or interactive elements to preview
- Must NOT reorganize the Details tab or reorder existing fields
- Must NOT change `AdminSidebar.tsx` or `AdminHeader.tsx`
- Must NOT break the existing `/registration#slug` flow for programs without custom URLs

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks verifiable WITHOUT any human action.
> Exception: Supabase invite email flow requires manual testing (documented separately).

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO
- **Framework**: None
- **Agent-Executed QA**: ALWAYS (primary verification for all tasks)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — independent changes):
├── Task 1: Add login link to Header.tsx
├── Task 2: Remove display order from ProgramForm
└── Task 3: DB migration — add registration_url column

Wave 2 (After Wave 1):
├── Task 4: Merge Ages/Schedule tab into Basic Info
├── Task 5: Update types + schema + queries for registration_url
└── Task 6: Auth callback route + set-password page + middleware whitelist

Wave 3 (After Wave 2):
├── Task 7: Registration URL field in form + public site integration
├── Task 8: Extract ProgramCard component + sticky live preview
└── Task 9: Final build verification + full QA

Critical Path: Task 3 → Task 5 → Task 7 → Task 9
Parallel Speedup: ~45% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 9 | 2, 3 |
| 2 | None | 4 | 1, 3 |
| 3 | None | 5 | 1, 2 |
| 4 | 2 | 8 | 5, 6 |
| 5 | 3 | 7 | 4, 6 |
| 6 | None | 9 | 4, 5 |
| 7 | 5 | 9 | 8, 6 |
| 8 | 4 | 9 | 7 |
| 9 | 1,4,5,6,7,8 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3 | 3 parallel quick tasks |
| 2 | 4, 5, 6 | 3 parallel tasks (6 is larger) |
| 3 | 7, 8, 9 | 7+8 parallel, then 9 final |

---

## TODOs

- [x] 1. Add "Login" text link to public site Header

  **What to do**:
  - Add a "Login" text link to `app/components/layout/Header.tsx`
  - Desktop nav: Add before the "Register Now" CTA button, styled as a subtle text link (muted color, no button styling)
  - Mobile nav: Add in the mobile menu alongside other nav links
  - Links to `/admin/login`
  - Keep Header stateless — no auth check, no conditional rendering

  **Must NOT do**:
  - Do NOT add Supabase client or auth state to Header
  - Do NOT change existing nav link behavior or styling
  - Do NOT make it a button — it's a text link

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Header styling and responsive nav placement

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 9
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `app/components/layout/Header.tsx:32-47` — Desktop nav links rendering pattern
  - `app/components/layout/Header.tsx:89-108` — Mobile nav links rendering pattern
  - `app/lib/constants.ts` — `NAV_LINKS` array (but don't add Login here — it's not a nav link, it's a utility link)

  **API/Type References**:
  - `app/lib/constants.ts:NAV_LINKS` — Existing nav structure to understand but NOT modify

  **WHY Each Reference Matters**:
  - `Header.tsx:32-47`: Shows where desktop nav items are rendered — add Login link after the nav links but before the Register Now button
  - `Header.tsx:89-108`: Shows mobile menu structure — add Login link at the bottom of mobile nav items

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Login link visible in desktop header
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Wait for: header element visible (timeout: 5s)
      3. Assert: text link "Login" exists in header
      4. Assert: "Login" link href equals "/admin/login"
      5. Assert: "Login" is styled as text (not a button)
      6. Click: "Login" link
      7. Wait for: navigation to /admin/login (timeout: 5s)
      8. Assert: URL is /admin/login
      9. Screenshot: .sisyphus/evidence/task-1-desktop-login.png
    Expected Result: Login text link in header, navigates to admin login
    Evidence: .sisyphus/evidence/task-1-desktop-login.png

  Scenario: Login link visible in mobile header menu
    Tool: Playwright
    Preconditions: Dev server running, viewport set to 375x667 (mobile)
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Resize viewport to 375x667
      3. Click: mobile hamburger menu button
      4. Wait for: mobile menu open (timeout: 3s)
      5. Assert: "Login" link visible in mobile menu
      6. Assert: "Login" link href equals "/admin/login"
      7. Screenshot: .sisyphus/evidence/task-1-mobile-login.png
    Expected Result: Login link in mobile nav menu
    Evidence: .sisyphus/evidence/task-1-mobile-login.png
  ```

  **Commit**: YES
  - Message: `feat(header): add subtle Login text link to public site header`
  - Files: `app/components/layout/Header.tsx`

---

- [x] 2. Remove display order input from ProgramForm UI

  **What to do**:
  - Remove the visible "Display Order" `<div>` block from `ProgramForm.tsx` (approximately lines 299-312)
  - Keep the hidden input at line ~200: `<input type="hidden" name="display_order" value={String(displayOrder)} />`
  - Keep the `displayOrder` useState hook
  - Keep server action handling of `display_order`
  - Keep `reorderPrograms` action for future use

  **Must NOT do**:
  - Do NOT remove the hidden input for display_order
  - Do NOT remove the useState hook for displayOrder
  - Do NOT modify `app/lib/actions/programs.ts`
  - Do NOT modify `database.ts` types

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - No special skills needed — simple JSX deletion

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `app/admin/programs/ProgramForm.tsx:299-312` — The display order `<div>` block to remove
  - `app/admin/programs/ProgramForm.tsx:200` — Hidden input to KEEP (verify it exists after edit)
  - `app/admin/programs/ProgramForm.tsx:43` — `displayOrder` useState hook to KEEP

  **WHY Each Reference Matters**:
  - Lines 299-312: This is the EXACT block to delete — the visible number input with label
  - Line 200: Must verify this hidden input still exists after removal — it ensures display_order is still submitted
  - Line 43: The state hook must remain so the hidden input has a value

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Display order input not visible on new program page
    Tool: Playwright
    Preconditions: Dev server running, admin logged in
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Wait for: form visible (timeout: 5s)
      3. Take snapshot of page
      4. Assert: text "Display Order" NOT present in page snapshot
      5. Assert: number input for display order NOT visible
      6. Screenshot: .sisyphus/evidence/task-2-no-display-order.png
    Expected Result: Display order field not visible in form
    Evidence: .sisyphus/evidence/task-2-no-display-order.png

  Scenario: Hidden display_order input still in DOM
    Tool: Playwright
    Preconditions: Dev server running, admin logged in
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Evaluate JS: document.querySelector('input[name="display_order"]')
      3. Assert: element exists and type is "hidden"
      4. Assert: element value is "0"
    Expected Result: Hidden input present with default value
    Evidence: JS evaluation result
  ```

  **Commit**: YES
  - Message: `refactor(admin): hide display order field from program form UI`
  - Files: `app/admin/programs/ProgramForm.tsx`

---

- [x] 3. Add `registration_url` column to programs table

  **What to do**:
  - Create SQL migration to add `registration_url` column to `programs` table
  - Column type: `text`, nullable, default `'https://google.ca'`
  - Run migration against Supabase using CLI or dashboard
  - Follow the existing migration pattern (see `add-program-registration.sql`)

  **Must NOT do**:
  - Do NOT modify existing columns
  - Do NOT add constraints beyond nullable text with default
  - Do NOT create new tables

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - Simple SQL migration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - Look for existing migration files (glob `**/*migration*` or `**/*.sql`) to follow naming/structure patterns
  - `app/lib/types/database.ts:171-210` — Existing table type definitions to understand the schema

  **WHY Each Reference Matters**:
  - Migration files: Follow the established naming convention and structure
  - database.ts: Understand existing column patterns (nullable text fields like tagline, description)

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Column exists in database after migration
    Tool: Bash (supabase CLI or curl)
    Preconditions: Supabase project accessible
    Steps:
      1. Run migration SQL against the database
      2. Query: SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'registration_url'
      3. Assert: column exists, type is text, default contains 'google.ca'
    Expected Result: Column created with correct type and default
    Evidence: Query output captured
  ```

  **Commit**: YES
  - Message: `feat(db): add registration_url column to programs table`
  - Files: migration SQL file

---

- [x] 4. Merge Ages & Schedule tab into Basic Info tab

  **What to do**:
  - In `ProgramForm.tsx`, move the content from the "Ages & Schedule" tab into the "Basic Info" tab
  - Append youth_ages, adult_ages, and schedule fields AFTER the existing Basic Info fields (after the logo upload, before the end of the tab content)
  - Remove the "Ages & Schedule" tab trigger and content entirely
  - Update tab structure: only 2 tabs remain — "Basic Info" and "Details"
  - Ensure hidden inputs for youth_ages, adult_ages, schedule still exist (they should already be in the global hidden inputs block)

  **Must NOT do**:
  - Do NOT rename any form field names
  - Do NOT change the hidden inputs block
  - Do NOT reorder existing Basic Info fields
  - Do NOT reorganize the Details tab
  - Do NOT modify server action parsing logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form layout and tab restructuring

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 2 (both modify ProgramForm.tsx — sequential to avoid conflicts)

  **References**:

  **Pattern References**:
  - `app/admin/programs/ProgramForm.tsx:214-315` — Basic Info tab content (append ages/schedule here)
  - `app/admin/programs/ProgramForm.tsx:317-359` — Ages & Schedule tab content (move these fields)
  - `app/admin/programs/ProgramForm.tsx:192-205` — Hidden inputs block (verify all fields still present)

  **WHY Each Reference Matters**:
  - Lines 214-315: This is where ages/schedule fields need to be inserted at the end
  - Lines 317-359: This is the source — the fields to move. Delete the tab wrapper, keep the field JSX
  - Lines 192-205: After changes, verify no hidden inputs were lost

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Only 2 tabs visible in program form
    Tool: Playwright
    Preconditions: Dev server running, admin logged in
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Wait for: form visible (timeout: 5s)
      3. Take snapshot
      4. Assert: tab "Basic Info" exists
      5. Assert: tab "Details" exists
      6. Assert: tab "Ages & Schedule" does NOT exist
      7. Screenshot: .sisyphus/evidence/task-4-two-tabs.png
    Expected Result: Only 2 tabs in form
    Evidence: .sisyphus/evidence/task-4-two-tabs.png

  Scenario: Ages and schedule fields in Basic Info tab
    Tool: Playwright
    Preconditions: Dev server running, admin logged in, Basic Info tab active
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Assert: "Youth Ages" label visible without switching tabs
      3. Assert: "Adult Ages" label visible without switching tabs
      4. Assert: "Schedule" label visible without switching tabs
      5. Fill: Youth Ages input with "Ages 5-12"
      6. Fill: Schedule textarea with "Spring 2026"
      7. Screenshot: .sisyphus/evidence/task-4-merged-fields.png
    Expected Result: All fields accessible in Basic Info tab
    Evidence: .sisyphus/evidence/task-4-merged-fields.png

  Scenario: Form submission includes ages and schedule data
    Tool: Playwright
    Preconditions: Dev server running, admin logged in
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Evaluate JS: check hidden inputs exist for youth_ages, adult_ages, schedule
      3. Assert: input[name="youth_ages"] exists in DOM
      4. Assert: input[name="adult_ages"] exists in DOM
      5. Assert: input[name="schedule"] exists in DOM
    Expected Result: All hidden inputs present for form submission
    Evidence: JS evaluation results
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `refactor(admin): merge ages/schedule into basic info tab, reduce to 2 tabs`
  - Files: `app/admin/programs/ProgramForm.tsx`

---

- [x] 5. Update TypeScript types, Zod schema, and query mapping for `registration_url`

  **What to do**:
  - Update `app/lib/types/database.ts` — Add `registration_url` to programs table Row, Insert, and Update types (nullable text)
  - Update `app/lib/actions/programs.ts` — Add `registration_url` to `ProgramSchema` Zod validation (optional string, default `'https://google.ca'`)
  - Update `app/lib/queries/programs.ts` — Add `registration_url` mapping in `dbProgramToLegacy()` function
  - Update the legacy `Program` type (if separate from DB types) to include `registrationUrl`
  - Update `createProgram` and `updateProgram` actions to handle the new field

  **Must NOT do**:
  - Do NOT change existing field mappings
  - Do NOT modify the `cleanStringArray` preprocessor logic
  - Do NOT change the `reorderPrograms` action

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - Straightforward type/schema additions following existing patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 3 (DB column must exist first)

  **References**:

  **Pattern References**:
  - `app/lib/types/database.ts:171-210` — Programs table type definitions — add `registration_url` field following `registration_open` and `registration_message` pattern
  - `app/lib/actions/programs.ts:18-33` — `ProgramSchema` Zod validation — add `registration_url` field
  - `app/lib/actions/programs.ts:60-94` — `createProgram` action — include `registration_url` in insert
  - `app/lib/actions/programs.ts:97-156` — `updateProgram` action — include `registration_url` in update
  - `app/lib/queries/programs.ts:6-24` — `dbProgramToLegacy()` mapping — add `registrationUrl: row.registration_url`

  **API/Type References**:
  - `app/lib/constants.ts` — Check if `Program` type is defined here (legacy type)
  - `app/lib/types/database.ts` — Authoritative DB type definitions

  **WHY Each Reference Matters**:
  - database.ts types: TypeScript will error on build if types don't match DB schema
  - ProgramSchema: Server action will reject form data without this field in schema
  - dbProgramToLegacy: Frontend code reads `registrationUrl` from this mapping
  - create/update actions: Must include field in DB operations or it's silently dropped

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: TypeScript compilation passes with new field
    Tool: Bash
    Preconditions: Task 3 migration completed
    Steps:
      1. Run: npx tsc --noEmit
      2. Assert: exit code 0
      3. Assert: no errors mentioning registration_url
    Expected Result: Clean TypeScript compilation
    Evidence: Command output

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert: exit code 0
    Expected Result: Successful build
    Evidence: Build output
  ```

  **Commit**: YES
  - Message: `feat(types): add registration_url to program types, schema, and queries`
  - Files: `app/lib/types/database.ts`, `app/lib/actions/programs.ts`, `app/lib/queries/programs.ts`, `app/lib/constants.ts` (if Program type is there)

---

- [x] 6. Build auth callback route + set-password page + middleware whitelist

  **What to do**:

  **6a. Auth callback route** (`app/auth/callback/route.ts`):
  - Create a GET route handler that exchanges Supabase auth tokens from invite email links
  - Reads `code` param from URL search params
  - Exchanges code for session using `supabase.auth.exchangeCodeForSession(code)`
  - On success: redirects to `/admin/set-password`
  - On error: redirects to `/admin/login` with error param
  - Uses server-side Supabase client (from `@supabase/ssr`)

  **6b. Set-password page** (`app/admin/set-password/page.tsx`):
  - Client component with password + confirm password form
  - Uses `supabase.auth.updateUser({ password })` to set the password
  - Validates passwords match and meet minimum length (8 chars)
  - On success: redirects to `/admin/programs`
  - On error: shows error message
  - If someone visits this page directly without valid session, redirect to `/admin/login`

  **6c. Middleware whitelist**:
  - In `middleware.ts`, add `/admin/set-password` to the allowlist alongside `/admin/login`
  - Users arriving at `/admin/set-password` have a Supabase session (from invite token exchange) but do NOT have an `admin_users` row yet
  - The set-password page will auto-create the `admin_users` row after successfully setting the password (using Supabase server client)

  **6e. Auto-create admin_users row on password set**:
  - After `supabase.auth.updateUser({ password })` succeeds on the set-password page
  - Insert a row into `admin_users` with `user_id` = current user's ID and `role` = `'admin'` (default role)
  - Use a server action for the insert (not client-side — needs proper DB access)
  - If the row already exists (edge case: user revisits set-password), skip the insert gracefully

  **6d. Configure Supabase redirect URL**:
  - In Supabase dashboard → Auth → URL Configuration, set the site URL and add redirect URL pointing to `/auth/callback`
  - Document this step clearly for the user

  **Must NOT do**:
  - Do NOT use `supabase.auth.admin.*` from client code
  - The set-password page WILL auto-create `admin_users` row (user decision — simplifies onboarding)
  - Do NOT build password reset or forgot password flows
  - Do NOT modify AdminSidebar or AdminHeader
  - Do NOT change existing middleware logic beyond adding the whitelist

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Auth flow requires careful Supabase integration, no special UI skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 9
  - **Blocked By**: None (auth flow is independent of program form changes)

  **References**:

  **Pattern References**:
  - `app/admin/login/page.tsx` — Existing login page pattern (client component, Supabase client usage, error handling, redirect). Follow this structure for set-password page.
  - `middleware.ts:36-41` — Login page whitelist pattern. Replicate for `/admin/set-password`.
  - `app/lib/actions/auth.ts` — Existing auth server actions (signIn, signOut). May reference for patterns but set-password uses client-side Supabase.

  **External References**:
  - Supabase docs: Auth with PKCE flow for server-side token exchange
  - Supabase docs: `exchangeCodeForSession()` usage in Next.js route handlers
  - Supabase docs: `updateUser({ password })` for setting passwords

  **WHY Each Reference Matters**:
  - `login/page.tsx`: The set-password page should look and behave consistently with the login page (same card layout, error display pattern, Supabase client usage)
  - `middleware.ts:36-41`: Shows the exact pattern for whitelisting a route — check pathname, allow through if user has session but skip admin_users check
  - Auth actions: Shows how Supabase server client is created in this project

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Auth callback route exists and handles missing code param
    Tool: Bash (curl)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:3000/auth/callback
      2. Assert: HTTP redirect (302/307) to /admin/login
    Expected Result: Redirects to login when no code provided
    Evidence: curl output

  Scenario: Set-password page renders for authenticated user
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/admin/set-password
      2. Note: Without auth, should redirect to /admin/login
      3. Assert: URL is /admin/login (redirect happened)
      4. Screenshot: .sisyphus/evidence/task-6-set-password-redirect.png
    Expected Result: Unauthenticated users redirected to login
    Evidence: .sisyphus/evidence/task-6-set-password-redirect.png

  Scenario: Set-password page has correct form fields
    Tool: Playwright
    Preconditions: Dev server running, user authenticated (simulated)
    Steps:
      1. Navigate to: http://localhost:3000/admin/set-password (with valid session)
      2. Assert: input[type="password"] for new password exists
      3. Assert: input[type="password"] for confirm password exists
      4. Assert: submit button exists
      5. Screenshot: .sisyphus/evidence/task-6-set-password-form.png
    Expected Result: Password form with two fields and submit
    Evidence: .sisyphus/evidence/task-6-set-password-form.png

  Scenario: Password mismatch shows error
    Tool: Playwright
    Preconditions: Dev server running, user authenticated
    Steps:
      1. Navigate to: http://localhost:3000/admin/set-password
      2. Fill: password field with "Password123!"
      3. Fill: confirm password field with "DifferentPass!"
      4. Click: submit button
      5. Assert: error message about passwords not matching
      6. Assert: URL still /admin/set-password (no redirect)
      7. Screenshot: .sisyphus/evidence/task-6-password-mismatch.png
    Expected Result: Error shown, stays on page
    Evidence: .sisyphus/evidence/task-6-password-mismatch.png
  ```

  **Note**: Full E2E invite flow (send invite → receive email → click link → set password) cannot be automated. Document manual test steps:
  1. Go to Supabase dashboard → Auth → Users → Invite User
  2. Enter email, save
  3. Ensure `admin_users` row created for that user's ID
  4. Check email for invite link
  5. Click link → should land on `/auth/callback` → redirect to `/admin/set-password`
  6. Set password → should redirect to `/admin/programs`
  7. Log out → log back in with email/password → should work

  **Commit**: YES
  - Message: `feat(auth): add invite flow with auth callback and set-password page`
  - Files: `app/auth/callback/route.ts`, `app/admin/set-password/page.tsx`, `middleware.ts`

---

- [x] 7. Add registration URL field to ProgramForm + update public site links

  **What to do**:

  **7a. ProgramForm field**:
  - Add `registrationUrl` to useState initialization (from `program?.registration_url` or `program?.registrationUrl`, default `'https://google.ca'`)
  - Add a "Registration URL" text input (type="url") in the Basic Info tab section, after the schedule field
  - Add hidden input: `<input type="hidden" name="registration_url" value={registrationUrl} />`
  - Placeholder: "https://example.com/register"

  **7b. Public site "Register Now" links**:
  - Use `ast_grep_search` to find ALL "Register Now" links/buttons across the codebase
  - Update `app/programs/page.tsx` — program card "Register" button href to use `program.registrationUrl` (fallback to `https://google.ca`)
  - Update `app/programs/[slug]/page.tsx` — "Register Now" button href to use `program.registrationUrl`
  - Update `app/registration/page.tsx` or `RegistrationContent.tsx` if applicable
  - Add `target="_blank" rel="noopener noreferrer"` since these are external URLs

  **Must NOT do**:
  - Do NOT add URL validation UI beyond `type="url"` on the input
  - Do NOT add a "test this URL" button
  - Do NOT remove the existing `/registration` page
  - Do NOT change registration_open or registration_message behavior

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form field placement and public site link updates

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 5 (types/schema must be updated first)

  **References**:

  **Pattern References**:
  - `app/admin/programs/ProgramForm.tsx:192-205` — Hidden inputs block. Add `registration_url` hidden input here.
  - `app/admin/programs/ProgramForm.tsx:220-240` — Text input pattern (name field). Follow for registration URL input.
  - `app/programs/page.tsx:131` — "Register" button in program card. Update href.
  - `app/programs/[slug]/page.tsx:64` — "Register Now" link on detail page. Update href.
  - `app/programs/[slug]/page.tsx:189` — Another "Register Now" CTA. Update href.

  **API/Type References**:
  - `app/lib/queries/programs.ts:dbProgramToLegacy()` — Where `registrationUrl` is mapped from DB
  - `app/lib/constants.ts` — Legacy Program type if `registrationUrl` was added there in Task 5

  **WHY Each Reference Matters**:
  - Hidden inputs block: Must add here or the field won't be submitted
  - programs/page.tsx:131: This is the card "Register" button on the listing page — users click this
  - [slug]/page.tsx:64,189: These are the detail page CTAs — must also use the new URL
  - Use `ast_grep_search` to find any other Register links we missed

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Registration URL field visible in program form
    Tool: Playwright
    Preconditions: Dev server running, admin logged in
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Assert: input with label "Registration URL" or similar exists
      3. Assert: input has default value "https://google.ca"
      4. Assert: input type is "url"
      5. Screenshot: .sisyphus/evidence/task-7-reg-url-field.png
    Expected Result: Registration URL field with default value
    Evidence: .sisyphus/evidence/task-7-reg-url-field.png

  Scenario: Public program card uses registration URL
    Tool: Playwright
    Preconditions: Dev server running, at least one program exists with registration_url set
    Steps:
      1. Navigate to: http://localhost:3000/programs
      2. Wait for: program cards visible
      3. Find: "Register" button/link on first program card
      4. Assert: href contains the registration URL (or default google.ca)
      5. Assert: target="_blank" attribute exists (external link)
      6. Screenshot: .sisyphus/evidence/task-7-public-card-link.png
    Expected Result: Register button links to custom registration URL
    Evidence: .sisyphus/evidence/task-7-public-card-link.png

  Scenario: Program detail page uses registration URL
    Tool: Playwright
    Preconditions: Dev server running, program exists
    Steps:
      1. Navigate to: http://localhost:3000/programs/[any-slug]
      2. Find: "Register Now" button(s) on page
      3. Assert: href contains the registration URL
      4. Assert: target="_blank" attribute exists
      5. Screenshot: .sisyphus/evidence/task-7-detail-page-link.png
    Expected Result: Register Now button links to custom URL
    Evidence: .sisyphus/evidence/task-7-detail-page-link.png

  Scenario: Empty registration URL falls back to default
    Tool: Playwright
    Preconditions: Dev server running, program with no registration_url in DB
    Steps:
      1. Navigate to program's public page
      2. Assert: Register button href is "https://google.ca"
    Expected Result: Default URL used when none set
    Evidence: Assertion result
  ```

  **Commit**: YES
  - Message: `feat(programs): add editable registration URL per program with public site integration`
  - Files: `app/admin/programs/ProgramForm.tsx`, `app/programs/page.tsx`, `app/programs/[slug]/page.tsx`, `app/registration/*` (if applicable)

---

- [x] 8. Extract ProgramCard component + add sticky live preview to edit form

  **What to do**:

  **8a. Extract ProgramCard component**:
  - Create `app/components/ProgramCard.tsx` (or `app/programs/components/ProgramCard.tsx`)
  - Extract the card JSX from `app/programs/page.tsx:71-138` into a reusable component
  - Props: program data (name, tagline, logo, youth_ages, adult_ages, schedule, slug, registrationUrl, etc.)
  - Replace the inline card in `programs/page.tsx` with the new component
  - Verify the programs listing page still renders identically

  **8b. Sticky live preview in ProgramForm**:
  - Add a sticky bottom bar to the program edit form
  - Import and render `ProgramCard` with current form state as props
  - Update in real-time as user types (use existing useState values)
  - Style: fixed bottom bar, subtle background, shows one card preview
  - Map form state to ProgramCard props: `name` → title, `tagline` → tagline, `logoUrl` → logo, `youthAges` → youth_ages, etc.
  - Add some bottom padding to the form so the sticky bar doesn't overlap the last field

  **Must NOT do**:
  - Do NOT add mobile/desktop toggle or zoom to preview
  - Do NOT make preview interactive (no clicking links in preview)
  - Do NOT add heavy dependencies for preview
  - Do NOT change the card visual design — match existing exactly

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Component extraction, sticky layout, real-time preview UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 7)
  - **Blocks**: Task 9
  - **Blocked By**: Task 4 (form restructure should be done first to avoid conflicts)

  **References**:

  **Pattern References**:
  - `app/programs/page.tsx:71-138` — The exact card JSX to extract. This is the SOURCE for ProgramCard component.
  - `app/admin/programs/ProgramForm.tsx:37-50` — Form state hooks. These become the data source for the preview.
  - `app/admin/programs/ProgramForm.tsx:192-205` — Hidden inputs pattern. Do NOT modify, but understand the data flow.

  **API/Type References**:
  - `app/lib/constants.ts` — `Program` type definition. ProgramCard props should match this shape (or a subset).
  - `app/lib/queries/programs.ts:dbProgramToLegacy()` — Field name mapping between DB and frontend.

  **WHY Each Reference Matters**:
  - `programs/page.tsx:71-138`: This IS the card. Extract it exactly, then parameterize it.
  - Form state hooks: The preview reads from these — need to map state var names to Program type field names (e.g., `youthAges` state → `youthAges` prop)
  - Program type: ProgramCard should accept this type as props for consistency
  - dbProgramToLegacy: Understand field name differences (DB: `youth_ages`, frontend: `youthAges`)

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Programs listing page still renders correctly after extraction
    Tool: Playwright
    Preconditions: Dev server running, programs exist in DB
    Steps:
      1. Navigate to: http://localhost:3000/programs
      2. Wait for: program cards visible (timeout: 10s)
      3. Assert: at least one program card renders with title, tagline, image
      4. Assert: "Learn More" and "Register" buttons present on cards
      5. Screenshot: .sisyphus/evidence/task-8-programs-page.png
    Expected Result: Programs page looks identical to before
    Evidence: .sisyphus/evidence/task-8-programs-page.png

  Scenario: Sticky preview visible on program edit page
    Tool: Playwright
    Preconditions: Dev server running, admin logged in, program exists
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/[existing-id]
      2. Wait for: form visible (timeout: 5s)
      3. Scroll to bottom of page
      4. Assert: sticky bottom bar visible with card preview
      5. Screenshot: .sisyphus/evidence/task-8-preview-visible.png
    Expected Result: Sticky preview bar at bottom of viewport
    Evidence: .sisyphus/evidence/task-8-preview-visible.png

  Scenario: Preview updates live when form fields change
    Tool: Playwright
    Preconditions: Dev server running, admin logged in, program edit page
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/[existing-id]
      2. Clear name field, type: "Live Preview Test"
      3. Assert: preview card title updates to "Live Preview Test"
      4. Clear tagline field, type: "Testing real-time updates"
      5. Assert: preview card tagline updates to "Testing real-time updates"
      6. Screenshot: .sisyphus/evidence/task-8-live-update.png
    Expected Result: Preview card reflects current form values
    Evidence: .sisyphus/evidence/task-8-live-update.png

  Scenario: Preview handles empty/missing fields gracefully
    Tool: Playwright
    Preconditions: Dev server running, admin logged in
    Steps:
      1. Navigate to: http://localhost:3000/admin/programs/new
      2. Assert: preview card renders with empty/placeholder state
      3. Assert: no JS errors in console
      4. Screenshot: .sisyphus/evidence/task-8-empty-preview.png
    Expected Result: Preview renders gracefully with no data
    Evidence: .sisyphus/evidence/task-8-empty-preview.png
  ```

  **Commit**: YES
  - Message: `feat(admin): add live program card preview to edit form`
  - Files: `app/components/ProgramCard.tsx` (new), `app/programs/page.tsx` (refactored to use ProgramCard), `app/admin/programs/ProgramForm.tsx` (sticky preview bar)

---

- [x] 9. Final build verification + full QA pass

  **What to do**:
  - Run `npm run build` — must pass with zero errors
  - Run full QA across all changed pages
  - Verify no regressions on public site (programs listing, program detail, registration, home)
  - Verify admin portal (login, program create, program edit, all tabs)

  **Must NOT do**:
  - Do NOT skip any page — full sweep required

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`, `dev-browser`]
    - `frontend-ui-ux`: Visual regression checking
    - `dev-browser`: Browser automation for QA sweep

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (final task)
  - **Blocks**: None (final)
  - **Blocked By**: ALL previous tasks (1-8)

  **References**:
  - All files modified in Tasks 1-8
  - `CLAUDE.md` — mandates `npm run build` at task completion

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Production build passes
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert: exit code 0
      3. Assert: no TypeScript errors
      4. Assert: all routes listed in output
    Expected Result: Clean build
    Evidence: Build output

  Scenario: Public site regression check
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/ → Assert: home page loads, Login link visible
      2. Navigate to: http://localhost:3000/programs → Assert: program cards render with Register buttons
      3. Click first "Learn More" → Assert: detail page loads
      4. Assert: "Register Now" button has correct href
      5. Navigate to: http://localhost:3000/registration → Assert: page loads
      6. Screenshots of each page
    Expected Result: All public pages functional
    Evidence: .sisyphus/evidence/task-9-public-*.png

  Scenario: Admin portal regression check
    Tool: Playwright
    Preconditions: Admin logged in
    Steps:
      1. Navigate to: /admin/login → Assert: login form renders
      2. Log in → Assert: redirect to /admin/programs
      3. Navigate to: /admin/programs/new → Assert: 2 tabs, no display order, registration URL field
      4. Navigate to: existing program → Assert: sticky preview visible, fields populated
      5. Edit program name → Assert: preview updates
      6. Screenshots of each state
    Expected Result: Admin portal fully functional
    Evidence: .sisyphus/evidence/task-9-admin-*.png
  ```

  **Commit**: NO (verification only)

---

## Commit Strategy

| After Task(s) | Message | Key Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(header): add subtle Login text link to public site header` | Header.tsx | Visual check |
| 2 | `refactor(admin): hide display order field from program form UI` | ProgramForm.tsx | Snapshot check |
| 3 | `feat(db): add registration_url column to programs table` | migration SQL | DB query |
| 4 | `refactor(admin): merge ages/schedule into basic info tab` | ProgramForm.tsx | Snapshot check |
| 5 | `feat(types): add registration_url to program types, schema, and queries` | database.ts, programs.ts, queries/programs.ts | tsc --noEmit |
| 6 | `feat(auth): add invite flow with auth callback and set-password page` | auth/callback/route.ts, set-password/page.tsx, middleware.ts | curl + snapshot |
| 7 | `feat(programs): add editable registration URL per program` | ProgramForm.tsx, programs/page.tsx, [slug]/page.tsx | Snapshot check |
| 8 | `feat(admin): add live program card preview to edit form` | ProgramCard.tsx, ProgramForm.tsx, programs/page.tsx | Live update check |
| 9 | — | — | npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: exit code 0, no errors
```

### Final Checklist
- [ ] Login link in header (desktop + mobile)
- [ ] `/auth/callback` route handles invite tokens
- [ ] `/admin/set-password` page works for invited users
- [ ] Middleware allows `/admin/set-password` without admin_users row
- [ ] Display order not visible in program form
- [ ] Only 2 tabs in program form (Basic Info, Details)
- [ ] Ages/schedule fields in Basic Info tab
- [ ] Registration URL field in form with default google.ca
- [ ] Public "Register Now" buttons use per-program registration URL
- [ ] Sticky card preview updates live on program edit
- [ ] Programs listing page renders identically after ProgramCard extraction
- [ ] `npm run build` passes
