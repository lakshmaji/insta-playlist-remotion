import type { Bookmark, Category } from './types';

/**
 * Parse HTML bookmark file (Netscape format used by most browsers)
 */
export function parseBookmarkHTML(html: string): {
	bookmarks: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>[];
	categories: Omit<Category, 'id'>[];
} {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const bookmarks: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>[] = [];
	const categories: Omit<Category, 'id'>[] = [];
	const categoryMap = new Map<string, string>();

	let order = 0;

	function traverseDL(dl: Element, parentCategoryName?: string) {
		const items = dl.children;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (item.tagName === 'DT') {
				const folder = item.querySelector('h3');
				const link = item.querySelector('a');

				if (folder) {
					// This is a folder/category
					const categoryName = folder.textContent || 'Untitled';
					const fullCategoryName = parentCategoryName
						? `${parentCategoryName} > ${categoryName}`
						: categoryName;

					const category: Omit<Category, 'id'> = {
						name: fullCategoryName,
						parentId: parentCategoryName ? categoryMap.get(parentCategoryName) : undefined,
						order: order++
					};
					categories.push(category);
					categoryMap.set(fullCategoryName, category.name);

					// Look for nested DL
					const nextDL = item.querySelector('dl');
					if (nextDL) {
						traverseDL(nextDL, fullCategoryName);
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
							categoryId: parentCategoryName,
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

	return { bookmarks, categories };
}

/**
 * Export bookmarks to HTML format (Netscape format)
 */
export function exportToBookmarkHTML(
	bookmarks: Bookmark[],
	categories: Category[]
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

	// Build category hierarchy
	const categoryHierarchy = buildCategoryTree(categories);

	function renderCategory(category: Category & { children?: Category[] }, depth = 1): string {
		const indent = '    '.repeat(depth);
		const categoryBookmarks = bookmarks.filter((b) => b.categoryId === category.id);

		let html = `${indent}<DT><H3>${category.name}</H3>\n${indent}<DL><p>\n`;

		// Render bookmarks in this category
		for (const bookmark of categoryBookmarks) {
			const favicon = bookmark.favicon ? ` ICON="${bookmark.favicon}"` : '';
			html += `${indent}    <DT><A HREF="${bookmark.url}"${favicon}>${bookmark.title}</A>\n`;
		}

		// Render subcategories
		if (category.children) {
			for (const child of category.children) {
				html += renderCategory(child, depth + 1);
			}
		}

		html += `${indent}</DL><p>\n`;
		return html;
	}

	let body = '';

	// Render root categories
	for (const category of categoryHierarchy.filter((c) => !c.parentId)) {
		body += renderCategory(category);
	}

	// Render uncategorized bookmarks
	const uncategorized = bookmarks.filter((b) => !b.categoryId);
	if (uncategorized.length > 0) {
		for (const bookmark of uncategorized) {
			const favicon = bookmark.favicon ? ` ICON="${bookmark.favicon}"` : '';
			body += `    <DT><A HREF="${bookmark.url}"${favicon}>${bookmark.title}</A>\n`;
		}
	}

	return header + body + footer;
}

function buildCategoryTree(categories: Category[]): (Category & { children?: Category[] })[] {
	const categoryMap = new Map<string, Category & { children?: Category[] }>();
	const roots: (Category & { children?: Category[] })[] = [];

	// Create a map of all categories
	categories.forEach((cat) => {
		categoryMap.set(cat.id, { ...cat, children: [] });
	});

	// Build the tree
	categoryMap.forEach((cat) => {
		if (cat.parentId) {
			const parent = categoryMap.get(cat.parentId);
			if (parent) {
				parent.children!.push(cat);
			} else {
				roots.push(cat);
			}
		} else {
			roots.push(cat);
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
