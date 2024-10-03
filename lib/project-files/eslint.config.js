var eslint = require('@eslint/js');
var tseslint = require('typescript-eslint');
const nodePlugin = require('eslint-plugin-n');

module.exports = tseslint.config(
  eslint.configs.recommended,
  nodePlugin.configs["flat/recommended-script"],
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname, // For node v > 20 use "import.meta.dirname"
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-member-accessibility": "warn",
      "@typescript-eslint/no-misused-promises": 0,
      "@typescript-eslint/no-floating-promises": 0,
      "@typescript-eslint/no-confusing-void-expression": 0,
      "@typescript-eslint/restrict-template-expressions": [ "error", { allowNumber: true }],
      "max-len": [
        "warn",
        {
          "code": 80
        }
      ],
      "comma-dangle": ["warn", "always-multiline"],
      "no-console": 1,
      "no-extra-boolean-cast": 0,
      "semi": 1,
      "indent": ["warn", 2],
      "quotes": ["warn", "single"],
      "n/no-process-env": 1,
      "n/no-unsupported-features/es-syntax": [
        "error",
        { "ignores" : ["modules"] }
      ],
      "n/no-missing-import": 0,
      "n/no-unpublished-import": 0
    },
  }
)
