# Learnings

Session started: 2026-02-13T19:09:32.934Z

## Conventions

## Patterns

## Gotchas
# Wave 1, Task 2: Hide Display Order Field

## Task Summary
Removed visible "Display Order" input field from ProgramForm UI while preserving:
- Hidden input for form submission (line 200)
- displayOrder useState hook (line 45)
- Server action handling

## Changes Made
- **File**: `app/admin/programs/ProgramForm.tsx`
- **Removed**: Lines 299-312 (visible Display Order `<div>` block)
  - Removed `<Label htmlFor="display_order">Display Order</Label>`
  - Removed visible `<Input type="number" id="display_order" ...>`
  - Removed helper text "Lower numbers appear first"

## Verification
✓ Build passed with no TypeScript errors
✓ Hidden input `<input type="hidden" name="display_order" value={String(displayOrder)} />` still at line 200
✓ useState hook `const [displayOrder, setDisplayOrder] = useState(program?.display_order || 0)` still at line 45
✓ No "Display Order" text in file (grep confirmed)
✓ No visible input with `id="display_order"` (grep confirmed)
✓ Commit: `adb2b83` - "refactor(admin): hide display order field from program form UI"

## Key Learnings
1. **Hidden inputs for form submission**: The pattern of keeping hidden inputs while hiding visible UI is used to maintain form submission data without user interaction
2. **State management preserved**: The useState hook remains because it's still needed for the hidden input value
3. **Clean removal**: Removed only the visible UI block, leaving all functional code intact
4. **Build verification**: Next.js build catches any syntax errors immediately

## Blockers for Task 4
Task 4 (merge tabs) also modifies ProgramForm.tsx. This task must complete first to avoid merge conflicts.

# Wave 1, Task 1: Add Login Link to Header

## Task Summary
Added a subtle "Login" text link to the public site header in both desktop and mobile navigation. The link points to `/admin/login` and is styled as a muted text link (not a button).

## Changes Made
- **File**: `app/components/layout/Header.tsx`
- **Desktop nav** (lines 43-49): Added Login link before "Register Now" button
  - Styled with `text-neutral-500 hover:text-neutral-700 text-sm transition-colors`
  - Positioned between nav links and CTA button
- **Mobile nav** (lines 111-118): Added Login link in mobile menu
  - Same styling as desktop
  - Includes `onClick={() => setMobileMenuOpen(false)}` to close menu on click

## Verification
✓ Build passed with no TypeScript errors
✓ Desktop view: Login link visible between "About" and "Register Now" button
✓ Mobile view: Login link visible in mobile menu after nav links
✓ Link navigates correctly to `/admin/login`
✓ Styling is subtle (muted color, not a button)
✓ Header remains stateless (no Supabase client added)
✓ Screenshots: `.sisyphus/evidence/task-1-desktop-login.png`, `.sisyphus/evidence/task-1-mobile-login.png`
✓ Commit: `719dfdd` - "feat(header): add subtle Login text link to public site header"

## Key Learnings
1. **Stateless components**: Header component uses only state for mobile menu toggle, no auth state needed
2. **Responsive patterns**: Desktop nav uses `hidden md:flex`, mobile menu uses conditional rendering with `mobileMenuOpen` state
3. **Text link styling**: Muted colors (`text-neutral-500`) with hover effects (`hover:text-neutral-700`) create subtle, professional links
4. **Mobile menu behavior**: Links should close the menu on click via `onClick={() => setMobileMenuOpen(false)}`
5. **Link placement**: Utility links (Login) placed before CTA buttons in navigation hierarchy

## No Blockers
This task is independent and doesn't conflict with other Wave 1 tasks.

# Wave 1, Task 3: Add registration_url Column to Programs Table

## Task Summary
Created and committed a SQL migration to add the `registration_url` column to the `programs` table. The column is of type `text`, nullable, with a default value of `'https://google.ca'`.

## Changes Made
- **File**: `supabase/migrations/add-registration-url.sql` (new)
  - Follows existing migration pattern from `add-program-registration.sql`
  - Uses `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for idempotency
  - Sets default value to `'https://google.ca'`
  - Includes descriptive comments

- **File**: `scripts/apply-migration.ts` (new)
  - Script to run migration with service role key
  - Loads environment from `.env.local`
  - Provides clear error messages and instructions

- **File**: `scripts/verify-migration.ts` (new)
  - Script to verify migration was applied successfully
  - Queries `information_schema.columns` to check column properties
  - Validates type and default value

- **File**: `MIGRATION_GUIDE.md` (new)
  - Comprehensive guide for running migrations
  - Three options: Dashboard, CLI, psql
  - Verification instructions

## Verification
✓ Migration file created with correct SQL syntax
✓ Follows existing migration naming pattern
✓ Committed: `bdadbd8` - "feat(db): add registration_url column to programs table"
✓ Scripts created for running and verifying migration

## Key Learnings
1. **Migration Pattern**: Supabase migrations use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for safety
2. **Default Values**: Defaults are specified in the ALTER TABLE statement, not as separate operations
3. **Idempotency**: Using `IF NOT EXISTS` prevents errors if migration is run multiple times
4. **Service Role Key**: Required for programmatic migration execution via Supabase client
5. **Manual Alternative**: Supabase Dashboard SQL Editor provides a UI-based migration option

## Blockers for Task 5
Task 5 (Update types/schema) depends on this migration being applied to the database. The column must exist before TypeScript types can reference it.

## How to Apply the Migration
Since the service role key is not available in the environment:

**Option 1 (Recommended)**: Use Supabase Dashboard
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/add-registration-url.sql`
3. Run the query

**Option 2**: Use CLI (when service role key is available)
```bash
SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/apply-migration.ts
```

**Option 3**: Verify migration was applied
```bash
SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/verify-migration.ts
```


# Wave 1, Task 4: Merge Ages & Schedule Tab into Basic Info

## Task Summary
Consolidated the "Ages & Schedule" tab into the "Basic Info" tab in ProgramForm.tsx, reducing the form from 3 tabs to 2 tabs. All form functionality preserved.

## Changes Made
- **File**: `app/admin/programs/ProgramForm.tsx`
- **Removed**: 
  - TabsTrigger for "Ages & Schedule" (line 210)
  - Entire TabsContent block for "Ages & Schedule" (lines 302-344)
- **Added**:
  - youth_ages field to Basic Info tab (after logo upload)
  - adult_ages field to Basic Info tab
  - schedule field to Basic Info tab
- **Preserved**:
  - Hidden inputs for youth_ages, adult_ages, schedule (lines 197-199)
  - All state management (setYouthAges, setAdultAges, setSchedule)
  - All onChange handlers and validation

## Verification
✓ Build passed with no TypeScript errors
✓ Exactly 2 TabsTrigger components remain (Basic Info, Details)
✓ Exactly 2 TabsContent components remain
✓ Hidden inputs still present at lines 197-199
✓ All three fields (youth_ages, adult_ages, schedule) accessible in Basic Info tab
✓ Fields positioned after logo upload section, before tab end
✓ No "Ages & Schedule" text in file (grep confirmed)
✓ Commit: `c2ddf78` - "refactor(admin): merge ages/schedule into basic info tab, reduce to 2 tabs"

## Key Learnings
1. **Tab consolidation pattern**: Moving fields between tabs requires:
   - Removing TabsTrigger from TabsList
   - Removing entire TabsContent block
   - Appending field JSX to target tab's CardContent
   - Preserving hidden inputs for form submission
2. **Hidden input preservation**: Critical for form submission - hidden inputs must remain even when UI is moved
3. **Field ordering**: Appended fields after logo upload maintains logical grouping (basic program info, then ages/schedule)
4. **State management**: useState hooks and onChange handlers don't need modification when moving UI elements
5. **Clean removal**: Removed only the tab structure, not the underlying functionality

## Dependencies
- Depends on Task 2 (completed) - both modify ProgramForm.tsx sequentially
- No blockers for subsequent tasks

## Impact
- Simplified admin form UX: 3 tabs → 2 tabs
- Reduced cognitive load for form users
- All data still captured and submitted correctly
- No changes to server action or database schema

# Wave 2, Task 6: Auth Invite Flow (Callback + Set Password)

## Task Summary
Built complete Supabase invite flow: auth callback route for token exchange, set-password page with password form, server action to create admin_users row, and middleware whitelist for set-password.

## Changes Made
- **File**: `app/auth/callback/route.ts` (new)
  - GET route handler that exchanges invite code via `supabase.auth.exchangeCodeForSession(code)`
  - Redirects to `/admin/set-password` on success, `/admin/login?error=...` on failure
  - Handles missing code, exchange errors, and unexpected exceptions

- **File**: `app/admin/set-password/page.tsx` (new)
  - Client component matching login page patterns (Card, Input, Label, Button)
  - Password + confirm fields with client-side validation (8+ chars, match)
  - Calls `supabase.auth.updateUser({ password })` then server action to create admin row
  - Redirects to `/admin/programs` on success

- **File**: `app/lib/actions/admin.ts` (new)
  - Server action `createAdminUser()` that inserts admin_users row
  - Idempotent: checks for existing row before insert
  - Uses `(supabase.from('admin_users') as any)` pattern (same as programs.ts) to bypass Supabase generated type limitation

- **File**: `middleware.ts` (modified)
  - Added `/admin/set-password` whitelist between login and general admin checks
  - Requires auth (redirects to login if no user) but skips admin_users check
  - Allows invited users to set password before their admin row exists

## Verification
- Build passed: `○ /admin/set-password` and `ƒ /auth/callback` in route table
- curl `/auth/callback` without code → 307 to `/admin/login?error=missing_code`
- curl `/admin/set-password` without auth → 307 to `/admin/login`
- Playwright confirmed redirect behavior
- Screenshots: `.sisyphus/evidence/task-6-set-password-redirect.png`

## Key Learnings
1. **Middleware whitelist pattern**: New admin pages that need auth but NOT admin_users check require explicit whitelisting between login check and admin_users check
2. **Supabase type limitation**: `admin_users` insert resolves to `never` in generated types — use `(supabase.from('table') as any)` pattern consistent with other actions
3. **Invite flow sequence**: Invite email → auth callback (token exchange) → set-password (updateUser + create admin row) → admin dashboard
4. **Auth callback uses server client**: Route handlers use `createClient` from `@/app/lib/supabase/server` which is async
5. **Set-password page is 'use client'**: Uses browser Supabase client for `updateUser`, server action for admin_users insert — clean separation

