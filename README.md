# TMX Social Media Content Generator

A comprehensive web application for generating social media content, posters, and price tables for the Tanzania Mercantile Exchange (TMX). Built with Next.js 15, TypeScript, and modern web technologies.

## Features

### 🖼️ Social Media Poster Creator
- Create customizable 1080x1080px auction posters
- Crop-specific background image galleries
- Bilingual content generation (Swahili and English)
- Customizable logos, colors, and element positioning
- Date circle with Swahili date formatting
- High-resolution PNG export

### 📝 Social Media Title Generator
- Generate YouTube video titles for live trading sessions
- Create Facebook and Instagram posts for commodity auctions
- Support for multiple Tanzanian regions and crops
- Pre-configured organization tagging
- Copy-to-clipboard functionality

### 💰 Commodity Price Generator
- Generate official price table images (1000x1000px)
- Support for multiple commodities and regions
- Customizable high/low prices and weights
- Professional table layout with TMX branding

### 🗺️ Region Codes Reference
- Complete list of 28 Tanzanian region codes
- Used for commodity identification and tracking

## Supported Commodities

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

## Technology Stack

- **Framework:** Next.js 15.4.2 (with Turbopack)
- **Language:** TypeScript 5
- **React:** 19.1.0
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui (Radix-based)
- **Animations:** Framer Motion 12
- **Image Generation:** html-to-image
- **Icons:** Lucide React

## Project Structure

```
tmx-socials-generator/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── commodity-price/          # Price table generator
│   │   ├── dashboard/                # Dashboard
│   │   ├── region-code/              # Region codes reference
│   │   ├── social-media-generator/   # Copy-paste content generator
│   │   └── social-media-poster/      # Visual poster creator
│   │
│   ├── lib/                          # Shared library
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── constants/                # Crops, locations, organizations
│   │   └── utils/                    # Formatting & time utilities
│   │
│   ├── components/
│   │   ├── social-media/             # Shared UI components
│   │   │   ├── LocationSelector      # Multi-select locations
│   │   │   ├── CropSelector          # Single-select crop
│   │   │   ├── DateTimePicker        # Date & time inputs
│   │   │   └── ContentDisplay        # Read-only textarea + copy
│   │   │
│   │   ├── poster/                   # Poster-specific components
│   │   │   ├── PosterCanvas          # Main poster renderer
│   │   │   ├── CropImageSelector     # Background gallery
│   │   │   ├── ImageUpload           # File upload
│   │   │   ├── PositionSlider        # X/Y controls
│   │   │   ├── DateCircleEditor      # Date circle editor
│   │   │   └── LogoManager           # Footer logos
│   │   │
│   │   ├── generator/                # Generator components
│   │   │   └── SocialContentTabs     # YT/FB/IG tabs
│   │   │
│   │   └── ui/                       # shadcn/ui components
│   │
│   └── hooks/                        # Custom React hooks
│
├── public/images/                    # Static assets
│   ├── logos/                        # Organization logos
│   ├── crop/                         # Crop background images
│   └── backgrounds/                  # Overlay images
│
└── .agent/                           # Documentation
    ├── walkthrough.md                # Project walkthrough
    └── implementation_plan.md        # Refactoring details
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tmx-socials-generator.git
cd tmx-socials-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

#### Production Build
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t tmx-socials-generator .
docker run -p 3000:3000 tmx-socials-generator
```

#### Development with Hot Reload
```bash
# Run development container with volume mounting
docker-compose --profile dev up dev
```

#### Docker Commands
```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up -d --build
```


## Usage

### Social Media Poster
1. Navigate to `/social-media-poster`
2. Select locations, crop, date, and time
3. Choose a background image or upload custom
4. Adjust element positions as needed
5. Download the poster as PNG

### Title Generator
1. Navigate to `/social-media-generator`
2. Select locations and crop
3. Choose a date
4. Click "Generate Content"
5. Copy the generated content for YouTube, Facebook, or Instagram

### Price Generator
1. Navigate to `/commodity-price`
2. Add commodity rows (up to 4)
3. Select commodity, region, and union
4. Enter prices and weights
5. Download as image

## Key Features

### Swahili Time Formatting
The poster creator converts 24-hour time to traditional Swahili time:
- 10:30 AM → "Saa Nne na nusu Asubuhi"
- Swahili hours are 6 hours offset from the clock
- Periods: Asubuhi (morning), Mchana (afternoon), Jioni (evening), Usiku (night)

### Rich Text Support
Poster text supports **bold** markdown syntax for emphasis.

### Organization Mapping
Each crop automatically maps to its relevant organizations:
- Coffee → TCB, TCDC, WRRB
- Cashew → CBT, TCDC, WRRB
- Gemstones → MC (Mining Commission)
- Most others → COPRA, TCDC, WRRB

## Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for Tanzania Mercantile Exchange (TMX)
- Uses official TMX branding and regional data
- Supports agricultural commodity trading promotion

## Contact

For questions or support, please contact the development team.
