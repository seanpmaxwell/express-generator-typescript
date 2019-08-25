#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('./express-generator-typescript');


let destination;
let withAuth = false;
if (process.argv[2] === '--with-auth') {
    withAuth = true;
    destination = getDest(process.argv[3]);
} else {
    destination = getDest(process.argv[2]);
}


expressGenTs(destination, withAuth).then(() => {
    console.log('Setting up new Express/TypeScript project complete')
});


function getDest(destFolder) {
    destFolder = (destFolder || 'express-gen-ts');
    return path.join(process.cwd(), destFolder);
}
