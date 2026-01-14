-- Migration: Add per-program registration fields
-- Run this if you already have the programs table

ALTER TABLE programs
ADD COLUMN IF NOT EXISTS registration_open BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_message VARCHAR(500);

-- Update existing programs to have registration closed by default
UPDATE programs SET registration_open = false WHERE registration_open IS NULL;
