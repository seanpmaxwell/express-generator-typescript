<img alt='overnightjs' src='https://github.com/seanpmaxwell/express-generator-typescript/raw/master/express-typescript.png' border='0'>

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) application generator.

<a href="https://www.npmjs.com/package/express-generator-typescript" target="_blank"><img src="https://img.shields.io/npm/v/express-generator-typescript.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/express-generator-typescript" target="_blank"><img src="https://img.shields.io/npm/l/express-generator-typescript.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/express-generator-typescript" target="_blank"><img src="https://img.shields.io/npm/dm/express-generator-typescript.svg" alt="NPM Downloads" /></a>


## What is it?

Creates a new express application similar to the _express-generator_ module. Except this new application is configured to use TypeScript instead of plain JavaScript. 

This project complies with Typescript best practices listed <a href="https://github.com/seanpmaxwell/Typescript-Best-Practices/blob/main/README.md">here</a>.


## Why express-generator-typescript?

NodeJS is great for the rapid development of web-projects, but is often neglected because of the lack of type safety. TypeScript solves this issue and (along with its linter file) can even make your code more robust than some other static languages like Java.

There are some other tools out there to generate express apps with TypeScript such as _express-generator-ts_, but these either haven't been updated in a while or install a lot of junk in your project (such as an ORM). 

Due to the heavy use of single-page-applications, no view-engine is configured by default. Express is only setup with the minimal settings for calling APIs and serving an index.html file. All the tools you need to run for development (while restarting on changes), building, testing, and running for production are packaged with this library. 

In addition, relative paths are also setup, so you don't have to go through the trouble of installing and configuring _tsconfig-paths_ and _module-alias_. Just make sure to update `paths` in _tsconfig.json_ and `_moduleAliases` in _preload.js_ if you want to add/edit the relative paths.


## Sample-project

When you run _express-generator-typescript_, it sets up a simple application with routes for adding, updating, deleting, and fetching user objects. This is just to demonstrate how routing is done with express. 

### `--with-auth` option no longer available for version 2.5+

For the command-line, you used to be able to pass the `--with-auth` option to generate an app which required a login before using the routes; however, maintaining two separate projects became quite cumbersome. If you want an example of how to do authentication in expressjs with json-web-tokens you can refer to this sample project <a href="https://github.com/seanpmaxwell/express-jsonwebtoken-demo">here</a>.


## Installation

```sh
$ Just use 'npx'
  Or
$ npm install -g express-generator-typescript
```


## Quick Start

The quickest way to get started is use npx and pass in the name of the project you want to create. If you don't specify a project name, the default _express-gen-ts_ will be used instead. If you want to use `yarn` instead of `npm`, pass the option `--use-yarn`.

Create the app:<br/>
With no options: `$ npx express-generator-typescript`<br/>
With all options (order doesn't matter): `$ npx express-generator-typescript --use-yarn "project name"`


Start your express-generator-typescript app in development mode at `http://localhost:3000/`:

```bash
$ cd "project name" && npm run dev
```


## Available commands for the server.

- Run the server in development mode: `npm run dev` or `npm run dev:hot`.
- Run all unit-tests: `npm run test` or `npm run test:hot`.
- Run a single unit-test: `npm test -- --testFile="name of test file" (i.e. --testFile=Users)`.
- Check for linting errors: `npm run lint`.
- Build the project for production: `npm run build`.
- Run the production build: `npm start`.
- Check for typescript errors: `npm run type-check`.


## Debugging

During development, _express-generator-typescript_ uses `nodemon` to restart the server when changes are detected. If you want to enable debugging for node, you'll need to modify the nodemon configurations. This is located under `nodemonConfig:` in `package.json` for the server and `./spec/nodemon.json` for unit-testing. For the `exec` property, replace `ts-node` with `node --inspect -r ts-node/register`.


## Note for VSCode users

In order to use eslint as a typescript file with VSCode, you need to add a setting to your eslint options. At the root of your project, add a `.vscode/settings.json` file (if you don't have one already) and add the option `unstable_ts_config`:

```typescript
  "eslint.options": {
    "flags": ["unstable_ts_config"]
  }
```
<br/>


Happy web deving :)


## License

[MIT](LICENSE)
