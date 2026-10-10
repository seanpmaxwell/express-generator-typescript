## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript). It requires Node.js 22.18+ (22.x), 24.x, or 26+.

The original template follows the [TypeScript best practices](https://github.com/seanpmaxwell/Typescript-Best-Practices).

<p align="center">· · ·</p>

## Available Scripts

### `npm run dev`

Run the server in development at http://localhost:3000. The server restarts when you change server code, and the browser refreshes when you change server code or anything in `src/public` or `src/views`.

> **Note:** development mode runs your `.ts` files directly with Node's built-in [type stripping](https://nodejs.org/api/typescript.html), which doesn't check for TypeScript errors. Run `npm run typecheck` to check for them, and let your editor catch most of them as you work.

### `npm test`

Run the tests with Node's built-in [test runner](https://nodejs.org/api/test.html). Pass a file to run only that file (`npm test -- tests/users.test.ts`), or `--test-name-pattern` to run only matching tests (`npm test -- --test-name-pattern="UserRouter"`).

### `npm run lint`

Check the code with ESLint.

### `npm run format`

Format `src/` and `tests/` with Prettier.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build. Run `npm run build` first.

### `npm run typecheck`

Check for TypeScript errors without building.

### `npm run install:clean`

Delete `node_modules/` and `package-lock.json`, then reinstall all dependencies.

<p align="center">· · ·</p>

## Tech Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode, ES modules)
- **Web server framework**: [Express](https://expressjs.com/en/) (v5)
- **Security headers**: [helmet](https://helmet.js.org/) (production only)
- **Logging**
  - **Request logging**: [morgan](https://github.com/expressjs/morgan) (development only)
  - **General logging**: [jet-logger](https://github.com/seanpmaxwell/jet-logger)
- **Validation**: [zod](https://github.com/colinhacks/zod)
  - **Middleware Validation**: [express-zod-safe](https://github.com/AngaBlue/express-zod-safe)
- **Environment variables**: Node's built-in [`--env-file`](https://nodejs.org/api/cli.html#--env-fileconfig) loads `config/.env.*`
- **Reloading**: Node's built-in [`--watch`](https://nodejs.org/api/cli.html#--watch) (restarts the server) and [livereload](https://github.com/napcs/node-livereload) + [connect-livereload](https://github.com/intesso/connect-livereload) (refreshes the browser)
- **Testing**: Node's built-in [`node:test`](https://nodejs.org/api/test.html) + [Supertest](https://github.com/ladjs/supertest)
- **Linting**: [ESLint](https://eslint.org) with [typescript-eslint](https://typescript-eslint.io/packages/typescript-eslint) and [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)
- **Formatting**: [Prettier](https://prettier.io) with [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)
- **Building**: `tsc` (rewrites relative `.ts` imports to `.js` in `dist/`)

<p align="center">· · ·</p>

## Additional Notes

- Imports name the `.ts` file (`./server.ts`), because Node runs the source files directly. `#src/*` imports are [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) set up in `package.json`: they point at `src/*.ts` in development and tests (the `development` condition) and at `dist/*.js` in production.
- `config/.env.production` is in `.gitignore` so production secrets don't get committed. Keep it out of version control and supply its values through your deployment tooling.
- The database is a JSON file meant only for the demo: `src/repos/common/database.json` in development, or `dist/repos/common/database.json` in production. It's created automatically if missing, but it isn't safe for simultaneous writes. Replace `src/repos/MockOrm.ts` with a real database before going to production.
