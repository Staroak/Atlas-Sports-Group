-- Seed the 4 existing programs into the database
-- Run this in Supabase SQL Editor after running schema.sql

INSERT INTO programs (name, slug, tagline, description, logo_url, youth_ages, adult_ages, features, benefits, what_youll_learn, what_to_bring, schedule, display_order, is_published)
VALUES
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
