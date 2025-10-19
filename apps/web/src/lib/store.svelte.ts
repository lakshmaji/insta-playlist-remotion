import type { Bookmark, Collection, Kind, Tag, TodoItem } from './types';
import { browser } from '$app/environment';
import { getSeedData } from './seed';

const STORAGE_KEY = 'bookmarks-data';

interface AppState {
	bookmarks: Bookmark[];
	collections: Collection[];
	kinds: Kind[];
	tags: Tag[];
	todos: TodoItem[];
}

function loadFromStorage(): AppState {
	if (!browser) {
		return {
			bookmarks: [],
			collections: [],
			kinds: [],
			tags: [],
			todos: []
		};
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Convert date strings back to Date objects
			parsed.bookmarks = parsed.bookmarks.map((b: any) => ({
				...b,
				createdAt: new Date(b.createdAt),
				updatedAt: new Date(b.updatedAt)
			}));
			parsed.todos = parsed.todos.map((t: any) => ({
				...t,
				createdAt: new Date(t.createdAt),
				updatedAt: new Date(t.updatedAt)
			}));
			
			// Handle backward compatibility - convert categories to collections
			if (parsed.categories && !parsed.collections) {
				parsed.collections = parsed.categories;
				delete parsed.categories;
			}
			
			// Initialize kinds if not present
			if (!parsed.kinds) {
				parsed.kinds = [];
			}
			
			return parsed;
		}
	} catch (e) {
		console.error('Failed to load data from localStorage:', e);
	}

	// Use seed data for local development if no existing data
	return getSeedData();
}

function saveToStorage(state: AppState) {
	if (browser) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (e) {
			console.error('Failed to save data to localStorage:', e);
		}
	}
}

class BookmarkStore {
	private state = $state<AppState>(loadFromStorage());

	get bookmarks() {
		return this.state.bookmarks;
	}

	get collections() {
		return this.state.collections;
	}

	get kinds() {
		return this.state.kinds;
	}

	get tags() {
		return this.state.tags;
	}

	get todos() {
		return this.state.todos;
	}
	
	// Reset store to seed data (useful for development)
	resetToSeedData() {
		if (confirm('Are you sure you want to reset all data? This will delete all your current bookmarks, collections, etc.')) {
			const seedData = getSeedData();
			this.state.bookmarks = seedData.bookmarks;
			this.state.collections = seedData.collections;
			this.state.kinds = seedData.kinds;
			this.state.tags = seedData.tags;
			this.state.todos = seedData.todos;
			
			saveToStorage(this.state);
		}
	}

	// Bookmark operations
	addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) {
		const newBookmark: Bookmark = {
			...bookmark,
			id: crypto.randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date()
		};
		this.state.bookmarks.push(newBookmark);
		saveToStorage(this.state);
		return newBookmark;
	}

	updateBookmark(id: string, updates: Partial<Bookmark>) {
		const index = this.state.bookmarks.findIndex((b) => b.id === id);
		if (index !== -1) {
			this.state.bookmarks[index] = {
				...this.state.bookmarks[index],
				...updates,
				updatedAt: new Date()
			};
			saveToStorage(this.state);
		}
	}

	deleteBookmark(id: string) {
		this.state.bookmarks = this.state.bookmarks.filter((b) => b.id !== id);
		saveToStorage(this.state);
	}

	// Collection operations
	addCollection(collection: Omit<Collection, 'id'>) {
		const newCollection: Collection = {
			...collection,
			id: crypto.randomUUID()
		};
		this.state.collections.push(newCollection);
		saveToStorage(this.state);
		return newCollection;
	}

	updateCollection(id: string, updates: Partial<Collection>) {
		const index = this.state.collections.findIndex((c) => c.id === id);
		if (index !== -1) {
			this.state.collections[index] = {
				...this.state.collections[index],
				...updates
			};
			saveToStorage(this.state);
		}
	}

	deleteCollection(id: string) {
		// Remove the collection and all its children
		const removeChildren = (parentId: string) => {
			const children = this.state.collections.filter((c) => c.parentId === parentId);
			children.forEach((child) => {
				removeChildren(child.id);
				this.state.collections = this.state.collections.filter((c) => c.id !== child.id);
			});
		};

		removeChildren(id);
		this.state.collections = this.state.collections.filter((c) => c.id !== id);
		// Update bookmarks that reference this collection
		this.state.bookmarks = this.state.bookmarks.map((b) =>
			b.collectionId === id ? { ...b, collectionId: undefined } : b
		);
		saveToStorage(this.state);
	}
	
	// Kind operations
	addKind(kind: Omit<Kind, 'id'>) {
		const newKind: Kind = {
			...kind,
			id: crypto.randomUUID()
		};
		this.state.kinds.push(newKind);
		saveToStorage(this.state);
		return newKind;
	}

	updateKind(id: string, updates: Partial<Kind>) {
		const index = this.state.kinds.findIndex((k) => k.id === id);
		if (index !== -1) {
			this.state.kinds[index] = {
				...this.state.kinds[index],
				...updates
			};
			saveToStorage(this.state);
		}
	}

	deleteKind(id: string) {
		this.state.kinds = this.state.kinds.filter((k) => k.id !== id);
		// Update bookmarks that reference this kind
		this.state.bookmarks = this.state.bookmarks.map((b) =>
			b.kindId === id ? { ...b, kindId: undefined } : b
		);
		saveToStorage(this.state);
	}

	// Tag operations
	addTag(tag: Omit<Tag, 'id'>) {
		const newTag: Tag = {
			...tag,
			id: crypto.randomUUID()
		};
		this.state.tags.push(newTag);
		saveToStorage(this.state);
		return newTag;
	}

	updateTag(id: string, updates: Partial<Tag>) {
		const index = this.state.tags.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.state.tags[index] = {
				...this.state.tags[index],
				...updates
			};
			saveToStorage(this.state);
		}
	}

	deleteTag(id: string) {
		this.state.tags = this.state.tags.filter((t) => t.id !== id);
		// Remove tag from all bookmarks
		this.state.bookmarks = this.state.bookmarks.map((b) => ({
			...b,
			tags: b.tags.filter((t) => t !== id)
		}));
		saveToStorage(this.state);
	}

	// Todo operations
	addTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) {
		const newTodo: TodoItem = {
			...todo,
			id: crypto.randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date()
		};
		this.state.todos.push(newTodo);
		saveToStorage(this.state);
		return newTodo;
	}

	updateTodo(id: string, updates: Partial<TodoItem>) {
		const index = this.state.todos.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.state.todos[index] = {
				...this.state.todos[index],
				...updates,
				updatedAt: new Date()
			};
			saveToStorage(this.state);
		}
	}

	deleteTodo(id: string) {
		this.state.todos = this.state.todos.filter((t) => t.id !== id);
		saveToStorage(this.state);
	}

	// Import/Export operations
	exportData() {
		return {
			bookmarks: this.state.bookmarks,
			collections: this.state.collections,
			kinds: this.state.kinds,
			tags: this.state.tags,
			todos: this.state.todos,
			exportDate: new Date().toISOString()
		};
	}

	importData(data: {
		bookmarks?: Bookmark[];
		collections?: Collection[];
		kinds?: Kind[];
		tags?: Tag[];
		todos?: TodoItem[];
	}) {
		if (data.bookmarks) {
			data.bookmarks.forEach((b) => {
				if (!this.state.bookmarks.find((existing) => existing.url === b.url)) {
					this.state.bookmarks.push({
						...b,
						createdAt: new Date(b.createdAt),
						updatedAt: new Date(b.updatedAt)
					});
				}
			});
		}
		if (data.collections) {
			data.collections.forEach((c) => {
				if (!this.state.collections.find((existing) => existing.name === c.name)) {
					this.state.collections.push(c);
				}
			});
		}
		if (data.kinds) {
			data.kinds.forEach((k) => {
				if (!this.state.kinds.find((existing) => existing.name === k.name)) {
					this.state.kinds.push(k);
				}
			});
		}
		if (data.tags) {
			data.tags.forEach((t) => {
				if (!this.state.tags.find((existing) => existing.name === t.name)) {
					this.state.tags.push(t);
				}
			});
		}
		if (data.todos) {
			data.todos.forEach((t) => {
				this.state.todos.push({
					...t,
					createdAt: new Date(t.createdAt),
					updatedAt: new Date(t.updatedAt)
				});
			});
		}
		saveToStorage(this.state);
	}

	clearAll() {
		this.state = {
			bookmarks: [],
			collections: [],
			kinds: [],
			tags: [],
			todos: []
		};
		saveToStorage(this.state);
	}
}

export const bookmarkStore = new BookmarkStore();
