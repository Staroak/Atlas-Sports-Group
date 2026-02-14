#!/usr/bin/env npx tsx
/**
 * Add a new admin user with a temporary password.
 * They'll be forced to change it on first login.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/add-admin.ts user@example.com
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/add-admin.ts user@example.com myTempPass123
 *
 * If no password is provided, defaults to "ChangeMe123!"
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  console.error("");
  console.error("Get it from: https://app.supabase.com/project/eitrrbmtxwryfppdgaeq/settings/api");
  console.error("Then run: SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/add-admin.ts user@example.com");
  process.exit(1);
}

const email = process.argv[2];
const tempPassword = process.argv[3] || "ChangeMe123!";

if (!email) {
  console.error("Usage: npx tsx scripts/add-admin.ts <email> [temp-password]");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addAdmin() {
  // 1. Create auth user with temp password (skip email confirmation)
  console.log(`Creating auth user for ${email}...`);

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // skip email verification
    });

  if (authError) {
    // User might already exist in auth
    if (authError.message.includes("already been registered")) {
      console.log("Auth user already exists, looking up their ID...");

      const { data: listData, error: listError } =
        await supabase.auth.admin.listUsers();

      if (listError) {
        console.error("Failed to list users:", listError.message);
        process.exit(1);
      }

      const existingUser = listData.users.find((u) => u.email === email);
      if (!existingUser) {
        console.error("Could not find existing user by email");
        process.exit(1);
      }

      // Update their password to the temp one
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: tempPassword }
      );

      if (updateError) {
        console.error("Failed to reset password:", updateError.message);
        process.exit(1);
      }

      console.log("Password reset to temp password.");
      await ensureAdminRow(existingUser.id);
      return;
    }

    console.error("Failed to create user:", authError.message);
    process.exit(1);
  }

  console.log(`Auth user created: ${authData.user.id}`);
  await ensureAdminRow(authData.user.id);
}

async function ensureAdminRow(userId: string) {
  // 2. Check if admin_users row exists
  const { data: existing } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    // Update must_change_password flag
    const { error } = await supabase
      .from("admin_users")
      .update({ must_change_password: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to set must_change_password:", error.message);
      process.exit(1);
    }
    console.log("Existing admin user updated with must_change_password=true");
  } else {
    // Insert new row
    const { error } = await supabase
      .from("admin_users")
      .insert({ user_id: userId, role: "admin", must_change_password: true });

    if (error) {
      console.error("Failed to create admin_users row:", error.message);
      process.exit(1);
    }
    console.log("admin_users row created");
  }

  console.log("");
  console.log("Done! Give them these credentials:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${tempPassword}`);
  console.log("");
  console.log("They'll be forced to set a new password on first login.");
}

addAdmin();
