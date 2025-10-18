import type { Bookmark, Category, Tag, TodoItem } from './types';
import { browser } from '$app/environment';

const STORAGE_KEY = 'bookmarks-data';

interface AppState {
	bookmarks: Bookmark[];
	categories: Category[];
	tags: Tag[];
	todos: TodoItem[];
}

function loadFromStorage(): AppState {
	if (!browser) {
		return {
			bookmarks: [],
			categories: [],
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
			return parsed;
		}
	} catch (e) {
		console.error('Failed to load data from localStorage:', e);
	}

	return {
		bookmarks: [],
		categories: [],
		tags: [],
		todos: []
	};
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

	get categories() {
		return this.state.categories;
	}

	get tags() {
		return this.state.tags;
	}

	get todos() {
		return this.state.todos;
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

	// Category operations
	addCategory(category: Omit<Category, 'id'>) {
		const newCategory: Category = {
			...category,
			id: crypto.randomUUID()
		};
		this.state.categories.push(newCategory);
		saveToStorage(this.state);
		return newCategory;
	}

	updateCategory(id: string, updates: Partial<Category>) {
		const index = this.state.categories.findIndex((c) => c.id === id);
		if (index !== -1) {
			this.state.categories[index] = {
				...this.state.categories[index],
				...updates
			};
			saveToStorage(this.state);
		}
	}

	deleteCategory(id: string) {
		// Remove the category and all its children
		const removeChildren = (parentId: string) => {
			const children = this.state.categories.filter((c) => c.parentId === parentId);
			children.forEach((child) => {
				removeChildren(child.id);
				this.state.categories = this.state.categories.filter((c) => c.id !== child.id);
			});
		};

		removeChildren(id);
		this.state.categories = this.state.categories.filter((c) => c.id !== id);
		// Update bookmarks that reference this category
		this.state.bookmarks = this.state.bookmarks.map((b) =>
			b.categoryId === id ? { ...b, categoryId: undefined } : b
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
			categories: this.state.categories,
			tags: this.state.tags,
			todos: this.state.todos,
			exportDate: new Date().toISOString()
		};
	}

	importData(data: {
		bookmarks?: Bookmark[];
		categories?: Category[];
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
		if (data.categories) {
			data.categories.forEach((c) => {
				if (!this.state.categories.find((existing) => existing.name === c.name)) {
					this.state.categories.push(c);
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
			categories: [],
			tags: [],
			todos: []
		};
		saveToStorage(this.state);
	}
}

export const bookmarkStore = new BookmarkStore();
