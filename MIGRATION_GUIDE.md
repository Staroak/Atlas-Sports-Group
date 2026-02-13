# Database Migration Guide

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for Manual Execution)

1. Go to [Supabase Dashboard](https://app.supabase.com/project/eitrrbmtxwryfppdgaeq/sql/new)
2. Click **SQL Editor** → **New Query**
3. Copy the SQL from `supabase/migrations/add-registration-url.sql`
4. Paste into the editor
5. Click **Run**
6. Verify the column was created

### Option 2: Using CLI (Requires Service Role Key)

```bash
# Set the service role key from Supabase Dashboard > Settings > API
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the migration script
npx tsx scripts/apply-migration.ts
```

### Option 3: Using psql (Direct Database Connection)

```bash
# Get the database connection string from Supabase Dashboard > Settings > Database
# Format: postgresql://postgres:[password]@[host]:[port]/postgres

psql "postgresql://postgres:[password]@[host]:[port]/postgres" < supabase/migrations/add-registration-url.sql
```

## Verification

After running the migration, verify the column was created:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'programs' AND column_name = 'registration_url';
```

Expected output:
- `column_name`: registration_url
- `data_type`: text
- `column_default`: 'https://google.ca'::text

## Migration Details

**File**: `supabase/migrations/add-registration-url.sql`

**Changes**:
- Adds `registration_url` column to `programs` table
- Type: `text` (nullable)
- Default: `'https://google.ca'`
- Uses `IF NOT EXISTS` to prevent errors if run multiple times

**Depends On**: None (independent migration)

**Blocks**: Task 5 (Type updates), Task 7 (Registration URL field in form)
