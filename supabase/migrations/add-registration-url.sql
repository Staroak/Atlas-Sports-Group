-- Migration: Add registration_url column to programs table
-- Stores the URL where users can register for each program

ALTER TABLE programs
ADD COLUMN IF NOT EXISTS registration_url TEXT DEFAULT 'https://google.ca';
