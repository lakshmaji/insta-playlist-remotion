import { x as attr, y as attr_class, z as stringify, F as ensure_array_like, G as attr_style } from "../../chunks/index.js";
import "clsx";
import { e as escape_html } from "../../chunks/context.js";
function loadFromStorage() {
  {
    return { bookmarks: [], categories: [], tags: [], todos: [] };
  }
}
function saveToStorage(state) {
}
class BookmarkStore {
  state = loadFromStorage();
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
  addBookmark(bookmark) {
    const newBookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.state.bookmarks.push(newBookmark);
    saveToStorage(this.state);
    return newBookmark;
  }
  updateBookmark(id, updates) {
    const index = this.state.bookmarks.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.state.bookmarks[index] = {
        ...this.state.bookmarks[index],
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      };
      saveToStorage(this.state);
    }
  }
  deleteBookmark(id) {
    this.state.bookmarks = this.state.bookmarks.filter((b) => b.id !== id);
    saveToStorage(this.state);
  }
  // Category operations
  addCategory(category) {
    const newCategory = { ...category, id: crypto.randomUUID() };
    this.state.categories.push(newCategory);
    saveToStorage(this.state);
    return newCategory;
  }
  updateCategory(id, updates) {
    const index = this.state.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.state.categories[index] = { ...this.state.categories[index], ...updates };
      saveToStorage(this.state);
    }
  }
  deleteCategory(id) {
    const removeChildren = (parentId) => {
      const children = this.state.categories.filter((c) => c.parentId === parentId);
      children.forEach((child) => {
        removeChildren(child.id);
        this.state.categories = this.state.categories.filter((c) => c.id !== child.id);
      });
    };
    removeChildren(id);
    this.state.categories = this.state.categories.filter((c) => c.id !== id);
    this.state.bookmarks = this.state.bookmarks.map((b) => b.categoryId === id ? { ...b, categoryId: void 0 } : b);
    saveToStorage(this.state);
  }
  // Tag operations
  addTag(tag) {
    const newTag = { ...tag, id: crypto.randomUUID() };
    this.state.tags.push(newTag);
    saveToStorage(this.state);
    return newTag;
  }
  updateTag(id, updates) {
    const index = this.state.tags.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.state.tags[index] = { ...this.state.tags[index], ...updates };
      saveToStorage(this.state);
    }
  }
  deleteTag(id) {
    this.state.tags = this.state.tags.filter((t) => t.id !== id);
    this.state.bookmarks = this.state.bookmarks.map((b) => ({ ...b, tags: b.tags.filter((t) => t !== id) }));
    saveToStorage(this.state);
  }
  // Todo operations
  addTodo(todo) {
    const newTodo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.state.todos.push(newTodo);
    saveToStorage(this.state);
    return newTodo;
  }
  updateTodo(id, updates) {
    const index = this.state.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.state.todos[index] = {
        ...this.state.todos[index],
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      };
      saveToStorage(this.state);
    }
  }
  deleteTodo(id) {
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
      exportDate: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  importData(data) {
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
    this.state = { bookmarks: [], categories: [], tags: [], todos: [] };
    saveToStorage(this.state);
  }
}
const bookmarkStore = new BookmarkStore();
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return "";
  }
}
function BookmarkCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { bookmark, onStatusChange } = $$props;
    const statusColors = {
      unread: "bg-gray-200",
      reading: "bg-blue-200",
      completed: "bg-green-200",
      archived: "bg-yellow-200"
    };
    $$renderer2.push(`<div class="bookmark-card svelte-1v51o52"><div class="bookmark-thumbnail svelte-1v51o52">`);
    if (bookmark.thumbnail) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", bookmark.thumbnail)}${attr("alt", bookmark.title)} class="svelte-1v51o52"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="placeholder-thumbnail svelte-1v51o52"><img${attr("src", getFaviconUrl(bookmark.url))} alt="" class="favicon svelte-1v51o52"/></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bookmark-content svelte-1v51o52"><div class="bookmark-header svelte-1v51o52"><a${attr("href", bookmark.url)} target="_blank" rel="noopener noreferrer" class="bookmark-title svelte-1v51o52">${escape_html(bookmark.title)}</a> <span${attr_class(`bookmark-status ${stringify(statusColors[bookmark.status])}`, "svelte-1v51o52")}>${escape_html(bookmark.status)}</span></div> `);
    if (bookmark.description) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="bookmark-description svelte-1v51o52">${escape_html(bookmark.description)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (bookmark.tags.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bookmark-tags svelte-1v51o52"><!--[-->`);
      const each_array = ensure_array_like(bookmark.tags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$renderer2.push(`<span class="tag svelte-1v51o52">${escape_html(tag)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="bookmark-actions svelte-1v51o52">`);
    $$renderer2.select(
      {
        value: bookmark.status,
        onchange: (e) => onStatusChange(bookmark.id, e.currentTarget.value),
        class: "status-select"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "unread" }, ($$renderer4) => {
          $$renderer4.push(`Unread`);
        });
        $$renderer3.option({ value: "reading" }, ($$renderer4) => {
          $$renderer4.push(`Reading`);
        });
        $$renderer3.option({ value: "completed" }, ($$renderer4) => {
          $$renderer4.push(`Completed`);
        });
        $$renderer3.option({ value: "archived" }, ($$renderer4) => {
          $$renderer4.push(`Archived`);
        });
      },
      "svelte-1v51o52"
    );
    $$renderer2.push(` <button class="btn-edit svelte-1v51o52">Edit</button> <button class="btn-delete svelte-1v51o52">Delete</button></div></div></div>`);
  });
}
function CategoryTree($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      categories,
      selectedCategoryId
    } = $$props;
    function buildTree(cats) {
      const map = /* @__PURE__ */ new Map();
      const roots = [];
      cats.forEach((cat) => {
        map.set(cat.id, { ...cat, children: [] });
      });
      map.forEach((cat) => {
        if (cat.parentId) {
          const parent = map.get(cat.parentId);
          if (parent) {
            parent.children.push(cat);
          } else {
            roots.push(cat);
          }
        } else {
          roots.push(cat);
        }
      });
      return roots;
    }
    const tree = buildTree(categories);
    let expandedCategories = /* @__PURE__ */ new Set();
    function isExpanded(categoryId) {
      return expandedCategories.has(categoryId);
    }
    function categoryNode($$renderer3, category, level) {
      const expanded = isExpanded(category.id);
      $$renderer3.push(`<div class="tree-item svelte-1ni6fr0"${attr_style(`padding-left: ${stringify(level * 1.5 + 1)}rem`)}><div${attr_class("category-content svelte-1ni6fr0", void 0, { "selected": selectedCategoryId === category.id })}>`);
      if (category.children.length > 0) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<button class="expand-btn svelte-1ni6fr0">${escape_html(expanded ? "▼" : "▶")}</button>`);
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<span class="expand-placeholder svelte-1ni6fr0"></span>`);
      }
      $$renderer3.push(`<!--]--> <span class="category-name svelte-1ni6fr0">📁 ${escape_html(category.name)}</span> <div class="category-actions svelte-1ni6fr0"><button class="btn-action svelte-1ni6fr0" title="Add subcategory">+</button> <button class="btn-action svelte-1ni6fr0" title="Edit">✏️</button> <button class="btn-action svelte-1ni6fr0" title="Delete">🗑️</button></div></div></div> `);
      if (expanded && category.children.length > 0) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(category.children);
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let child = each_array[$$index_1];
          categoryNode($$renderer3, child, level + 1);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    $$renderer2.push(`<div class="category-tree svelte-1ni6fr0"><div class="tree-header svelte-1ni6fr0"><h3 class="svelte-1ni6fr0">Categories</h3> <button class="btn-add-category svelte-1ni6fr0">+ New Category</button></div> <div${attr_class("tree-item svelte-1ni6fr0", void 0, { "selected": !selectedCategoryId })}><span>📚 All Bookmarks</span></div> <!--[-->`);
    const each_array_1 = ensure_array_like(tree);
    for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
      let category = each_array_1[$$index];
      categoryNode($$renderer2, category, 0);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function TodoPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { todos, categories } = $$props;
    const todosByCategory = () => {
      const grouped = /* @__PURE__ */ new Map();
      todos.forEach((todo) => {
        const key = todo.categoryId || void 0;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key).push(todo);
      });
      return grouped;
    };
    $$renderer2.push(`<div class="todo-panel svelte-s1u1ya"><div class="todo-header svelte-s1u1ya"><h3 class="svelte-s1u1ya">📝 To-Do List</h3> <button class="btn-add svelte-s1u1ya">${escape_html("+")} Add</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="todo-list svelte-s1u1ya">`);
    if (todos.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="empty-state svelte-s1u1ya">No todos yet. Create one to get started!</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(Array.from(todosByCategory()));
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let [categoryId, categoryTodos] = each_array_1[$$index_2];
        const category = categories.find((c) => c.id === categoryId);
        $$renderer2.push(`<div class="todo-category svelte-s1u1ya"><h4 class="category-title svelte-s1u1ya">${escape_html(category?.name || "Uncategorized")}</h4> <!--[-->`);
        const each_array_2 = ensure_array_like(categoryTodos);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let todo = each_array_2[$$index_1];
          $$renderer2.push(`<div${attr_class("todo-item svelte-s1u1ya", void 0, { "completed": todo.completed })}><input type="checkbox"${attr("checked", todo.completed, true)} class="todo-checkbox svelte-s1u1ya"/> <div class="todo-content svelte-s1u1ya"><div class="todo-title svelte-s1u1ya">${escape_html(todo.title)}</div> `);
          if (todo.description) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="todo-description svelte-s1u1ya">${escape_html(todo.description)}</div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <button class="btn-delete-todo svelte-s1u1ya">×</button></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedCategoryId = void 0;
    let searchQuery = "";
    let selectedTags = [];
    let statusFilter = "all";
    const bookmarks = bookmarkStore.bookmarks;
    const categories = bookmarkStore.categories;
    bookmarkStore.tags;
    const todos = bookmarkStore.todos;
    const filteredBookmarks = () => {
      let filtered = bookmarks;
      if (selectedTags.length > 0) {
        filtered = filtered.filter((b) => selectedTags.every((tag) => b.tags.includes(tag)));
      }
      return filtered;
    };
    const allTags = () => {
      const tagSet = /* @__PURE__ */ new Set();
      bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
      return Array.from(tagSet).sort();
    };
    function updateBookmarkStatus(id, status) {
      bookmarkStore.updateBookmark(id, { status });
    }
    $$renderer2.push(`<div class="min-h-screen flex flex-col"><header class="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center"><h1 class="text-3xl font-bold text-gray-800">📚 Bookmark Manager</h1> <div class="flex gap-4"><button class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-all">+ Add Bookmark</button> <button class="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all">Import / Export</button></div></header> <div class="flex-1 grid lg:grid-cols-[300px_1fr] gap-6 p-6 max-w-screen-2xl mx-auto w-full"><aside class="flex flex-col gap-6 h-fit lg:sticky lg:top-6">`);
    CategoryTree($$renderer2, {
      categories,
      selectedCategoryId
    });
    $$renderer2.push(`<!----> <div class="max-h-96">`);
    TodoPanel($$renderer2, { todos, categories });
    $$renderer2.push(`<!----></div></aside> <main class="min-w-0"><div class="flex gap-4 mb-6 flex-wrap"><div class="flex-1 min-w-[200px]"><input type="search"${attr("value", searchQuery)} placeholder="Search bookmarks..." class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/></div> <div>`);
    $$renderer2.select(
      {
        value: statusFilter,
        class: "px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`All Status`);
        });
        $$renderer3.option({ value: "unread" }, ($$renderer4) => {
          $$renderer4.push(`Unread`);
        });
        $$renderer3.option({ value: "reading" }, ($$renderer4) => {
          $$renderer4.push(`Reading`);
        });
        $$renderer3.option({ value: "completed" }, ($$renderer4) => {
          $$renderer4.push(`Completed`);
        });
        $$renderer3.option({ value: "archived" }, ($$renderer4) => {
          $$renderer4.push(`Archived`);
        });
      }
    );
    $$renderer2.push(`</div></div> `);
    if (allTags().length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2 items-center mb-4 p-4 bg-white rounded-lg border border-gray-200"><span class="font-semibold text-gray-600 text-sm">Filter by tags:</span> <!--[-->`);
      const each_array = ensure_array_like(allTags());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`px-4 py-2 rounded-full text-sm transition-all ${stringify(selectedTags.includes(tag) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200")} border`)}>${escape_html(tag)}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="text-gray-600 mb-4 text-sm">Showing ${escape_html(filteredBookmarks().length)} of ${escape_html(bookmarks.length)} bookmarks</div> <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">`);
    if (filteredBookmarks().length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="col-span-full text-center py-16 px-8 bg-white rounded-lg border-2 border-dashed border-gray-200"><div class="text-6xl mb-4">🔖</div> <h2 class="text-xl font-semibold text-gray-800 mb-2">No bookmarks found</h2> <p class="text-gray-600 mb-6">Start by adding your first bookmark or adjust your filters.</p> <button class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all inline-block">Add Bookmark</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(filteredBookmarks());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let bookmark = each_array_1[$$index_1];
        BookmarkCard($$renderer2, {
          bookmark,
          onStatusChange: updateBookmarkStatus
        });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></main></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
