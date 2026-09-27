<p align="center">
  <img alt="express-generator-typescript" src="https://github.com/seanpmaxwell/express-generator-typescript/raw/main/assets/express-typescript.png" width="420">
</p>

# express-generator-typescript

[![npm version](https://img.shields.io/npm/v/express-generator-typescript?logo=npm&label=npm)](https://www.npmjs.com/package/express-generator-typescript)
[![npm downloads](https://img.shields.io/npm/dm/express-generator-typescript?color=orange)](https://www.npmjs.com/package/express-generator-typescript)
[![License](https://img.shields.io/npm/l/express-generator-typescript)](https://github.com/seanpmaxwell/express-generator-typescript/blob/main/LICENSE)

A command-line tool that generates production-ready Express projects with TypeScript built in. Spin up a web server in seconds that follows the [TypeScript best practices](https://github.com/seanpmaxwell/Typescript-Best-Practices).

<p align="center">· · ·</p>

## 🧭 Overview 

`express-generator-typescript` works like the classic `express-generator` package, but the project it creates is fully set up for TypeScript. You get strict typing, linting, hot reloading, testing, and production builds, with defaults aimed at APIs. The project is an ES module and comes with an `@src/*` import alias, so imports stay clean as the app grows.

<p align="center">· · ·</p>

## ✨ Features

- **TypeScript-first** – strict compiler settings, linting, and sensible tsconfig defaults, ready to go.
- **Built for APIs** – ideal for SPAs, mobile backends, or services.
- **Fast development** – runs TypeScript directly with tsx (no build step), restarts the server when you change it, and refreshes the browser when you change front-end files. Vitest, ESLint, and production builds are included.
- **Path aliases** – import from `@src/*` anywhere. It works in development, tests, and production builds.
- **Lean dependencies** – no view engine, ORM, or UI layer; only the essentials for Express + TypeScript.

<p align="center">· · ·</p>

## 📦 Installation

Requires Node.js 22.12 or newer.

```bash
npx express-generator-typescript
# or install globally
npm install -g express-generator-typescript
```

<p align="center">· · ·</p>

## ⚡ Quick Start

```bash
# generate a project (defaults to express-gen-ts)
npx express-generator-typescript my-api

cd my-api

# start developing at http://localhost:3000
npm run dev
```

<p align="center">· · ·</p>

## 🖥️ CLI Options

| Option            | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `project name`    | Folder to create. Defaults to `express-gen-ts`.                    |
| `--use-yarn`      | Install dependencies with Yarn instead of npm.                     |
| `--force`         | Write into a folder that isn't empty. Files with the same name are overwritten. |
| `-h`, `--help`    | Show usage.                                                        |
| `-v`, `--version` | Show the generator version.                                        |

> Without `--force`, the generator won't write into a folder that already has files in it, so it can't overwrite your work by accident.

<p align="center">· · ·</p>

## 🧩 Generated Template

The generated project is a small CRUD app for a `User` record. It shows how to structure models, services, and routes in Express + TypeScript. Linting, formatting, building, and hot reloading are all set up for you.

### Available `package.json` Scripts

- `npm run dev` – Run the server in development with live reload and browser refresh.
- `npm test` – Run the tests with Vitest.
- `npm test -- users.test.ts` – Run a single test file.
- `npm run lint` – Check the code with ESLint.
- `npm run format` – Format the code with Prettier.
- `npm run build` – Build the project for production.
- `npm start` – Run the production build.
- `npm run typecheck` – Check for TypeScript errors without building.
- `npm run install:clean` – Delete `node_modules` and the lockfile, then reinstall.

### Architecture

The app uses a **layered** architecture, which suits a small CRUD app. If you plan to grow it, consider switching to a **domain-based** layout. The [Typescript Best Practices README](https://github.com/seanpmaxwell/Typescript-Best-Practices/tree/main?tab=readme-ov-file#architecture) explains both patterns.

Layers explained:
```yml
- src/ <-- Source code
  - common/
    - constants/
      - Paths.ts <-- Single source of truth for all API routes
  - routes/ <-- Read and validate values from Express requests; send responses
  - services/ <-- Business logic (where everything comes together)
  - repos/ <-- Talk to the database
  - models/ <-- Describe and handle database records
- tests/ <-- Tests
```

<p align="center">· · ·</p>

## Notes for VS Code users

<details>
<summary>Format on save</summary>

The generated project uses ESLint for linting and Prettier for formatting. To format on save, install the Prettier extension for VS Code and set it as the default formatter in `.vscode/settings.json`:

```json
// .vscode/settings.json
{
  "editor.minimap.enabled": false,
  "editor.rulers": [80],
  "editor.tabSize": 2,

  "workbench.sideBar.location": "right",
  "workbench.editor.empty.hint": "hidden",

  // Formatting: Prettier only
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // ESLint: linting only (NO formatting)
  "eslint.format.enable": false,
  "eslint.nodePath": "node_modules",
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],

  // Run ESLint fixes (non-formatting) on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // Language overrides (keep Prettier)
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // JSDoc noise reduction
  "javascript.suggest.completeJSDocs": false,
  "javascript.suggest.jsdoc.generateReturns": false,
  "typescript.suggest.completeJSDocs": false,
  "typescript.suggest.jsdoc.generateReturns": false
}
```

</details>

<details>
<summary>Debugging</summary>

To debug with breakpoints in VS Code, start the app or tests from `.vscode/launch.json`:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Dev",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    },
    {
      "name": "Test - Vitest",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

</details>

<p align="center">· · ·</p>

## 📄 License 

MIT © [seanpmaxwell1](LICENSE)
