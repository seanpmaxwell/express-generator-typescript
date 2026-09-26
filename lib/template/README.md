## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript). It requires Node.js 22.12 or newer.

<p align="center">· · ·</p>


## Available Scripts

### `npm run install:clean`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.

### `npm run dev` 

Run the server in development with hot reloading and browser refresh (see `package.json` for all `npm run dev` variations)<br/>

**IMPORTANT** development mode uses `swc` for performance reasons which DOES NOT check for typescript errors. Run `npm run typecheck` to check for type errors. NOTE: you should use your IDE to prevent most type errors.

### `npm test`

Run unit-tests with <a href="https://vitest.dev/guide/">vitest</a>.

### `npm run lint`

Check for linting errors.

### `npm run format`

Format `src/` and `tests/` with prettier.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm run typecheck`

Check for typescript errors.

<p align="center">· · ·</p>


## Additional Notes

- `config/.env.production` is listed in `.gitignore` so production secrets don't get committed. Keep it out of version control and provide its values through your deployment tooling.
- The database is a JSON file (`src/repos/common/database.json`, or `dist/repos/common/database.json` in production) meant only for the demo. It's created automatically if missing and isn't safe for concurrent writes, so replace `src/repos/MockOrm.ts` with a real database before going to production.
