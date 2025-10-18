# Bookmark Manager

A full-featured bookmark management application built with SvelteKit.

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

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

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

## Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── BookmarkCard.svelte
│   │   ├── CategoryTree.svelte
│   │   ├── BookmarkModal.svelte
│   │   ├── CategoryModal.svelte
│   │   ├── ImportExportModal.svelte
│   │   └── TodoPanel.svelte
│   ├── store.svelte.ts      # State management with Svelte 5 runes
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions (import/export, thumbnails)
├── routes/
│   ├── +page.svelte         # Main application page
│   └── +layout.svelte       # Root layout
└── app.html                 # HTML template
```

## Technologies Used

- **SvelteKit**: Full-stack framework
- **Svelte 5**: Latest Svelte with runes for reactivity
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Browser APIs**: localStorage, File API, DOMParser

## License

MIT
