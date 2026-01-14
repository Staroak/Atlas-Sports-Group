# Atlas Sports CMS - Development Context

## Project Overview

Building a Content Management System (CMS) for the Atlas Sports landing site that allows a non-technical client to:
1. **Manage Programs** - Add, edit, remove sports programs with a simple form interface
2. **Manage Calendar Events** - Add events that display on a calendar
3. **Create Announcements** - Post news and updates to the site

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **React**: 19.2.3
- **Database/Auth/Storage**: Supabase
- **Validation**: Zod v4.3.5
- **UI Components**: shadcn/ui (Radix UI based)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## What Was Completed

### 1. Database Schema (Supabase)

Created tables for:
- `programs` - Sports programs with name, slug, tagline, description, logo, ages, features, benefits, schedule, etc.
- `events` - Calendar events with title, dates, times, location, program association
- `announcements` - News posts with title, content, images, publish dates
- `admin_users` - Admin access control
- `site_settings` - Registration status, contact info

Schema file: `supabase/schema.sql`

### 2. Supabase Configuration

- **Client files**:
  - `app/lib/supabase/client.ts` - Browser client
  - `app/lib/supabase/server.ts` - Server client for Server Components

- **Storage bucket**: `logos` bucket for program image uploads
  - Setup script: `supabase/storage.sql`

- **Next.js image config**: Added `*.supabase.co` to `next.config.ts` remotePatterns

### 3. Server Actions (CRUD Operations)

Created in `app/lib/actions/`:
- `programs.ts` - Create, update, delete, reorder programs
- `events.ts` - Create, update, delete events
- `announcements.ts` - Create, update, delete announcements
- `settings.ts` - Update site settings

### 4. Query Functions (Read Operations)

Created in `app/lib/queries/`:
- `programs.ts` - Fetch programs with fallback to constants
- `events.ts` - Fetch events
- `announcements.ts` - Fetch announcements
- `settings.ts` - Fetch site settings

### 5. Admin Panel

Complete admin interface at `/admin/`:

```
app/admin/
├── layout.tsx              # Admin layout with sidebar
├── page.tsx                # Dashboard (redirects to /admin/programs)
├── login/page.tsx          # Login form
├── programs/
│   ├── page.tsx            # Programs list with drag-to-reorder
│   ├── ProgramsTable.tsx   # Client component with drag-and-drop
│   ├── new/page.tsx        # Create program form
│   └── [id]/page.tsx       # Edit program form
├── events/
│   ├── page.tsx            # Events list
│   ├── new/page.tsx        # Create event form
│   └── [id]/page.tsx       # Edit event form
├── announcements/
│   ├── page.tsx            # Announcements list
│   ├── new/page.tsx        # Create announcement form
│   └── [id]/page.tsx       # Edit announcement form
├── settings/page.tsx       # Site settings
└── components/
    ├── AdminSidebar.tsx
    ├── AdminHeader.tsx
    ├── DataTable.tsx
    ├── ArrayFieldEditor.tsx
    ├── ImageUpload.tsx     # Drag-and-drop image upload
    └── PublishToggle.tsx
```

### 6. Form Components

**ProgramForm.tsx**:
- Inline validation with error messages
- Auto-slug generation from name
- Array field editors for features, benefits, what you'll learn, what to bring
- Tabs: Basic Info, Ages & Schedule, Details
- **ImageUpload**: Drag-and-drop logo upload to Supabase Storage

**EventForm.tsx** and **AnnouncementForm.tsx** - Similar structure

### 7. Programs List with Drag-to-Reorder

**ProgramsTable.tsx** - Client component:
- GripVertical (3-dot) handle on each row for dragging
- Visual feedback during drag (blue highlight on drop target)
- Auto-saves order to database via `reorderPrograms` action
- Order reflected on public `/programs` page

### 8. Events Calendar Component

`app/components/EventsCalendar.tsx`:
- Calendar view with date selection (50% larger cells for visibility)
- **Multi-day event support**: Events spanning multiple days highlight all days in range
- **Past event styling**: Past days of ongoing events shown in grey, current/future in blue
- Shows event details when date is selected (title, time, location, description)
- **Program linking**: Events linked to a program show a "View [Program Name]" hyperlink
- Lists upcoming events for current month
- Supports events that overlap month boundaries

**Key helper functions:**
- `isDateInEventRange()` - Checks if a date falls within an event's start/end range
- `getEventDateRange()` - Returns all dates for an event (for calendar highlighting)

**Event query** (`app/lib/queries/events.ts`):
- Fetches events where `start_date >= today` OR `end_date >= today` (includes ongoing multi-day events)
- Joins program data (name, slug) for hyperlinking

### 9. Route Protection

`proxy.ts` - Protects `/admin/*` routes with Supabase auth (Next.js 16 convention)

### 10. Seed Data

`supabase/seed-programs.sql` - 4 existing programs:
1. Skyhawks Flag Football
2. Home Run Jays Baseball & Slow Pitch
3. All Girls Field Hockey
4. All Sports Spring & Summer Camps


### 11. ERROR POP-ups

- Any errors on the admin or user site should be plain english, not anything in developer terms or error code.
- The admin and users have 0 knowledge about code. Make sure to translate. 
- Can show error codes in console 



## Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| Zod v4 error handling | Use `err.issues[0].message` not `err.errors[0].message` |
| TypeScript inference with Supabase | Add `as any` cast to Supabase client calls |
| Select.Item empty value | Use 'none' placeholder instead of empty string |
| Programs page property names | Use legacy format (logo, youthAges) not snake_case |
| Calendar hydration mismatch | Use `toISOString().split('T')[0]` for date formatting |
| Next.js Image with Supabase | Add `*.supabase.co` to `next.config.ts` remotePatterns |
| **Form fields null on tab switch** | Tabs unmount inactive content. Add hidden inputs for ALL form fields to ensure submission regardless of active tab (ProgramForm.tsx lines 191-205) |
| **JSONB array null validation** | Use `z.preprocess` to convert null arrays to `[]` and filter null items. Also add `parseJsonArray` helper in server actions |
| **Multi-day events only showing first day** | Use `.or()` filter in Supabase query to check both `start_date` and `end_date`. Calendar component needs `eachDayOfInterval()` to generate all dates in range |
| **Windows reserved filename `nul`** | Use Git Bash `rm` command to delete - PowerShell can't handle Windows reserved names |

## Supabase Setup (User Tasks)

1. Run `supabase/schema.sql` to create tables
2. Run `supabase/storage.sql` to create logos storage bucket
3. Run `supabase/seed-programs.sql` to populate programs
4. Enable Row Level Security (RLS) on all tables
5. Create RLS policies (public read for published, admin full access)
6. Create admin user via Supabase Auth dashboard
7. Add admin user to `admin_users` table

## File Structure

```
app/
├── admin/                    # Admin panel
│   ├── components/
│   │   └── ImageUpload.tsx   # Drag-and-drop upload
│   └── programs/
│       └── ProgramsTable.tsx # Draggable list
├── components/
│   ├── ui/calendar.tsx       # Fixed hydration
│   └── EventsCalendar.tsx
├── lib/
│   ├── actions/              # Server actions
│   ├── queries/              # Read operations
│   ├── supabase/             # Supabase clients
│   └── types/database.ts

supabase/
├── schema.sql                # Database schema
├── storage.sql               # Storage bucket setup
└── seed-programs.sql         # Seed data

proxy.ts                      # Route protection
next.config.ts                # Supabase image domains
```

## Build Status

✅ Build passes successfully.

## Testing Checklist

- [x] Admin login works
- [x] Programs CRUD works
- [x] Program image upload works
- [x] Program drag-to-reorder works
- [x] Programs appear on public /programs page in correct order
- [x] Programs appear on /registration page dynamically
- [x] Program "learn more" pages work (/programs/[slug])
- [x] Events appear on calendar
- [x] Events CRUD works
- [ ] Announcements CRUD works
- [ ] Settings can be updated

---

## Recent Changes (This Session)

### Dynamic Program Pages from Supabase

Refactored public pages to fetch from Supabase instead of hardcoded constants.

**Files Modified:**
- `app/lib/queries/programs.ts` - Added `getPublishedProgramSlugs()` function
- `app/programs/[slug]/page.tsx` - Now uses `getProgramBySlug()` instead of constants
- `app/registration/page.tsx` - Converted to server component, fetches from Supabase
- `app/registration/RegistrationContent.tsx` - New client component for scroll behavior

**How It Works Now:**
```
Admin creates program → Saves to Supabase → Appears automatically on:
  - /programs (listing)
  - /programs/[slug] (learn more page)
  - /registration (registration cards)
```

All pages have fallback to `PROGRAMS` constant if database unavailable.

### Program Creation Workflow

1. Admin creates program at `/admin/programs/new`
2. Fills out Details tab (features, benefits, what you'll learn, what to bring)
3. Toggles "Published" and saves
4. Program card appears automatically on all three public pages

### Skill Documentation

Created `.claude/skills/generate-program-page.md` documenting the program page generation workflow.

---

## Session: Jan 13, 2026 - Events Calendar Enhancements

### Multi-Day Event Support

**Problem:** Events with duration (e.g., 1 week) only displayed on the first day.

**Root Cause:**
- Calendar only checked `start_date` when filtering/highlighting
- Query filtered out events where `start_date < today` (missing ongoing events)

**Solution:**
1. Updated `getPublishedEvents()` query to use `.or()` filter:
   ```typescript
   .or(`start_date.gte.${today},end_date.gte.${today}`)
   ```
2. Added helper functions in `EventsCalendar.tsx`:
   - `isDateInEventRange()` - checks if date falls within event range
   - `getEventDateRange()` - returns all dates using `eachDayOfInterval()`
3. Calendar modifiers now separate past vs current dates for styling

**Files Modified:**
- `app/lib/queries/events.ts` - Updated query, added `EventWithProgram` type
- `app/components/EventsCalendar.tsx` - Multi-day support, program links, styling
- `app/components/ui/calendar.tsx` - Increased cell size (spacing 8 → 12)

### Calendar UI Improvements

- **Size**: 50% larger cells (`--cell-size: spacing(12)`)
- **Card**: Minimum width 400px, larger padding and text
- **Past events**: Grey styling for dates that have passed
- **Current events**: Blue highlighting for today and future dates
- **Date range display**: Multi-day events show "Jan 15 - Jan 21" format
- **Program links**: Events with linked programs show clickable "View [Program]" link
