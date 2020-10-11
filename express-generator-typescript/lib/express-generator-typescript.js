/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;



/**
 * Entry point
 * 
 * @param destination 
 * @param withAuth 
 */
async function expressGenTs(destination, withAuth) {
    try {
        await copyProjectFiles(destination, withAuth);
        updatePackageJson(destination);
        const dep = getDepStrings(withAuth);
        downloadNodeModules(destination, dep);
    } catch (err) {
        console.error(err);
    }
}


/**
 * Copy project files
 * 
 * @param destination 
 * @param withAuth 
 */
function copyProjectFiles(destination, withAuth) {
    const prjFolder = (withAuth ? './auth-proj' : './project-files');
    const source = path.join(__dirname, prjFolder);
    return new Promise((resolve, reject) => {
        ncp.limit = 16;
        ncp(source, destination, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    })
}


/**
 * Set project name in package.json
 * 
 * @param destination 
 */
function updatePackageJson(destination) {
    let file = editJsonFile(destination + '/package.json', {
        autosave: true
    });
    file.set('name', path.basename(destination));
}


/**
 * Setup dependency strings. This way gets you the latest version of everything.
 * 
 * @param withAuth 
 */
function getDepStrings(withAuth) {
    let dependencies = 'express dotenv http-status-codes morgan cookie-parser jet-logger ' +
        'module-alias command-line-args express-async-errors helmet jsonfile';
    let devDependencies = 'ts-node typescript nodemon find jasmine supertest ' +
        '@types/node @types/express @types/jasmine @types/find @types/morgan ' +
        '@types/cookie-parser @types/supertest fs-extra tsconfig-paths @types/jsonfile ' +
        '@types/command-line-args @typescript-eslint/eslint-plugin @typescript-eslint/parser ' +
        'eslint @types/fs-extra';
    if (withAuth) {
        dependencies += ' bcrypt randomstring jsonwebtoken';
        devDependencies += ' @types/bcrypt @types/randomstring @types/jsonwebtoken';
    }
    return {dependencies, devDependencies};
}


/**
 * Download the dependencies.
 * 
 * @param destination 
 * @param dep 
 */
function downloadNodeModules(destination, dep) {
    const options = {cwd: destination};
    childProcess.execSync('npm i -s ' + dep.dependencies, options);
    childProcess.execSync('npm i -D ' + dep.devDependencies, options);
}


// Export entry point
module.exports = expressGenTs;
