# manishPortfolio

Personal developer portfolio for **Manish Kumar** — built as a digital scrapbook.

Stack: **React + Vite + Framer Motion + Lucide React** with custom CSS (no Tailwind).

## Getting started

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

## Adding your assets

Drop these files into `public/`:

```
public/
├── resume.pdf
└── images/
    ├── manish.jpg
    ├── nsut.png
    ├── school.png
    ├── portfolio.png
    ├── ecommerce.png
    └── dashboard.png
```

Missing images fall back to styled placeholders — nothing breaks.

## Structure

```
src/
├── components/
│   ├── Navbar.jsx        Left notebook sidebar with scroll-spy
│   ├── Hero.jsx          Hero + photo + code annotations
│   ├── QuickFacts.jsx    Peach sticky note (age / location / role)
│   ├── Skills.jsx        Ruled notebook page with skill tags
│   ├── Education.jsx     Mint paper with hand-drawn timeline
│   ├── Achievements.jsx  Pinned cards
│   ├── Projects.jsx      Taped photo cards
│   ├── Contact.jsx       Contact card + paper plane
│   ├── Footer.jsx
│   ├── Paper.jsx         Reusable paper wrapper
│   ├── Tape.jsx          Masking-tape strip
│   └── Doodle.jsx        SVG doodle library (star, plane, trophy, ...)
├── App.jsx
├── main.jsx
└── index.css             All theming lives here (CSS variables)
```

## Theming

Three modes: `light`, `system`, `dark`. Toggle from the sidebar.
Dark mode preserves the paper aesthetic — no neon dashboard.

## Notes

- All colors, fonts and spacing live in CSS variables at the top of `index.css`.
- Fonts (Caveat, Kalam, IBM Plex Mono, Inter, Permanent Marker) are loaded from Google Fonts in `index.html`.
- Rotation, tape placement, and torn edges are utility classes — reuse them freely.
