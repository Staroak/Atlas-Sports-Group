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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  envVars.SUPABASE_SERVICE_ROLE_KEY ||
  envVars.SUPABASE_SERVICE_KEY ||
  envVars.SUPABASE_DB_PASSWORD ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Please set it in your environment."
  );
  console.error(
    "You can get this from: Supabase Dashboard > Settings > API > Service Role Key"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/add-registration-url.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("Running migration...");
    console.log("SQL:", migrationSQL);

    // Execute the migration using the admin API
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }

    console.log("Migration completed successfully!");

    // Verify the column exists
    const { data: verifyData, error: verifyError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, column_default")
      .eq("table_name", "programs")
      .eq("column_name", "registration_url");

    if (verifyError) {
      console.log("Note: Verification query may not work with anon key");
      console.log("Column should be created if migration ran without errors");
    } else {
      console.log("Verification result:", verifyData);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

runMigration();
