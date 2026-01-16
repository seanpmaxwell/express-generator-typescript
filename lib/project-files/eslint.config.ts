import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import n from 'eslint-plugin-n';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // global ignores
  globalIgnores(['**/dist/**']),
  // linting rules (code quality only)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      n,
    },
    rules: {
      // code quality / correctness
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-process-env': 'warn',
      // node correctness
      'n/no-extraneous-import': 'error'
    },
  },
  // MUST be last — disables ALL formatting rules
  eslintConfigPrettier,
]);
