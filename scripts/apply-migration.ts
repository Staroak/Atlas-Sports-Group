#!/usr/bin/env npx tsx
/**
 * Apply database migration to Supabase
 * 
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/apply-migration.ts
 * 
 * Or manually:
 *   1. Go to Supabase Dashboard > SQL Editor
 *   2. Create a new query
 *   3. Copy the contents of supabase/migrations/add-registration-url.sql
 *   4. Run the query
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};

envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  }
});

const supabaseUrl =
  envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY");
  console.error("");
  console.error("To run this migration, you need the service role key:");
  console.error("1. Go to: https://app.supabase.com/project/eitrrbmtxwryfppdgaeq/settings/api");
  console.error("2. Copy the 'Service Role' key");
  console.error("3. Run: SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/apply-migration.ts");
  console.error("");
  console.error("Or apply manually:");
  console.error("1. Go to Supabase Dashboard > SQL Editor");
  console.error("2. Create a new query");
  console.error("3. Copy contents of: supabase/migrations/add-registration-url.sql");
  console.error("4. Run the query");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/add-registration-url.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("📝 Running migration...");
    console.log("");
    console.log(migrationSQL);
    console.log("");

    // Execute the migration
    const { error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    }

    console.log("✅ Migration completed successfully!");
    console.log("");
    console.log("Verifying column...");

    // Verify the column exists by querying the table
    const { data, error: verifyError } = await supabase
      .from("programs")
      .select("registration_url")
      .limit(1);

    if (verifyError) {
      console.error("⚠️  Could not verify column:", verifyError.message);
    } else {
      console.log("✅ Column 'registration_url' verified in programs table");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

applyMigration();
