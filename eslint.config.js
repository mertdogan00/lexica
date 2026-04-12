import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['eslint.config.mjs', 'node_modules']),

  {
    files: ['src/**/*'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintPluginPrettierRecommended,
    ],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.browser,

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: false }],

      // We deliberately colocate each React context Provider with its
      // consumer hook so there is one barrel entry per feature. The
      // downside is a partial loss of fast refresh granularity for
      // those files, which is an acceptable DX trade-off.
      'react-refresh/only-export-components': 'off',

      // set-state-in-effect is a performance advisory, not a bug. We
      // intentionally hydrate several providers from async stores on
      // mount and rely on React 18/19 automatic batching for safety.
      'react-hooks/set-state-in-effect': 'off',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
]);
