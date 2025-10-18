import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js', '**/*.ts'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				$state: 'readonly',
				$derived: 'readonly',
				$effect: 'readonly',
				$props: 'readonly',
				$inspect: 'readonly'
			},
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': ts
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			globals: {
				...globals.browser
			},
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.svelte']
			}
		},
		plugins: {
			svelte
		},
		rules: {
			...svelte.configs.recommended.rules,
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off'
		}
	},
	{
		ignores: [
			'.svelte-kit/**',
			'.vercel/**',
			'build/**',
			'node_modules/**',
			'*.cjs',
			'vite.config.ts.timestamp-*'
		]
	}
];
