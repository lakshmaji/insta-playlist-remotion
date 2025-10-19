import { ulid } from 'ulid';
import type { Bookmark, Collection, Kind, Tag, TodoItem } from './types';

/**
 * Generates seed data for local development
 * @returns Object containing seed data for bookmarks, collections, kinds, tags, and todos
 */
export function getSeedData() {
  // Create kinds (content types)
  const kinds: Kind[] = [
    {
      id: ulid(),
      name: 'Articles',
      description: 'Blog posts, news articles, and other written content',
      icon: '📄',
      order: 0
    },
    {
      id: ulid(),
      name: 'Shopping',
      description: 'Products, online stores, and shopping lists',
      icon: '🛒',
      order: 1
    },
    {
      id: ulid(),
      name: 'Tools',
      description: 'Useful web tools, utilities and services',
      icon: '🔧',
      order: 2
    },
    {
      id: ulid(),
      name: 'Videos',
      description: 'Videos from YouTube and other platforms',
      icon: '🎬',
      order: 3
    },
    {
      id: ulid(),
      name: 'Websites',
      description: 'General websites and web applications',
      icon: '🌐',
      order: 4
    },
    {
      id: ulid(),
      name: 'Resources',
      description: 'Documentation, guides, and learning resources',
      icon: '📚',
      order: 5
    },
    {
      id: ulid(),
      name: 'Design',
      description: 'Design tools, inspiration, and resources',
      icon: '🎨',
      order: 6
    },
    {
      id: ulid(),
      name: 'Music',
      description: 'Songs, playlists, and music services',
      icon: '🎵',
      order: 7
    }
  ];

  // Create collections (categories)
  const developmentId = ulid();
  const designId = ulid();
  const productivityId = ulid();
  
  const collections: Collection[] = [
    // Main collections
    {
      id: developmentId,
      name: 'Development',
      order: 0
    },
    {
      id: designId,
      name: 'Design',
      order: 1
    },
    {
      id: productivityId,
      name: 'Productivity',
      order: 2
    },
    {
      id: ulid(),
      name: 'Personal',
      order: 3
    },
    {
      id: ulid(),
      name: 'Entertainment',
      order: 4
    },
    
    // Development subcategories
    {
      id: ulid(),
      name: 'JavaScript',
      parentId: developmentId,
      order: 0
    },
    {
      id: ulid(),
      name: 'React',
      parentId: developmentId,
      order: 1
    },
    {
      id: ulid(),
      name: 'Svelte',
      parentId: developmentId,
      order: 2
    },
    {
      id: ulid(),
      name: 'Node.js',
      parentId: developmentId,
      order: 3
    },
    
    // Design subcategories
    {
      id: ulid(),
      name: 'UI Inspiration',
      parentId: designId,
      order: 0
    },
    {
      id: ulid(),
      name: 'Color Palettes',
      parentId: designId,
      order: 1
    },
    {
      id: ulid(),
      name: 'Typography',
      parentId: designId,
      order: 2
    },
    
    // Productivity subcategories
    {
      id: ulid(),
      name: 'Task Management',
      parentId: productivityId,
      order: 0
    },
    {
      id: ulid(),
      name: 'Note Taking',
      parentId: productivityId,
      order: 1
    },
    {
      id: ulid(),
      name: 'Time Tracking',
      parentId: productivityId,
      order: 2
    }
  ];

  // Create some tags
  const tags: Tag[] = [
    {
      id: ulid(),
      name: 'favorite',
      color: '#FFC107'
    },
    {
      id: ulid(),
      name: 'tutorial',
      color: '#4CAF50'
    },
    {
      id: ulid(),
      name: 'reference',
      color: '#2196F3'
    },
    {
      id: ulid(),
      name: 'inspiration',
      color: '#9C27B0'
    },
    {
      id: ulid(),
      name: 'free',
      color: '#8BC34A'
    },
    {
      id: ulid(),
      name: 'paid',
      color: '#F44336'
    }
  ];

  // Create some sample bookmarks
  const bookmarks: Bookmark[] = [
    {
      id: ulid(),
      title: 'SvelteKit Documentation',
      url: 'https://kit.svelte.dev/docs',
      description: 'Official documentation for SvelteKit',
      favicon: 'https://kit.svelte.dev/favicon.png',
      collectionId: collections.find(c => c.name === 'Svelte')?.id,
      kindId: kinds.find(k => k.name === 'Resources')?.id,
      tags: [tags.find(t => t.name === 'reference')?.id || ''],
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ulid(),
      title: 'Coolors - Color Palette Generator',
      url: 'https://coolors.co/',
      description: 'Generate perfect color combinations for your designs',
      favicon: 'https://coolors.co/favicon.ico',
      collectionId: collections.find(c => c.name === 'Color Palettes')?.id,
      kindId: kinds.find(k => k.name === 'Tools')?.id,
      tags: [tags.find(t => t.name === 'inspiration')?.id || '', tags.find(t => t.name === 'free')?.id || ''],
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ulid(),
      title: 'Netlify',
      url: 'https://netlify.com',
      description: 'Deploy modern web projects',
      favicon: 'https://netlify.com/favicon.ico',
      collectionId: collections.find(c => c.name === 'Development')?.id,
      kindId: kinds.find(k => k.name === 'Tools')?.id,
      tags: [tags.find(t => t.name === 'free')?.id || ''],
      status: 'reading',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ulid(),
      title: 'Figma',
      url: 'https://figma.com',
      description: 'Collaborative interface design tool',
      favicon: 'https://figma.com/favicon.ico',
      collectionId: collections.find(c => c.name === 'Design')?.id,
      kindId: kinds.find(k => k.name === 'Tools')?.id,
      tags: [tags.find(t => t.name === 'inspiration')?.id || ''],
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ulid(),
      title: 'GitHub',
      url: 'https://github.com',
      description: 'Where the world builds software',
      favicon: 'https://github.com/favicon.ico',
      collectionId: collections.find(c => c.name === 'Development')?.id,
      kindId: kinds.find(k => k.name === 'Websites')?.id,
      tags: [tags.find(t => t.name === 'favorite')?.id || ''],
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Create some todos
  const todos: TodoItem[] = [
    {
      id: ulid(),
      title: 'Research Svelte animation libraries',
      description: 'Find the best animation libraries for Svelte projects',
      completed: false,
      collectionId: collections.find(c => c.name === 'Svelte')?.id,
      bookmarkIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ulid(),
      title: 'Organize design resources',
      description: 'Sort and categorize saved design resources',
      completed: false,
      collectionId: collections.find(c => c.name === 'Design')?.id,
      bookmarkIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ulid(),
      title: 'Read React documentation updates',
      description: 'Check the latest React docs for new features',
      completed: true,
      collectionId: collections.find(c => c.name === 'React')?.id,
      bookmarkIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return {
    bookmarks,
    collections,
    kinds,
    tags,
    todos
  };
}