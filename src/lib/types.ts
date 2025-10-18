export interface Bookmark {
	id: string;
	title: string;
	url: string;
	description?: string;
	thumbnail?: string;
	favicon?: string;
	categoryId?: string;
	tags: string[];
	status: 'unread' | 'reading' | 'completed' | 'archived';
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	id: string;
	name: string;
	parentId?: string;
	order: number;
	children?: Category[];
}

export interface Tag {
	id: string;
	name: string;
	color?: string;
}

export interface TodoItem {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	categoryId?: string;
	bookmarkIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface BookmarkExport {
	bookmarks: Bookmark[];
	categories: Category[];
	tags: Tag[];
	todos: TodoItem[];
	exportDate: string;
}
