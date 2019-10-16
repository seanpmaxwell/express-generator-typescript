#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('../lib/express-generator-typescript');


const destFolder = (process.argv[2] || 'express-gen-ts');
const destination = path.join(process.cwd(), destFolder);

console.log('Setting up new Express/TypeScript project...');

expressGenTs(destination).then(() => {
    console.log('Project setup complete!')
});
