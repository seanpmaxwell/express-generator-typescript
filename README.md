<img alt='overnightjs' src='https://github.com/seanpmaxwell/express-generator-typescript/raw/master/express-typescript.png' border='0'>

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) application generator.

<a href="https://www.npmjs.com/package/express-generator-typescript" target="_blank"><img src="https://img.shields.io/npm/v/express-generator-typescript.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/express-generator-typescript" target="_blank"><img src="https://img.shields.io/npm/l/express-generator-typescript.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/express-generator-typescript" target="_blank"><img src="https://img.shields.io/npm/dm/express-generator-typescript.svg" alt="NPM Downloads" /></a>


## What is it?

Creates a new express application similar to the _express-generator_ module. Except this new
application is configured to use TypeScript instead of plain JavaScript. 


## Why express-generator-typescript?

NodeJS is great for the rapid development of web-projects, but is often neglected because of the lack of
type safety. TypeScript solves this issue and (along with its linter file) can even make your code
more robust than some other static languages like Java.

There are some other tools out there to generate express apps with TypeScript such as 
_express-generator-ts_, but these either haven't been updated in a while or install a lot of junk 
in your project (such as an ORM). 

Due to the heavy use of single-page-applications, no view-engine is configured by default. Express is 
only setup with the minimal settings for calling APIs and serving an index.html file. All the tools you 
need to run for development (while restarting on changes), building, testing, and running for production 
are packaged with this library. 

In addition, relative paths are also setup, so you don't have to go through the trouble of installing
and configuring _tsconfig-paths_ and _module-alias_. Just make sure to update `paths` in _tsconfig.json_
and `_moduleAliases` in _package.json_ if you want to add/edit the relative paths.


## Sample-project

When you run _express-generator-typescript_, it sets up a simple application with routes for
adding, updating, deleting, and fetching user objects. This is just to demonstrate how routing is done
with express. You will have to login before calling APIs on user objects. The app is 
configured with production quality client-side security and uses signed-cookies and jsonwebtokens 
to store user-session data. 


## Installation

```sh
$ Just use 'npx'
  Or
$ npm install -g express-generator-typescript
```


## Quick Start

The quickest way to get started is use npx and pass in the name of the project you want to create.
If you don't specify a project name, the default _express-gen-ts_ will be used instead. If you
want to use `yarn` instead of `npm`, pass the option `--use-yarn`.

Create the app:

```bash
$ npx express-generator-typescript "project name (default is express-gen-ts)"
```

Start your express-generator-typescript app in development mode at `http://localhost:3000/`:

```bash
$ cd "project name" && npm run dev
```


## Available commands for the server.

- Run the server in development mode: `npm run dev`.
- Run all unit-tests with hot-reloading: `npm test`.
- Run a single unit-test: `npm test -- --testFile="name of test file" (i.e. --testFile=Users)`.
- Run all unit-tests without hot-reloading: `npm run test:no-reloading`
- Check for linting errors: `npm run lint`.
- Build the project for production: `npm run build`.
- Run the production build: `npm start`.
- Run production build with a different env file `npm start -- --env="name of env file" (default is production)`.


## Debugging

During development, _express-generator-typescript_ uses `nodemon` to restart the server when changes
are detected. If you want to enable debugging for node, you'll need to modify the nodemon configurations.
This is located under `nodemonConfig:` in `package.json` for the server and `./spec/nodemon.json` for
unit-testing. For the `exec` property, replace `ts-node` with `node --inspect -r ts-node/register`.


## If you don't want authentication:

In previous version of __express-generator-typescript__ you could disregard authentication through the 
command line options. But maintaining two separate project folders which contained and didn't contain 
authentication started to get messy.

- Remove the following modules from `package.json`:
  - `jsonwebtoken`
  - `@types/jsonwebtoken`
  - `bcrypt`
  - `@types/bcrypt`
  
- Delete the files:
  - `src/routes/middleware.ts`
  - `src/routes/auth-router.ts`
  - `spec/tests/auth.spec.ts`
  - `spec/support/login-agent.ts`
  - `public/scripts/login.js`
  - `public/stylesheets/login.css`
  - `public/views/login.html`

- Update the files:
  - In `src/routes/api`, delete the line: `apiRouter.use('/auth', authRouter);` and
    remove the `adminMw,` from line 12. Remove the `adminMw` and `authRouter` imports as well.
  - In `spec/tests/users.spec.ts`, remove all lines containing `loginAgent` and `setCookie`
  - In `public/views/users.html` remove the `Logout` button.


## Note for VS-Code users

A lot of users have asked about _launch.json_ configurations for running this in VS-Code, so
here's a snippet of the launch.json configuration you need to bypass nodemon and run directly with
VS-Code. 

```JSON
  {
        "type": "pwa-node",
        "request": "launch",
        "name": "Debug Dev Env",
        "runtimeArgs": [
            "-r",
            "ts-node/register",
            "-r",
            "tsconfig-paths/register",
        ],
        "args": [
            "${workspaceFolder:express-gen-ts}/src/index.ts"
        ],
        "resolveSourceMapLocations": [
            "${workspaceFolder}/**",
            "!**/node_modules/**"
        ],
   }
```


## Note for windows users

If you are on Windows, the `bcrypt` module tends to be fussy. To use this module on Windows you 
need to make sure you have the node Windows build tools installed. I don't want to post instructions 
because they might change frequently. I would search the Microsoft docs on how to setup Node for Windows. 
To be able to debug in VSCODE on windows I also had to install the `node-gyp` module globally as well.

Happy web deving :)


## License

[MIT](LICENSE)
