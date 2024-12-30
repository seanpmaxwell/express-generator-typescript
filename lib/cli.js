#!/usr/bin/env node

const path = require('path'),
  expressGenTs = require('../lib/express-generator-typescript');


/******************************************************************************
                                 Run
******************************************************************************/

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
let destination = 'express-gen-ts';
if (args.length > 0) {
  destination = args[0];
}
destination = path.join(process.cwd(), destination);

// Creating new project finished
expressGenTs(destination, useYarn).then(() => {
  console.log('Project setup complete!');
});
