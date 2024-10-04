/* eslint-disable */
// @ts-nocheck

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const stylisticTs = require('@stylistic/eslint-plugin-ts');
const nodePlugin = require('eslint-plugin-n');


module.exports = tseslint.config(
  eslint.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    plugins: {
      '@stylistic/ts': stylisticTs,
    }
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.js'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'warn',
      '@typescript-eslint/no-misused-promises': 0,
      '@typescript-eslint/no-floating-promises': 0,
      '@typescript-eslint/no-confusing-void-expression': 0,
      '@typescript-eslint/no-unnecessary-condition': 0,
      '@typescript-eslint/restrict-template-expressions': [ 'error', { allowNumber: true }],
      'max-len': [
        'warn',
        {
          'code': 80
        }
      ],
      '@stylistic/ts/semi': ['warn'],
      'comma-dangle': ['warn', 'always-multiline'],
      'no-console': 1,
      'no-extra-boolean-cast': 0,
      'indent': ['warn', 2],
      'quotes': ['warn', 'single'],
      'n/no-process-env': 1,
      'n/no-missing-import': 0,
      'n/no-unpublished-import': 0
    },
  }
)