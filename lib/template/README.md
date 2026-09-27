## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript). It requires Node.js 22.12 or newer.

The original template follows the [TypeScript best practices](https://github.com/seanpmaxwell/Typescript-Best-Practices).

<p align="center">· · ·</p>

## Available Scripts

### `npm run dev`

Run the server in development at http://localhost:3000. The server restarts when you change server code, and the browser refreshes when you change server code or anything in `src/public` or `src/views`.

> **Note:** development mode runs your `.ts` files directly with `tsx`, which doesn't check for TypeScript errors. Run `npm run typecheck` to check for them, and let your editor catch most of them as you work.

### `npm test`

Run the tests with [Vitest](https://vitest.dev/guide/).

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
- **Validation**: [jet-validators](https://github.com/seanpmaxwell/jet-validators)
- **Environment variables**: [dotenv](https://github.com/motdotla/dotenv) loads `config/.env.*`, and [jet-env](https://github.com/seanpmaxwell/jet-env) validates them
- **Reloading**: [tsx](https://tsx.hirok.io) (`tsx watch` restarts the server) and [livereload](https://github.com/napcs/node-livereload) + [connect-livereload](https://github.com/intesso/connect-livereload) (refreshes the browser)
- **Testing**: [Vitest](https://vitest.dev) + [Supertest](https://github.com/ladjs/supertest)
- **Linting**: [ESLint](https://eslint.org) with [typescript-eslint](https://typescript-eslint.io/packages/typescript-eslint) and [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)
- **Formatting**: [Prettier](https://prettier.io) with [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)
- **Building**: `tsc` + [tsc-alias](https://github.com/justkey007/tsc-alias) (rewrites `@src/*` imports in `dist/`)

<p align="center">· · ·</p>

## Additional Notes

- `config/.env.production` is in `.gitignore` so production secrets don't get committed. Keep it out of version control and supply its values through your deployment tooling.
- The database is a JSON file meant only for the demo: `src/repos/common/database.json` in development, or `dist/repos/common/database.json` in production. It's created automatically if missing, but it isn't safe for simultaneous writes. Replace `src/repos/MockOrm.ts` with a real database before going to production.
