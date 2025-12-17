<p align="center">
  <img alt="express-generator-typescript" src="https://github.com/seanpmaxwell/express-generator-typescript/raw/master/express-typescript.png" width="420">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/express-generator-typescript"><img src="https://img.shields.io/npm/v/express-generator-typescript.svg?style=for-the-badge&logo=npm" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/express-generator-typescript"><img src="https://img.shields.io/npm/dm/express-generator-typescript.svg?style=for-the-badge" alt="NPM Downloads"></a>
  <a href="https://www.npmjs.com/package/express-generator-typescript"><img src="https://img.shields.io/npm/l/express-generator-typescript.svg?style=for-the-badge" alt="License"></a>
</p>

# express-generator-typescript

Production-ready Express application scaffolding with TypeScript baked in. Generate a modern API starter in seconds that follows the [TypeScript best practices](https://github.com/seanpmaxwell/Typescript-Best-Practices/blob/main/README.md) used to build this tool.

## Overview

`express-generator-typescript` creates a new Express application similar to the classic `express-generator` package, but the generated project is fully wired for TypeScript from day one. You get strict typing, linting, hot reloading, production builds, testing utilities, and sane defaults that focus on APIs (no view engine or opinionated ORM). Path aliases are preconfigured through `tsconfig-paths` and `_moduleAliases`, so referencing modules stays clean even as the app grows.

## Features

- **TypeScript-first** – strict compiler settings, linting, and sensible tsconfig defaults ready to go.
- **API-centric** – no view engine or extra dependencies; ideal for SPAs, mobile backends, or services.
- **Productivity tooling** – includes nodemon, ts-node, hot reload scripts, Jest, ESLint, and production builds.
- **Path aliases** – aliases configured in `tsconfig.json` and `preload.js` so you can import modules cleanly.
- **Keeps dependencies lean** – no bundled ORM or UI layers; only the essentials for Express + TS development.

## Installation

```bash
npx express-generator-typescript
# or install globally
npm install -g express-generator-typescript
```

## Quick Start

```bash
# generate a project (defaults to express-gen-ts)
npx express-generator-typescript my-api

cd my-api

# start developing at http://localhost:3000
npm run dev
```

Use `--use-yarn` if you prefer Yarn over npm. If you omit the project name, the generator creates `express-gen-ts`.

## CLI Options

| Option            | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `project name`    | Folder to create. Defaults to `express-gen-ts` if omitted.                  |
| `--use-yarn`      | Installs dependencies with Yarn instead of npm.                             |

> The historical `--with-auth` switch was removed in v2.5+. For an auth-ready example see the [express-jsonwebtoken-demo](https://github.com/seanpmaxwell/express-jsonwebtoken-demo) project.

## Sample Project

The generated code includes CRUD routes for illustrative `User` resources to demonstrate controllers, services, and routing patterns in Express + TypeScript. Replace these samples with your own modules after scaffolding.

## Available Scripts

- `npm run dev` / `npm run dev:hot` – Run the server with live reload.
- `npm run test` / `npm run test:hot` – Execute all Jest tests, optionally with watch mode.
- `npm run test -- users.test.ts` – Target a single test file.
- `npm run lint` – Run ESLint checks.
- `npm run build` – Compile the project for production.
- `npm start` – Serve the built project.
- `npm run type-check` – Run the TypeScript compiler without emitting files.

## Debugging

Development uses `nodemon` so the server restarts when files change. To enable the Node.js inspector, edit `nodemonConfig` in `package.json` (and `spec/nodemon.json` for tests) and change the `exec` value from `ts-node` to `node --inspect -r ts-node/register`.

## License

[MIT](LICENSE)
