# Water Eye — YouTube Thumbnail Designer Portfolio

Official production portfolio for **Water Eye**, an Indian YouTube Thumbnail Designer crafting high-CTR, scroll-stopping visual assets for YouTube creators.

Stack: **React + Vite + Framer Motion + Lucide React** with custom CSS design tokens.

## Features

- **Hero Showcase**: Prominent Water Eye portrait avatar with interactive floating thumbnail previews.
- **Selected Thumbnails Gallery**: High-resolution 16:9 thumbnail showcase with category filters (Minecraft, Gaming, 3D & Cinema 4D, Brand & Packs) and full-screen inspection lightbox.
- **Atmospheric Creator Cards**: Procedural two-layer atmospheric background cards featuring creators worked with, channel avatars, and ratings.
- **Services & Delivery**: Core thumbnail design, Cinema 4D/Blender 3D character poses, series bulk packs, and channel branding.
- **About Section**: Creative workflow, hook strategy, and 3D lighting pipeline.
- **Contact & Commission**: Direct booking and commission channels with fast turnaround.
- **Theming**: Dark mode (optimized for high-contrast thumbnails) and Light mode toggle.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── components/
│   ├── Navbar.jsx             Left sidebar navigation with scroll-spy & theme toggle
│   ├── Hero.jsx               Hero section with headline, avatar & floating thumbnails
│   ├── QuickFacts.jsx         Design turnaround & quality standards strip
│   ├── ThumbnailGallery.jsx   Filterable thumbnail gallery with full inspection modal
│   ├── Creators.jsx           2-layer atmospheric creator showcase cards
│   ├── Services.jsx           Thumbnail design offerings & deliverables
│   ├── About.jsx              Water Eye background, software stack & design pipeline
│   ├── Contact.jsx            Direct commission inquiries & turnaround info
│   ├── Footer.jsx             Copyright & credits
│   ├── Paper.jsx              Reusable paper wrapper
│   ├── Tape.jsx               Decorative masking tape component
│   └── Doodle.jsx             SVG doodle library
├── App.jsx
├── main.jsx
└── index.css                  Design tokens and responsive stylesheet
```
