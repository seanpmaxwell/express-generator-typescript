#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('../lib/express-generator-typescript');


(() => {
    console.log('Setting up new Express/TypeScript project...');
    // const opts = processOptions(process.argv.slice(2));
    // Process options
    let destination = 'express-gen-ts';
    let withAuth = false;
    let useYarn = false;
    const args = process.argv.slice(2);
    let idx = -1;
    idx = args.indexOf('--with-auth');
    if (idx > -1) {
        withAuth = true;
        args.splice(idx, 1);
    }
    idx = args.indexOf('--use-yarn');
    if (idx > -1) {
        useYarn = true;
        args.splice(idx, 1);
    }
    if (args.length > 0) {
        destination = args[0];
    }
    destination = path.join(process.cwd(), destination);
    // Creating new project finished
    expressGenTs(destination, withAuth, useYarn).then(() => {
        console.log('Project setup complete!');
    });
})();
