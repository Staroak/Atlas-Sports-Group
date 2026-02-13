#!/usr/bin/env npx tsx
/**
 * Verify that the registration_url column exists in the programs table
 * 
 * This script checks if the migration has been applied successfully.
 * It queries the information_schema to verify the column exists with the correct type and default.
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
  console.error("To verify the migration, you need the service role key:");
  console.error("1. Go to: https://app.supabase.com/project/eitrrbmtxwryfppdgaeq/settings/api");
  console.error("2. Copy the 'Service Role' key");
  console.error("3. Run: SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/verify-migration.ts");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function verifyMigration() {
  try {
    console.log("🔍 Verifying migration...");
    console.log("");

    // Query the information_schema to check if the column exists
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: `SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'programs' AND column_name = 'registration_url'`,
    });

    if (error) {
      console.error("❌ Verification query failed:", error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.error("❌ Column 'registration_url' not found in programs table");
      console.error("");
      console.error("The migration may not have been applied yet.");
      console.error("Please run the migration using:");
      console.error("  npx tsx scripts/apply-migration.ts");
      process.exit(1);
    }

    const column = data[0];
    console.log("✅ Column found!");
    console.log("");
    console.log("Column Details:");
    console.log(`  Name: ${column.column_name}`);
    console.log(`  Type: ${column.data_type}`);
    console.log(`  Default: ${column.column_default}`);
    console.log("");

    // Verify the column has the correct properties
    const isCorrectType = column.data_type === "text";
    const hasCorrectDefault =
      column.column_default &&
      column.column_default.includes("google.ca");

    if (isCorrectType && hasCorrectDefault) {
      console.log("✅ Column has correct type and default value");
      console.log("");
      console.log("Migration verification PASSED ✓");
    } else {
      console.warn("⚠️  Column exists but may have incorrect properties:");
      if (!isCorrectType) {
        console.warn(`  - Expected type: text, got: ${column.data_type}`);
      }
      if (!hasCorrectDefault) {
        console.warn(
          `  - Expected default containing 'google.ca', got: ${column.column_default}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyMigration();
