<p align="center">
  <img alt="express-generator-typescript" src="https://github.com/seanpmaxwell/express-generator-typescript/raw/master/express-typescript.png" width="420">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/express-generator-typescript"><img src="https://img.shields.io/npm/v/express-generator-typescript.svg?style=for-the-badge&logo=npm" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/express-generator-typescript"><img src="https://img.shields.io/npm/dm/express-generator-typescript.svg?style=for-the-badge" alt="NPM Downloads"></a>
  <a href="https://www.npmjs.com/package/express-generator-typescript"><img src="https://img.shields.io/npm/l/express-generator-typescript.svg?style=for-the-badge" alt="License"></a>
</p>

# express-generator-typescript

Command line tool which generates production-ready express templates with TypeScript baked in. Spin up a web server in seconds that follows the [TypeScript best practices](https://github.com/seanpmaxwell/Typescript-Best-Practices/blob/main/README.md).
<br/>

## 🧭 Overview 

`express-generator-typescript` creates a new Express application similar to the classic `express-generator` package, but the generated project is fully wired for TypeScript. You get strict typing, linting, hot reloading, production builds, testing utilities, and sane defaults that focus on APIs (no view engine or opinionated ORM). Path aliases are preconfigured through `tsconfig-paths` and `_moduleAliases`, so referencing modules stays clean even as the app grows.

<br/><b>***</b><br/>

## ✨ Features

- **TypeScript-first** – strict compiler settings, linting, and sensible tsconfig defaults ready to go.
- **API-centric** – no view engine or extra dependencies; ideal for SPAs, mobile backends, or services.
- **Productivity tooling** – includes nodemon, ts-node, hot reload scripts, Jest, ESLint, and production builds.
- **Path aliases** – aliases configured in `tsconfig.json` and `preload.js` so you can import modules cleanly.
- **Keeps dependencies lean** – no bundled ORM or UI layers; only the essentials for Express + TS development.

<br/><b>***</b><br/>

## 📦 Installation

```bash
npx express-generator-typescript
# or install globally
npm install -g express-generator-typescript
```

<br/><b>***</b><br/>

## ⚡ Quick Start

```bash
# generate a project (defaults to express-gen-ts)
npx express-generator-typescript my-api

cd my-api

# start developing at http://localhost:3000
npm run dev
```

Use `--use-yarn` if you prefer Yarn over npm. If you omit the project name, the generator creates `express-gen-ts`.

<br/><b>***</b><br/>

## 🖥️ CLI Options

| Option            | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `project name`    | Folder to create. Defaults to `express-gen-ts` if omitted.                  |
| `--use-yarn`      | Installs dependencies with Yarn instead of npm.                             |

> The historical `--with-auth` switch was removed in v2.5+. For an auth-ready example see the [express-jsonwebtoken-demo](https://github.com/seanpmaxwell/express-jsonwebtoken-demo) project.

<br/><b>***</b><br/>

## 🧩 Generated Template

The generated template is a CRUD app for the `User` record to demonstrate model, services, and routing patterns in Express + TypeScript. Commands for linting, transpiling, formatting, and hot-reloading are all configured for you.

### Available `package.json` Scripts

- `npm run dev` / `npm run dev:hot` – Run the server with live reload.
- `npm run test` / `npm run test:hot` – Execute all Jest tests, optionally with watch mode.
- `npm run test -- users.test.ts` – Target a single test file.
- `npm run lint` – Run ESLint checks.
- `npm run format` - Run prettier.
- `npm run build` – Compile the project for production.
- `npm start` – Serve the built project.
- `npm run type-check` – Run the TypeScript compiler without emitting files.

### Architecture

Because this is a small CRUD app, **layered** is the architectural pattern of choice. However, you should consider switching to a **domain-based** layout if you plan on scaling. There is a good tutorial [here](https://github.com/seanpmaxwell/Typescript-Best-Practices/tree/main?tab=readme-ov-file#architecture) in the _Typescript Best Practices README_ about architectural patterns with TypeScript.

Layers explained:
```yml
- tests/ <-- unit-tests
- src/ <-- source code
  - common/
    - constants/
      - Paths <-- Single source of truth for all API routes
  - routes/ <-- extracting and validating values from express Request/Response objects
  - services/ <-- Business logic (where everything comes together)
  - repos/ <-- Talking to the database layer
  - models/ <-- For describing/handling objects representing database records
```

<br/><b>***</b><br/>

## Note for VSCode users

### Format on save

The generated template uses `eslint`+`prettier`, so if you want features like _formatting on save_, you need to make sure to install the prettier extension for VSCode and set it as your default formatter in `.vscode/setting.json`:

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

### Debugging

If you want to debug in VSCode with breakpoints you need to start the processes through `.vscode/launch.json`:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Dev - ts-node",
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

<br/><b>***</b><br/>

## 📄 License 

MIT © [seanpmaxwell1](LICENSE)
