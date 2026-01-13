-- Atlas Sports CMS Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- ============================================
-- TABLES
-- ============================================

-- Programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  tagline VARCHAR(500),
  description TEXT,
  logo_url VARCHAR(500),
  youth_ages VARCHAR(100),
  adult_ages VARCHAR(100),
  features JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  what_youll_learn JSONB DEFAULT '[]'::jsonb,
  what_to_bring JSONB DEFAULT '[]'::jsonb,
  schedule VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  is_all_day BOOLEAN DEFAULT false,
  location VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  image_url VARCHAR(500),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  publish_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table (key-value store)
CREATE TABLE site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_programs_published ON programs(is_published);
CREATE INDEX idx_programs_order ON programs(display_order);

CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_published ON events(is_published);
CREATE INDEX idx_events_program ON events(program_id);

CREATE INDEX idx_announcements_published ON announcements(is_published);
CREATE INDEX idx_announcements_dates ON announcements(publish_at, expires_at);

-- ============================================
-- HELPER FUNCTION
-- ============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Programs policies
CREATE POLICY "Public can read published programs"
  ON programs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to programs"
  ON programs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Events policies
CREATE POLICY "Public can read published events"
  ON events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to events"
  ON events FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Announcements policies
CREATE POLICY "Public can read active announcements"
  ON announcements FOR SELECT
  USING (
    is_published = true
    AND (publish_at IS NULL OR publish_at <= NOW())
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Admins have full access to announcements"
  ON announcements FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin users policies
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  USING (is_admin());

-- Site settings policies
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('registration_status', '{"isOpen": false, "openDate": "Late January 2026", "message": "Registration will open late January 2026. Check back soon!"}'),
  ('contact_info', '{"email": "info@atlassportsgroup.com", "serviceArea": "Serving the Tri-Cities: Port Moody, Coquitlam, Port Coquitlam"}');

-- ============================================
-- SEED DATA (Optional - uncomment to add existing programs)
-- ============================================

/*
INSERT INTO programs (name, slug, tagline, description, logo_url, youth_ages, adult_ages, features, benefits, what_youll_learn, what_to_bring, schedule, display_order, is_published) VALUES
(
  'Skyhawks Flag Football',
  'skyhawks-flag-football',
  'Fast-paced, non-contact fun for all ages',
  'Our Skyhawks Flag Football program offers age-appropriate training and games in a non-contact format. Players develop skills, learn strategy, and build teamwork in a fun, inclusive environment.',
  '/logos/Skyhawks Football.png',
  'Ages 5-18',
  'Adult Co-Ed',
  '["Non-contact flag format", "Age-grouped teams", "Skill progression", "Game play"]',
  '["Build speed and agility", "Learn strategic thinking", "Develop teamwork skills", "Safe, inclusive environment", "Certified coaches"]',
  '["Proper throwing and catching techniques", "Route running and defensive positioning", "Game rules and flag football strategy", "Teamwork and sportsmanship"]',
  '["Athletic clothing", "Running shoes", "Water bottle", "Mouthguard (optional)"]',
  'Weekly sessions, Spring (Apr-Jun), Summer (Jul-Aug), Fall (Sept-Dec)',
  0,
  true
),
(
  'Home Run Jays Baseball & Slow Pitch',
  'home-run-jays',
  'From fundamentals to game day confidence',
  'Home Run Jays teaches baseball fundamentals through engaging drills and game play. Our program builds confidence at the plate, in the field, and on the bases for players of all skill levels.',
  '/logos/Jays home Run.png',
  'Ages 4-18',
  'Adult Co-Ed Slow Pitch',
  '["Fundamentals training", "Game play", "Confidence-building", "Recreational focus"]',
  '["Master hitting and fielding basics", "Build hand-eye coordination", "Learn base running strategy", "Supportive, fun atmosphere", "Quality coaching"]',
  '["Hitting mechanics and batting stance", "Fielding ground balls and fly balls", "Throwing accuracy and arm strength", "Base running and game awareness"]',
  '["Athletic clothing", "Baseball glove", "Cleats or running shoes", "Water bottle"]',
  'Weekly sessions, Spring (Apr-Jun), Summer (Jul-Aug), Fall (Sept-Dec)',
  1,
  true
),
(
  'All Girls Field Hockey',
  'all-girls-field-hockey',
  'Empowering girls through sport',
  'Our All Girls Field Hockey program provides a supportive, girl-focused environment to learn stick skills, teamwork, and fitness. From grassroots introduction to skill development, we create a space for girls to thrive.',
  '/logos/All Girls Field Hockey.png',
  'Ages 4-18',
  'Adult Recreational League',
  '["Girls-only environment", "Grassroots introduction", "Skill development", "Fitness focus"]',
  '["Build confidence and leadership", "Develop stick handling skills", "Improve fitness and coordination", "Supportive community", "Expert coaching"]',
  '["Stick handling and ball control", "Passing and receiving techniques", "Defensive and offensive positioning", "Game rules and teamwork strategies"]',
  '["Athletic clothing", "Field hockey stick (can be provided)", "Shin guards", "Mouthguard", "Water bottle"]',
  'Weekly sessions, Spring (Apr-Jun), Fall (Sept-Dec)',
  2,
  true
),
(
  'All Sports Spring & Summer Camps',
  'all-sports-camps',
  'Multi-sport fun, every single week',
  'Our All Sports Camps offer weekly multi-sport experiences perfect for school breaks and summer vacation. Kids try different sports, build athletic skills, and make new friends in a dynamic, engaging environment.',
  '/logos/Tri City Spring summer camp.png',
  'Ages 5-12',
  NULL,
  '["Weekly registration", "Multi-sport rotation", "Spring break and summer options", "No long-term commitment"]',
  '["Explore multiple sports", "Build overall athleticism", "Make new friends", "Flexible scheduling", "Fun, energetic environment"]',
  '["Fundamentals of flag football, baseball, field hockey, and more", "General athletic skills (running, throwing, catching)", "Teamwork and cooperation", "Sportsmanship and fair play"]',
  '["Athletic clothing", "Running shoes", "Water bottle", "Sunscreen", "Snacks"]',
  'Spring Break: Two weeks in March | Summer: 8 weeks (Jul-Aug), weekly registration',
  3,
  true
);
*/
