# FPF Bounded Context

**Project**: Atlas Sports CMS
**Domain**: Youth/Adult Sports Programs CMS & Landing Site
**Initialized**: 2026-01-13

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Runtime**: React 19.2.3
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix primitives)
- **Backend**: Supabase (Auth, Database, SSR)
- **Forms**: react-hook-form + Zod v4.3.5
- **Language**: TypeScript 5

## Vocabulary

| Term | Definition |
|------|------------|
| Program | A sports offering (e.g., flag football, soccer) with schedule, ages, features |
| Event | Calendar event with title, dates, times, location, program association |
| Announcement | Admin-created news post with title, content, images, publish dates |
| Admin Portal | `/admin/*` routes for managing programs, events, announcements |
| Broker | Internal user (~50) who manages registrations and programs |
| Site Settings | Registration status, contact info |

## Invariants (System Constraints)

1. **Reliability over cleverness** - Enterprise internal tool for ~50 brokers
2. **No unnecessary dependencies** - Prefer simple, proven patterns
3. **Supabase is the backend** - All data flows through Supabase
4. **shadcn/ui for UI** - Use existing components from `components/ui/`
5. **No branch creation** - Work on current branch only
6. **Always build on completion** - Run `npm run build` at task end
7. **Never read .env** - Environment variables are private
8. **Use `&apos;` in JSX** - Not in JS strings (they render literally)
9. **Zod v4 uses `issues`** - Not `errors` for error handling
10. **Select.Item no empty value** - Use 'none' placeholder instead

## Known Technical Constraints

| Issue | Solution |
|-------|----------|
| Zod v4 error handling | Use `err.issues[0].message` not `err.errors[0].message` |
| TypeScript inference with Supabase | Add `as any` cast to Supabase client calls |
| Select.Item empty value | Use 'none' placeholder instead of empty string |
| Programs page property names | Use legacy format (logo, youthAges) not snake_case |

## API Constraints

- `/api/sync` and `/api/verify` require `Authorization: Bearer $CRON_SECRET`

## Assurance Levels

| Level | Meaning |
|-------|---------|
| L0 | Observation - Unverified hypothesis or note |
| L1 | Substantiated - Passed logical consistency check |
| L2 | Verified - Empirically tested and confirmed |
| Invalid | Disproved claims (kept for learning) |
