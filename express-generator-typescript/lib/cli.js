#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('./express-generator-typescript');


const destFolder = (process.argv[2] || 'express-gen-ts');
const destination = path.join(process.cwd(), destFolder);

expressGenTs(destination).then(() => {
    console.log('Setting up new Express/TypeScript project complete')
});
