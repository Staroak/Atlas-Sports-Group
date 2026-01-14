# Generate Program Learn More Page

## Description
When a new program is created via the admin panel and marked as "Published", the public "learn more" page at `/programs/[slug]` is automatically generated. No manual steps required.

## How It Works

The system now reads program data directly from Supabase:

1. **Admin creates program** at `/admin/programs/new`
2. **Fills out Details tab** with features, benefits, what you'll learn, what to bring
3. **Toggles "Published"** switch
4. **Saves** - data goes to Supabase `programs` table
5. **Page appears** automatically at `/programs/[slug]`

### Key Files
- `app/lib/queries/programs.ts` - Database queries with fallback to constants
- `app/programs/[slug]/page.tsx` - Dynamic page that fetches from Supabase
- `app/programs/page.tsx` - Programs listing (also fetches from Supabase)

## Data Flow

```
Admin Form (ProgramForm.tsx)
    ↓
Server Action (createProgram/updateProgram)
    ↓
Supabase `programs` table
    ↓
Query Functions (getProgramBySlug, getPublishedPrograms)
    ↓
Public Pages (/programs, /programs/[slug])
```

## Field Mapping

| Admin Form Field | Database Column    | Public Page Property |
|-----------------|-------------------|---------------------|
| Program Name    | name              | name                |
| URL Slug        | slug              | slug                |
| Tagline         | tagline           | tagline             |
| Description     | description       | description         |
| Logo            | logo_url          | logo                |
| Youth Ages      | youth_ages        | youthAges           |
| Adult Ages      | adult_ages        | adultAges           |
| Schedule        | schedule          | schedule            |
| Features        | features          | features            |
| Benefits        | benefits          | benefits            |
| What You'll Learn | what_youll_learn | whatYoullLearn      |
| What to Bring   | what_to_bring     | whatToBring         |
| Published       | is_published      | (filters visibility)|
| Display Order   | display_order     | (controls sort)     |

## Page Structure

The learn more page (`/programs/[slug]`) displays:

1. **Hero Section**
   - Age badges (youth + adult)
   - Program name, tagline, description
   - Register Now / View All Programs buttons
   - Logo in white container

2. **What You'll Learn**
   - Numbered cards from `whatYoullLearn` array

3. **Program Benefits**
   - Grid with checkmark icons from `benefits` array

4. **Features & What to Bring**
   - Two-column layout
   - Features list (bullet points)
   - What to Bring list (bullet points)
   - Schedule card

5. **CTA Section**
   - Final Register Now button

## Fallback Behavior

If Supabase is unavailable, the system falls back to `PROGRAMS` constant in `app/lib/constants.ts`. This ensures the site works even during database outages.

## When to Use This Skill

Use this skill when:
- User asks how to create a new program page
- User wants to understand the program creation workflow
- Debugging why a program isn't appearing on the public site

## Troubleshooting

**Program not appearing:**
1. Check `is_published` is `true` in database
2. Verify slug is URL-safe (lowercase, hyphens only)
3. Check for database connection errors in server logs

**Images not loading:**
1. Ensure `logo_url` is a valid URL or Supabase storage path
2. Verify Supabase storage bucket permissions
3. Check `next.config.ts` has the domain in `remotePatterns`

**Build fails on static generation:**
- The page uses `generateStaticParams()` to pre-build pages
- If database unreachable during build, falls back to constants
- New programs added after build require revalidation or rebuild
