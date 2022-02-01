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
 * @param useYarn
 */
async function expressGenTs(destination, withAuth, useYarn, useSocketIo) {
    try {
        await copyProjectFiles(destination, withAuth, useSocketIo);
        updatePackageJson(destination);
        const depStrings = getDepStrings(withAuth, useSocketIo);
        downloadNodeModules(destination, depStrings, useYarn);
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
function copyProjectFiles(destination, withAuth, useSocketIo) {
    let prjFolder = './project-files';
    if (useSocketIo) {
        prjFolder = './socket-io';
    } else if (withAuth) {
        prjFolder = './auth-proj';
    }
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
function getDepStrings(withAuth, useSocketIo) {
    let dependencies = 'express dotenv http-status-codes morgan cookie-parser jet-logger ' +
        'module-alias command-line-args express-async-errors helmet jsonfile';
    let devDependencies = 'ts-node typescript nodemon find jasmine supertest ' +
        '@types/node @types/express @types/jasmine @types/find @types/morgan ' +
        '@types/cookie-parser @types/supertest fs-extra tsconfig-paths @types/jsonfile ' +
        '@types/command-line-args @typescript-eslint/eslint-plugin @typescript-eslint/parser ' +
        'eslint @types/fs-extra';
    if (withAuth || useSocketIo) {
        dependencies += ' bcrypt randomstring jsonwebtoken';
        devDependencies += ' @types/bcrypt @types/randomstring @types/jsonwebtoken';
    }
    if (useSocketIo) {
        dependencies += ' socket.io socket.io-client';
    }
    return {dependencies, devDependencies};
}


/**
 * Download the dependencies.
 * 
 * @param destination 
 * @param depStrings 
 */
function downloadNodeModules(destination, depStrings, useYarn) {
    const options = {cwd: destination};
    let downloadLibCmd;
    let downloadDepCmd;
    if (useYarn) {
        downloadLibCmd = 'yarn add ' + depStrings.dependencies;
        downloadDepCmd = 'yarn add ' + depStrings.devDependencies + ' -D';
    } else {
        downloadLibCmd = 'npm i -s ' + depStrings.dependencies;
        downloadDepCmd = 'npm i -D ' + depStrings.devDependencies;
    }
    childProcess.execSync(downloadLibCmd, options);
    childProcess.execSync(downloadDepCmd, options);
}


// Export entry point
module.exports = expressGenTs;
