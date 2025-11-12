# TMX Social Media Content Generator

A comprehensive web application for generating social media content, posters, and price tables for the Tanzania Mercantile Exchange (TMX). Built with Next.js, TypeScript, and modern web technologies.

## Features

### 🏷️ Social Media Title Generator
- Generate YouTube video titles for live trading sessions
- Create Facebook and Instagram posts for commodity auctions
- Support for multiple Tanzanian regions and crops
- Bilingual content generation (Swahili and English)
- Copy-to-clipboard functionality

### 🖼️ Social Media Poster Creator
- Create customizable auction posters
- Support for crop-specific background images
- Bilingual poster generation (Swahili and English)
- Customizable logos and branding
- Date circle positioning and styling
- High-resolution PNG export (1080x1080px)

### 💰 Commodity Price Generator
- Generate official price table images
- Support for multiple commodities and regions
- Customizable high/low prices and weights
- Professional table layout with TMX branding
- PNG export functionality

### 🗺️ Region Codes Reference
- Complete list of Tanzanian region codes
- Used for commodity identification and tracking

### 📊 Dashboard
- Centralized navigation and access to all tools
- Modern sidebar interface

## Supported Commodities

- Coffee (Kahawa)
- Sesame (Ufuta)
- Soya (Soya)
- Beans (Maharage)
- Cocoa (Kakao)
- Chick Peas (Dengu)
- Pigeon Peas (Mbaazi)
- Cashew (Korosho)
- Cotton (Pamba)
- Sunflower (Alizeti)
- Groundnuts (Karanga)
- Gemstones (Madini)
- Green Grams (Choroko)

## Supported Regions

All 31 Tanzanian regions including Arusha, Dar es Salaam, Dodoma, Geita, Iringa, Kagera, Katavi, Kigoma, Kilimanjaro, Lindi, Manyara, Mara, Mbeya, Morogoro, Mtwara, Mwanza, Njombe, Pemba, Pwani, Rukwa, Ruvuma, Shinyanga, Simiyu, Singida, Songwe, Tabora, Tanga, Zanzibar.

## Technology Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Image Generation:** html-to-image
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tmx-socials-generator.git
cd tmx-socials-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Navigate** through the sidebar to access different tools
2. **Social Media Generator:** Select regions, crop, date, and time to generate content
3. **Poster Creator:** Customize poster elements and download high-quality images
4. **Price Generator:** Input commodity prices and export as images
5. **Region Codes:** Reference region codes for commodity identification

## Project Structure

```
tmx-socials-generator/
├── src/
│   ├── app/
│   │   ├── commodity-price/
│   │   ├── dashboard/
│   │   ├── region-code/
│   │   ├── social-media-generator/
│   │   └── social-media-poster/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Custom components
│   └── lib/
├── public/
│   └── images/          # Logos, backgrounds, crop images
├── package.json
└── README.md
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
