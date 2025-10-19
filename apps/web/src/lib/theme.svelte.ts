import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme-preference';

class ThemeStore {
	private currentTheme = $state<Theme>('dark');

	constructor() {
		if (browser) {
			// Load saved preference or detect system preference
			const saved = localStorage.getItem(THEME_KEY) as Theme | null;
			if (saved) {
				this.currentTheme = saved;
			} else {
				// Check system preference
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				this.currentTheme = prefersDark ? 'dark' : 'light';
			}
			
			// Apply theme immediately
			this.applyTheme(this.currentTheme);
			
			// Listen for system preference changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				// Only auto-switch if user hasn't manually set a preference
				if (!localStorage.getItem(THEME_KEY)) {
					this.setTheme(e.matches ? 'dark' : 'light');
				}
			});
		}
	}

	get theme() {
		return this.currentTheme;
	}

	setTheme(theme: Theme) {
		this.currentTheme = theme;
		if (browser) {
			localStorage.setItem(THEME_KEY, theme);
			this.applyTheme(theme);
		}
	}

	toggleTheme() {
		this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
	}

	private applyTheme(theme: Theme) {
		if (browser) {
			const root = document.documentElement;
			if (theme === 'dark') {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		}
	}
}

export const themeStore = new ThemeStore();