#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('../lib/express-generator-typescript');


// Start
console.log('Setting up new Express/TypeScript project...');

// Setup use yarn
let useYarn = false;
const args = process.argv.slice(2);
let idx = -1;
idx = args.indexOf('--use-yarn');
if (idx > -1) {
  useYarn = true;
  args.splice(idx, 1);
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
