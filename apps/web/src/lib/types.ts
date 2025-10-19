export interface Bookmark {
	id: string;
	title: string;
	url: string;
	description?: string;
	thumbnail?: string;
	favicon?: string;
	collectionId?: string;
	kindId?: string;
	tags: string[];
	status: 'unread' | 'reading' | 'completed' | 'archived';
	createdAt: Date;
	updatedAt: Date;
}

export interface Collection {
	id: string;
	name: string;
	parentId?: string;
	order: number;
	children?: Collection[];
}

export interface Kind {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	order: number;
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
	collectionId?: string;
	bookmarkIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface BookmarkExport {
	bookmarks: Bookmark[];
	collections: Collection[];
	kinds: Kind[];
	tags: Tag[];
	todos: TodoItem[];
	exportDate: string;
}
