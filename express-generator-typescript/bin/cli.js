#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const expressGenTs = require('../lib/express-generator-typescript');


(() => {
    // Get the name of the new project
    let destination;
    let withAuth = false;
    if (process.argv[2] === '--with-auth') {
        withAuth = true;
        destination = getDest(process.argv[3]);
    } else {
        destination = getDest(process.argv[2]);
    }
    // Creating new project started
    console.log('Setting up new Express/TypeScript project...');
    // Creating new project finished
    expressGenTs(destination, withAuth).then(() => {
        console.log('Project setup complete!');
    });
})();


/**
 * Get the folder name of the new project
 * 
 * @param destFolder 
 */
function getDest(destFolder) {
    destFolder = (destFolder || 'express-gen-ts');
    return path.join(process.cwd(), destFolder);
}
