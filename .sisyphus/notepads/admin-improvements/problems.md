# Unresolved Blockers

Session started: 2026-02-13T19:09:32.934Z

## BLOCKER: Task 5 - Migration Not Applied

**Issue**: The `registration_url` column migration SQL file was created and committed in Task 3, but the migration has NOT been applied to the Supabase database yet.

**Impact**: 
- Task 5 (Update types/schema for registration_url) is BLOCKED
- Task 7 (Add registration URL field to form + public site) depends on Task 5, so also BLOCKED

**Migration File**: `supabase/migrations/add-registration-url.sql`
**SQL**: `ALTER TABLE programs ADD COLUMN IF NOT EXISTS registration_url TEXT DEFAULT 'https://google.ca';`

**Resolution Required**:
User must apply migration via one of these methods:
1. Supabase Dashboard → SQL Editor → Run the ALTER TABLE query
2. CLI with service role key: `SUPABASE_SERVICE_ROLE_KEY=key npx tsx scripts/apply-migration.ts`
3. Direct psql connection

**Workaround**: Proceeding with Task 8 (Extract ProgramCard + live preview) which is independent of the migration.

**Status**: Documented, proceeding with independent tasks
**Timestamp**: 2026-02-13T19:30:00Z
