# TMX Social Media Content Generator - Project Walkthrough

## Project Overview

This is a **Next.js 15** web application built for the **Tanzania Mercantile Exchange (TMX)**. The application helps TMX staff generate social media content, posters, and price tables for commodity auctions across Tanzania.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.2 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^3.4.1 | Styling |
| **shadcn/ui** | - | UI component library (Radix-based) |
| **Framer Motion** | ^12.0.6 | Animations |
| **html-to-image** | ^1.11.13 | PNG export functionality |
| **Lucide React** | ^0.451.0 | Icons |

---

## Project Structure (After Refactoring)

```
tmx-socials-generator/
├── src/
│   ├── app/                              # Next.js App Router pages
│   │   ├── layout.tsx                    # Root layout with sidebar
│   │   ├── page.tsx                      # Home page
│   │   ├── globals.css                   # Global styles & CSS variables
│   │   ├── commodity-price/              # Price table generator
│   │   ├── dashboard/                    # Dashboard (placeholder)
│   │   ├── region-code/                  # Region codes reference
│   │   ├── social-media-generator/       # Copy-paste content generator
│   │   └── social-media-poster/          # Visual poster creator
│   │
│   ├── lib/                              # ✨ NEW: Shared library
│   │   ├── types/
│   │   │   └── index.ts                  # All TypeScript types
│   │   ├── constants/
│   │   │   ├── index.ts                  # Re-exports all constants
│   │   │   ├── crops.ts                  # Crops, translations, images
│   │   │   ├── locations.ts              # Tanzanian regions
│   │   │   ├── organizations.ts          # Org mappings & logos
│   │   │   └── social-tags.ts            # FB/IG tags & hashtags
│   │   └── utils/
│   │       ├── index.ts                  # Re-exports all utilities
│   │       ├── formatting.tsx            # Text formatting utilities
│   │       └── time.ts                   # Swahili time formatting
│   │
│   ├── components/
│   │   ├── social-media/                 # ✨ NEW: Shared components
│   │   │   ├── index.ts
│   │   │   ├── LocationSelector.tsx      # Multi-select locations
│   │   │   ├── CropSelector.tsx          # Single-select crop
│   │   │   ├── DateTimePicker.tsx        # Date & time inputs
│   │   │   └── ContentDisplay.tsx        # Read-only textarea + copy
│   │   │
│   │   ├── poster/                       # ✨ NEW: Poster components
│   │   │   ├── index.ts
│   │   │   ├── PosterCanvas.tsx          # Main poster renderer
│   │   │   ├── CropImageSelector.tsx     # Background image gallery
│   │   │   ├── ImageUpload.tsx           # File upload component
│   │   │   ├── PositionSlider.tsx        # X/Y position controls
│   │   │   ├── DateCircleEditor.tsx      # Date circle editor
│   │   │   └── LogoManager.tsx           # Footer logos manager
│   │   │
│   │   ├── generator/                    # ✨ NEW: Generator components
│   │   │   ├── index.ts
│   │   │   └── SocialContentTabs.tsx     # YT/FB/IG content tabs
│   │   │
│   │   ├── ui/                           # shadcn/ui components (25)
│   │   ├── SocialMediaTitleGenerator.tsx # Title generator (legacy)
│   │   ├── app-sidebar.tsx               # Navigation sidebar
│   │   └── breadcrumbs.tsx               # Breadcrumb navigation
│   │
│   └── hooks/
│       ├── use-mobile.tsx                # Mobile detection hook
│       └── use-toast.ts                  # Toast notifications
│
├── public/images/                        # Static assets
│   ├── logos/                            # TMX, government, org logos
│   ├── crop/                             # Crop background images
│   └── backgrounds/                      # Overlay images
│
├── .agent/                               # Agent documentation
│   ├── walkthrough.md                    # This file
│   └── implementation_plan.md            # Refactoring plan
│
└── package.json
```

---

## Core Features

### 1. 🖼️ Social Media Poster Creator
**Location:** `src/app/social-media-poster/page.tsx`

Creates customizable 1080x1080px auction posters with:
- Bilingual content (Swahili + English)
- Crop-specific background images
- Customizable logos, colors, and positioning
- PNG export functionality

### 2. 📝 Social Media Title Generator
**Location:** `src/components/SocialMediaTitleGenerator.tsx`

Generates copy-paste content for:
- YouTube live session titles
- Facebook posts with tags
- Instagram posts with handles

### 3. 💰 Commodity Price Generator
**Location:** `src/app/commodity-price/page.tsx`

Creates 1000x1000px price table images with commodity codes.

### 4. 🗺️ Region Codes Reference
**Location:** `src/app/region-code/page.tsx`

Displays all 28 Tanzanian regions and their codes.

---

## New Modular Components

### Shared Types (`src/lib/types/index.ts`)
```typescript
type CropName = "BEAN" | "CASHEW" | "CHICK PEA" | ... | "SUNFLOWER"

interface PosterState {
  topText: string
  heading: PositionableElement
  paragraph: PositionableElement
  backgroundImage: string | null
  backgroundStyle: BackgroundStyle
  headerFooterBackgroundColor: string
  dateCircle: DateCircleState
  topLeftLogo: string | null
  topRightLogo: string | null
  footerLogos: string[]
}
```

### Shared Constants (`src/lib/constants/`)
- **CROPS** - Array of 13 commodity types
- **CROP_TRANSLATIONS_SW** - Swahili translations
- **CROP_NAMES_EN** - English display names
- **CROP_BACKGROUND_IMAGES** - Image galleries per crop
- **AVAILABLE_LOCATIONS** - 28 Tanzanian regions
- **ORGANIZATION_MAP** - Crop → organization mappings
- **LOGO_URL_MAP** - Organization → logo paths
- **FACEBOOK_TAGS** / **INSTAGRAM_TAGS** / **HASHTAGS**

### Shared Utilities (`src/lib/utils/`)
- **toCamelCase(str)** - Capitalize each word
- **formatList(items, lang)** - Join with "and"/"na"
- **formatOrganizations(orgs, lang)** - Format org list
- **renderRichText(text)** - Parse **bold** markdown
- **formatTime(time, lang)** - Swahili time conversion

### Reusable UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `LocationSelector` | social-media/ | Multi-select location badges |
| `CropSelector` | social-media/ | Single-select crop picker |
| `DateTimePicker` | social-media/ | Date and time inputs |
| `ContentDisplay` | social-media/ | Read-only textarea + copy |
| `PosterCanvas` | poster/ | 1080x1080 poster renderer |
| `CropImageSelector` | poster/ | Background image gallery |
| `ImageUpload` | poster/ | File upload with preview |
| `PositionSlider` | poster/ | X/Y position slider |
| `DateCircleEditor` | poster/ | Edit date circle content |
| `LogoManager` | poster/ | Add/remove footer logos |
| `SocialContentTabs` | generator/ | YT/FB/IG content tabs |

---

## Supported Data

### Commodities (13)
| English | Swahili | Code |
|---------|---------|------|
| Coffee | Kahawa | CF |
| Sesame | Ufuta | SS |
| Soya | Soya | SY |
| Beans | Maharage | BN |
| Cocoa | Kakao | CC |
| Chick Peas | Dengu | CP |
| Pigeon Peas | Mbaazi | PP |
| Cashew | Korosho | CW |
| Cotton | Pamba | CT |
| Sunflower | Alizeti | SF |
| Groundnuts | Karanga | GN |
| Gemstones | Madini | GM |
| Green Grams | Choroko | GG |

### Organizations
- **Coffee**: TCB, TCDC, WRRB
- **Cashew**: CBT, TCDC, WRRB
- **Gemstones**: MC (Mining Commission)
- **Most others**: COPRA, TCDC, WRRB

### Regions (28)
All mainland Tanzania regions plus Zanzibar and Pemba.

---

## Key Patterns

### Swahili Time Formatting
```typescript
// 10:30 → "Saa Nne na nusu Asubuhi"
formatTime("10:30", "sw")

// Swahili hours are 6 hours behind the clock
// Periods: Asubuhi, Mchana, Jioni, Usiku
```

### Rich Text Rendering
```typescript
// "Hello **world**" → Hello <strong>world</strong>
renderRichText("Hello **world**")
```

### Component Imports
```typescript
// Import shared components
import { LocationSelector, CropSelector } from "@/components/social-media"
import { PosterCanvas, ImageUpload } from "@/components/poster"
import { SocialContentTabs } from "@/components/generator"

// Import constants
import { CROPS, AVAILABLE_LOCATIONS, ORGANIZATION_MAP } from "@/lib/constants"

// Import types
import type { CropName, PosterState } from "@/lib/types"

// Import utilities
import { formatTime, toCamelCase } from "@/lib/utils"
```

---

## Development Commands

```bash
# Start development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## Summary

This application is a **specialized internal tool** for TMX staff to:

1. **Generate consistent branding** - All posters follow TMX standards
2. **Save time** - Auto-generates bilingual content
3. **Ensure quality** - 1080x1080 high-resolution exports
4. **Reduce errors** - Pre-configured organization mappings

The recent refactoring created **19 new modular files** that:
- Centralize shared data (crops, locations, organizations)
- Provide reusable UI components
- Improve code maintainability and testability
