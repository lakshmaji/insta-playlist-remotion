# Bookmark Manager Monorepo

A full-featured bookmark management application built with SvelteKit, organized as a Turborepo monorepo.

## Features

- **Bookmark Management**: Add, edit, delete, and organize bookmarks with thumbnails
- **Hierarchical Categories**: Create categories and unlimited nested subcategories
- **Tag System**: Tag bookmarks for easy filtering and organization
- **Status Tracking**: Track bookmark status (unread, reading, completed, archived)
- **Todo List Integration**: Attach todos to categories for learning paths
- **Import/Export**: 
  - Import bookmarks from browser exports (HTML format)
  - Export to HTML (browser-compatible) or JSON (full data backup)
- **Search & Filter**: Search by title, URL, description, and filter by tags or status
- **Local Storage**: All data persists in browser localStorage

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

Run Svelte type checking:

```bash
npm run check
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Managing Changes

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

To add a changeset when you make changes:

```bash
npm run changeset
```

Follow the prompts to describe your changes. When ready to version and release:

```bash
npm run version  # Update versions and generate changelog
npm run release  # Build and publish
```

## Deployment

### Deploy to Vercel

This project can be deployed to Vercel using GitHub Actions. The deployment workflow can be triggered manually.

#### Prerequisites

Before deploying, you need to set up the following secrets in your GitHub repository:

1. **VERCEL_TOKEN**: Your Vercel authentication token
   - Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token and copy it

2. **VERCEL_ORG_ID**: Your Vercel organization/team ID
   - Run `vercel link` in your project directory locally
   - Find the value in `.vercel/project.json` under `orgId`
   - Or find it in your Vercel project settings

3. **VERCEL_PROJECT_ID**: Your Vercel project ID
   - Run `vercel link` in your project directory locally
   - Find the value in `.vercel/project.json` under `projectId`
   - Or find it in your Vercel project settings

#### Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the three secrets mentioned above

#### Manual Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Select the **Deploy to Vercel** workflow
3. Click **Run workflow**
4. Choose the deployment environment:
   - **production**: Deploy to production
   - **preview**: Deploy to preview environment
5. Click **Run workflow** to start the deployment

The workflow will:
- Install dependencies
- Build the application
- Deploy to Vercel using the Vercel CLI
- Provide deployment URL in the workflow logs

## Usage

### Adding Bookmarks

1. Click the "+ Add Bookmark" button
2. Fill in the bookmark details (title, URL, description, tags)
3. Optionally assign to a category and set status
4. Click "Save"

### Creating Categories

1. Click "+ New Category" in the sidebar
2. Enter category name and optionally select a parent category
3. Categories can be nested multiple levels deep

### Organizing with Tags

- Add comma-separated tags when creating/editing bookmarks
- Click tag buttons to filter bookmarks by tags
- Multiple tags can be selected for AND filtering

### Managing Todos

1. Click "+ Add" in the To-Do List panel
2. Enter todo title and description
3. Optionally assign to a category (great for learning paths)
4. Check off todos as you complete them

### Import/Export

**Importing from Browser:**
1. Export bookmarks from your browser:
   - Chrome/Edge: Menu → Bookmarks → Bookmark Manager → ⋮ → Export bookmarks
   - Firefox: Menu → Bookmarks → Manage Bookmarks → Import and Backup → Export Bookmarks to HTML
   - Safari: File → Export Bookmarks
2. Click "Import / Export" button
3. Select "HTML (Browser Export)" and choose your file

**Exporting:**
1. Click "Import / Export" button
2. Choose "Export as HTML" (browser-compatible) or "Export as JSON" (includes all data)
3. File will be downloaded automatically

## Monorepo Structure

This project is organized as a Turborepo monorepo:

```
├── apps/
│   └── web/                 # Main SvelteKit application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/      # Svelte components
│       │   │   │   ├── BookmarkCard.svelte
│       │   │   │   ├── CategoryTree.svelte
│       │   │   │   ├── BookmarkModal.svelte
│       │   │   │   ├── CategoryModal.svelte
│       │   │   │   ├── ImportExportModal.svelte
│       │   │   │   └── TodoPanel.svelte
│       │   │   ├── store.svelte.ts  # State management with Svelte 5 runes
│       │   │   ├── types.ts         # TypeScript type definitions
│       │   │   └── utils.ts         # Utility functions (import/export, thumbnails)
│       │   └── routes/
│       │       ├── +page.svelte     # Main application page
│       │       └── +layout.svelte   # Root layout
│       ├── static/                  # Static assets
│       └── package.json             # App-specific dependencies
├── packages/                # Shared packages (future use)
├── turbo.json              # Turborepo configuration
└── package.json            # Root package with workspace configuration
```

## Technologies Used

- **Turborepo**: High-performance build system for monorepos
- **SvelteKit**: Full-stack framework
- **Svelte 5**: Latest Svelte with runes for reactivity
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework for styling and responsiveness
- **ESLint**: Code linting and quality checks
- **Changesets**: Version management and changelog generation
- **GitHub Actions**: CI/CD pipeline for automated testing and builds
- **Browser APIs**: localStorage, File API, DOMParser

## License

MIT
