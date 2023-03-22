#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('../lib/express-generator-typescript');


//  **** Start **** //

console.log('Setting up new Express/TypeScript project...');


// **** Process Options **** //

const args = process.argv.slice(2);

// Setup use yarn
let useYarn = false;
const useYarnIdx = args.indexOf('--use-yarn');
if (useYarnIdx > -1) {
  useYarn = true;
  args.splice(useYarnIdx, 1);
}

// Setup include authentication
let withAuth = false;
const withAuthIdx = args.indexOf('--with-auth');
if (withAuthIdx > -1) {
  withAuth = true;
  args.splice(withAuthIdx, 1);
}

// Setup destination
let destination = 'express-gen-ts';
if (args.length > 0) {
  destination = args[0];
}
destination = path.join(process.cwd(), destination);


// **** Call the generator script **** //

// Creating new project finished
expressGenTs(destination, useYarn, withAuth).then(() => {
  console.log('Project setup complete!');
});
