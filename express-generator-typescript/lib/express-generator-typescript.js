/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;


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


function updatePackageJson(destination) {
    let file = editJsonFile(destination + '/package.json', {
        autosave: true
    });
    file.set('name', path.basename(destination));
}


function getDepStrings(withAuth) {
    let dependencies = 'express dotenv http-status-codes morgan cookie-parser winston ' +
        'module-alias command-line-args';
    let devDependencies = 'ts-node tslint typescript nodemon find jasmine supertest ' +
        '@types/node @types/express @types/jasmine @types/find @types/morgan ' +
        '@types/cookie-parser @types/supertest fs-extra tsconfig-paths @types/jsonfile ' +
        'jsonfile @types/command-line-args';
    if (withAuth) {
        dependencies += ' bcrypt randomstring jsonwebtoken';
        devDependencies += ' @types/bcrypt @types/randomstring @types/jsonwebtoken ' +
            'tslint-lines-between-class-members';
    }
    return {dependencies, devDependencies};
}


function downloadNodeModules(destination, dep) {
    const options = {cwd: destination};
    childProcess.execSync('npm i -s ' + dep.dependencies, options);
    childProcess.execSync('npm i -D ' + dep.devDependencies, options);
}


module.exports = expressGenTs;
