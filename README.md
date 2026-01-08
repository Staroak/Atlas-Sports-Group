# Atlas Sports Group Website

A modern, responsive website for Atlas Sports Group built with Next.js 15, Tailwind CSS v4, and shadcn/ui components.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Project Structure

```
app/
├── components/
│   ├── home/
│   │   └── Hero.tsx              # Homepage hero section
│   ├── layout/
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Footer.tsx            # Site footer (hidden on homepage)
│   │   └── Container.tsx         # Reusable container wrapper
│   └── ui/
│       ├── button.tsx            # Button component with variants
│       ├── card.tsx              # Card components
│       ├── badge.tsx             # Badge component
│       ├── calendar.tsx          # Calendar component
│       └── BackButton.tsx        # Back navigation button
├── lib/
│   └── constants.ts              # Site data, programs, policies
├── programs/
│   ├── page.tsx                  # Programs listing page
│   └── [slug]/
│       └── page.tsx              # Individual program detail pages
├── registration/
│   └── page.tsx                  # Registration page with all programs
├── layout.tsx                    # Root layout (header, footer, fonts)
├── page.tsx                      # Homepage
└── globals.css                   # Global styles and Tailwind config
```

---

## Key Files to Edit

### Content & Data

| File | Purpose |
|------|---------|
| `app/lib/constants.ts` | **Main data file** - Edit programs, navigation links, policies, site name, tagline, contact info |

### Pages

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage wrapper |
| `app/components/home/Hero.tsx` | Homepage content (logo, tagline, CTA button, background) |
| `app/programs/page.tsx` | Programs listing with cards and calendar |
| `app/programs/[slug]/page.tsx` | Individual program detail pages |
| `app/registration/page.tsx` | Registration page with all programs |

### Layout & Navigation

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout - fonts, header, footer, back button |
| `app/components/layout/Header.tsx` | Navigation bar and logo |
| `app/components/layout/Footer.tsx` | Footer content and links |

### Styling

| File | Purpose |
|------|---------|
| `app/globals.css` | Global styles, Tailwind theme colors (`--atlas-navy`, `--atlas-sky`) |
| `app/components/ui/button.tsx` | Button variants (`cta`, `atlas`, `outline`, etc.) |

---

## Key Features

### Homepage
- Full-screen hero with gradient background and cloud decorations
- Centered logo, site name, tagline
- Single CTA button ("Explore Our Programs")
- No footer on homepage

### Programs Page
- Grid layout with program cards
- Calendar sidebar showing seasons
- "Learn More" links to individual program pages
- "Register" links to registration page (auto-scrolls to program)

### Individual Program Pages (`/programs/[slug]`)
- Dynamic routes based on program slug
- Hero section with program details
- "What You'll Learn" section
- Benefits, features, schedule, what to bring
- CTA to register

### Registration Page
- Sticky navigation to jump between programs
- Individual sections for each program
- Auto-scrolls to specific program when accessed via hash (e.g., `/registration#skyhawks-flag-football`)

### Navigation
- Back button (black circle with white arrow) on all pages except homepage
- Responsive header with mobile menu
- "Register Now" CTA button in header

---

## Common Customizations

### Change Site Name/Tagline
Edit `app/lib/constants.ts`:
```typescript
export const SITE_NAME = "Atlas Sports Group";
export const SITE_TAGLINE = "Building Healthy Habits Through Sport";
```

### Add/Edit Programs
Edit the `PROGRAMS` array in `app/lib/constants.ts`:
```typescript
export const PROGRAMS: Program[] = [
  {
    id: "unique-id",
    name: "Program Name",
    slug: "program-slug",  // URL-friendly name
    tagline: "Short tagline",
    description: "Full description...",
    logo: "/logos/logo-file.png",
    youthAges: "Ages 5-18",
    adultAges: "Adult Co-Ed",  // Optional
    features: ["Feature 1", "Feature 2"],
    benefits: ["Benefit 1", "Benefit 2"],
    whatYoullLearn: ["Skill 1", "Skill 2"],
    schedule: "When the program runs",
    whatToBring: ["Item 1", "Item 2"],
  },
];
```

### Change Navigation Links
Edit `NAV_LINKS` in `app/lib/constants.ts`:
```typescript
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  // Add more links...
];
```

### Change Homepage Background
Edit `app/components/home/Hero.tsx`, line ~12:
```typescript
className="... bg-gradient-to-br from-[#B8D8FF] via-[#CCF2FF] to-[#78FFD0] ..."
```

### Change Theme Colors
Edit `app/globals.css`:
```css
@theme inline {
  --color-atlas-navy: #1e3a5f;
  --color-atlas-sky: #87CEEB;
}
```

### Change Button Styles
Edit `app/components/ui/button.tsx` variants:
```typescript
cta: "bg-green-500 text-white hover:bg-green-600 ...",
atlas: "bg-blue-600 text-white hover:bg-blue-700 ...",
```

### Update Registration Status
Edit `app/lib/constants.ts`:
```typescript
export const REGISTRATION_STATUS = {
  isOpen: false,  // Set to true when registration opens
  openDate: "Late January 2026",
  message: "Registration will open late January 2026.",
};
```

---

## Adding New Pages

1. Create a new folder in `app/` with the route name (e.g., `app/about/`)
2. Add a `page.tsx` file inside
3. Import and use existing components (`Container`, `Button`, etc.)
4. Add the route to `NAV_LINKS` in `constants.ts` if needed

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Fonts**: Inter (body), Lexend (headings)
- **Language**: TypeScript

---

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
