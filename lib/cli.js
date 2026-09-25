#!/usr/bin/env node
const path = require('path');
const expressGenTs = require('../lib/express-generator-typescript');

// ========================================================================= //
//                                    EXEC                                   //
// ========================================================================= //
// CLI entry point (mirrors `bin/cli.js`). Parses the command-line args and
// hands off to `expressGenTs`.

// Init
console.log('Setting up new Express/TypeScript project...');
const args = process.argv.slice(2);

// Setup use yarn
let useYarn = false;
const useYarnIdx = args.indexOf('--use-yarn');
if (useYarnIdx > -1) {
  useYarn = true;
  args.splice(useYarnIdx, 1);
}

// Setup destination
let dest = 'express-gen-ts';
if (args.length > 0) {
  dest = args[0];
}
dest = path.join(process.cwd(), dest);

// Creating new project finished
expressGenTs(dest, useYarn).then(() => {
  console.log('Project setup complete!');
});
