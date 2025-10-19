import type { Bookmark, Collection } from './types';

/**
 * Parse HTML bookmark file (Netscape format used by most browsers)
 */
export function parseBookmarkHTML(html: string): {
	bookmarks: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>[];
	collections: Omit<Collection, 'id'>[];
} {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const bookmarks: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>[] = [];
	const collections: Omit<Collection, 'id'>[] = [];
	const collectionMap = new Map<string, string>();

	let order = 0;

	function traverseDL(dl: Element, parentCollectionName?: string) {
		const items = dl.children;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (item.tagName === 'DT') {
				const folder = item.querySelector('h3');
				const link = item.querySelector('a');

				if (folder) {
					// This is a folder/collection
					const collectionName = folder.textContent || 'Untitled';
					const fullCollectionName = parentCollectionName
						? `${parentCollectionName} > ${collectionName}`
						: collectionName;

					const collection: Omit<Collection, 'id'> = {
						name: fullCollectionName,
						parentId: parentCollectionName ? collectionMap.get(parentCollectionName) : undefined,
						order: order++
					};
					collections.push(collection);
					collectionMap.set(fullCollectionName, collection.name);

					// Look for nested DL
					const nextDL = item.querySelector('dl');
					if (nextDL) {
						traverseDL(nextDL, fullCollectionName);
					}
				} else if (link) {
					// This is a bookmark
					const url = link.getAttribute('href');
					const title = link.textContent || 'Untitled';
					const icon = link.getAttribute('icon');

					if (url) {
						bookmarks.push({
							title,
							url,
							favicon: icon || undefined,
							collectionId: parentCollectionName,
							tags: [],
							status: 'unread'
						});
					}
				}
			}
		}
	}

	const mainDL = doc.querySelector('dl');
	if (mainDL) {
		traverseDL(mainDL);
	}

	return { bookmarks, collections };
}

/**
 * Export bookmarks to HTML format (Netscape format)
 */
export function exportToBookmarkHTML(
	bookmarks: Bookmark[],
	collections: Collection[]
): string {
	const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`;

	const footer = `</DL><p>`;

	// Build collection hierarchy
	const collectionHierarchy = buildCollectionTree(collections);

	function renderCollection(collection: Collection & { children?: Collection[] }, depth = 1): string {
		const indent = '    '.repeat(depth);
		const collectionBookmarks = bookmarks.filter((b) => b.collectionId === collection.id);

		let html = `${indent}<DT><H3>${collection.name}</H3>\n${indent}<DL><p>\n`;

		// Render bookmarks in this collection
		for (const bookmark of collectionBookmarks) {
			const favicon = bookmark.favicon ? ` ICON="${bookmark.favicon}"` : '';
			html += `${indent}    <DT><A HREF="${bookmark.url}"${favicon}>${bookmark.title}</A>\n`;
		}

		// Render subcollections
		if (collection.children) {
			for (const child of collection.children) {
				html += renderCollection(child, depth + 1);
			}
		}

		html += `${indent}</DL><p>\n`;
		return html;
	}

	let body = '';

	// Render root collections
	for (const collection of collectionHierarchy.filter((c) => !c.parentId)) {
		body += renderCollection(collection);
	}

	// Render uncollectionized bookmarks
	const uncollectionized = bookmarks.filter((b) => !b.collectionId);
	if (uncollectionized.length > 0) {
		for (const bookmark of uncollectionized) {
			const favicon = bookmark.favicon ? ` ICON="${bookmark.favicon}"` : '';
			body += `    <DT><A HREF="${bookmark.url}"${favicon}>${bookmark.title}</A>\n`;
		}
	}

	return header + body + footer;
}

function buildCollectionTree(collections: Collection[]): (Collection & { children?: Collection[] })[] {
	const collectionMap = new Map<string, Collection & { children?: Collection[] }>();
	const roots: (Collection & { children?: Collection[] })[] = [];

	// Create a map of all collections
	collections.forEach((col) => {
		collectionMap.set(col.id, { ...col, children: [] });
	});

	// Build the tree
	collectionMap.forEach((col) => {
		if (col.parentId) {
			const parent = collectionMap.get(col.parentId);
			if (parent) {
				parent.children!.push(col);
			} else {
				roots.push(col);
			}
		} else {
			roots.push(col);
		}
	});

	return roots;
}

/**
 * Generate thumbnail URL for a website
 * Uses various screenshot services
 */
export function generateThumbnail(url: string): string {
	// Using a free screenshot service
	// You can replace this with other services or your own implementation
	const encodedUrl = encodeURIComponent(url);
	return `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodedUrl}&width=400&height=300`;
}

/**
 * Get favicon URL for a website
 */
export function getFaviconUrl(url: string): string {
	try {
		const urlObj = new URL(url);
		return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
	} catch {
		return '';
	}
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, contentType: string) {
	const blob = new Blob([content], { type: contentType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
