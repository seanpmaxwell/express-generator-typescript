[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/) // pick up here, create custom logo tomorrow

[Express with Typescript's](https://www.npmjs.com/package/express) application generator.

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]


## What is it

Creates a new express application similar to the `express-generator` module. Except this is 
configure to use TypeScript instead of plain JavaScript. There are some other tools out 

All the tools you need for running,
building, and testing are packaged with it. 



## Installation

```sh
$ Just use 'npx'
  Or
$ npm install -g express-generator-typescript
```

## Quick Start

The quickest way to get started is use npx and pass in the name of the project you want to create.
If you don't specify a project name, the default _express-gen-project_ will be used instead.

Create the app:

```bash
$ npx express-generator-typescript "optionally pass named of project you want to create"
$ cd "name of the project"
```

Install dependencies:

```bash
$ npm install
```

Start your express-generator-typescript app in development mode at `http://localhost:3000/`:

```bash
$ npm run start-dev
```

## Command Line Options

This generator can also be further configured with the following command line flags.

        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
        --no-view        use static html instead of view engine
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git            add .gitignore
    -f, --force          force on non-empty directory
    -h, --help           output usage information

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-generator.svg
[npm-url]: https://npmjs.org/package/express-generator
[travis-image]: https://img.shields.io/travis/expressjs/generator/master.svg?label=linux
[travis-url]: https://travis-ci.org/expressjs/generator
[appveyor-image]: https://img.shields.io/appveyor/ci/dougwilson/generator/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/dougwilson/generator
[downloads-image]: https://img.shields.io/npm/dm/express-generator.svg
[downloads-url]: https://npmjs.org/package/express-generator
