# Elements Facsimile Viewer

A static site for viewing and browsing Elements facsimile PDFs and diagrams, automatically deployed to GitHub Pages.

## Features

- **PDF Library**: Browse and download all available PDF documents
- **Diagram Viewer**: View cropped diagrams organized by page, classification, and index
- **Auto-generated Content**: Site content is automatically generated from the repository structure
- **Responsive Design**: Works on desktop and mobile devices
- **GitHub Pages Ready**: Automatically deployed via GitHub Actions

## Development

### Prerequisites

- Node.js 18+
- Yarn package manager

### Setup

```bash
cd app
yarn install
```

### Development Server

```bash
yarn dev
```

Open http://localhost:5173 to view the site.

### Build

```bash
yarn build
```

Built files will be in the `dist/` directory.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Setup Required

1. Go to your repository's Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically deploy on the next push to main

### Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Checks out the repository
2. Sets up Node.js and installs dependencies
3. Builds the static site using Vite
4. Deploys to GitHub Pages

## Site Structure

- **Index Page** (`/`): Lists all PDFs with download links and diagram viewer access
- **Diagram Viewer** (`/diagrams?key=<document_key>`): Shows all diagram crops for a specific document

## Data Generation

The site automatically scans the repository structure at build time:

- **PDFs**: All `.pdf` files in the `docs/` directory
- **Diagrams**: Directories in `docs/diagrams/` with corresponding PDF keys
- **Image Parsing**: Crop images are parsed from filename format `<page>_<classification>_<index>.jpg`

No manual data maintenance is required - the site updates automatically when new files are added to the repository.

## File Structure

```
app/
├── dist/                 # Built site (generated)
├── public/              # Static assets
│   └── .nojekyll       # GitHub Pages configuration
├── index.html          # Main page
├── diagrams.html       # Diagram viewer
├── main.js            # Main page JavaScript
├── diagrams.js        # Diagram viewer JavaScript
├── style.css          # Tailwind CSS
├── vite.config.js     # Vite configuration
├── vite-plugin-inject-data.js  # Custom plugin for data generation
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js  # PostCSS configuration
└── package.json       # Dependencies and scripts
```