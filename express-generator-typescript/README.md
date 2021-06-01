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

When you run _express-generator-typescript_, it sets up a very simple application with routes for
adding, updating, deleting, and fetching user objects. This is just to demonstrate how routing is done
with express.

If you want a fully-secure application, you can pass the `--with-auth` option and you will have an
application which requires you to login before calling APIs on user objects. The app is 
configured with production quality client-side security and uses signed-cookies and jsonwebtokens 
to store user-session data. If you're new to web-development and still learning about securing websites,
I highly encourage to use this option.

To have a chat app within your application, use the `--socket-io` option. This option will include 
everything from the `--with-auth` option, plus will create a mini-chat app which displays the 
sender name for the message of whoever the logged in user is. Without a login user we can't display 
a sender name, that's why the `--socket-io` option must used in conjunction with `--with-auth`. 
To create a socket-io sample app, you can pass `--socket-io` or `--with-auth --socket-io`; it won't
make a difference.

<img alt='chat-screenshot' src='https://github.com/seanpmaxwell/express-generator-typescript/raw/master/chat-screenshot.png' border='0'>


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
with all options
$ npx express-generator-typescript --with-auth --socket-io --use-yarn "project name (default is express-gen-ts)"
```

Start your express-generator-typescript app in development mode at `http://localhost:3000/`:

```bash
$ cd "project name" && npm run start:dev
```


## Available commands for the server.

- Run the server in development mode: `npm run start:dev`.
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

If you use the `--with-auth` option and are on Windows, the `bcrypt` module tends to be fussy. To
use this module on Windows you need to make sure you have the node Windows build tools installed.
I don't want to post instructions because they might change frequently. I would search the Microsoft
docs on how to setup Node for Windows. To be able to debug in VSCODE on windows I also had to install
the `node-gyp` module globally as well.

Happy web-deving :)



## License

[MIT](LICENSE)
