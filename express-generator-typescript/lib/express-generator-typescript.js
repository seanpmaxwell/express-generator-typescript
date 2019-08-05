/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;


async function expressGenTs(destination) {
    try {
        await copyProjectFiles(destination);
        updatePackageJson(destination);
        downloadNodeModules(destination);
    } catch (err) {
        console.error(err);
    }
}


function copyProjectFiles(destination) {
    const source = path.join(__dirname, './project-files');
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


function downloadNodeModules(destination) {
    const dependencies = 'express dotenv http-status-codes morgan cookie-parser winston ' +
        'module-alias cross-env';
    const devDependencies = 'ts-node tslint typescript nodemon find jasmine supertest ' +
        '@types/node @types/dotenv @types/express @types/jasmine @types/find @types/morgan ' +
        '@types/cookie-parser @types/supertest fs-extra tsconfig-paths @types/jsonfile ' +
        'jsonfile';
    const options = {cwd: destination};
    childProcess.execSync('npm i -s ' + dependencies, options);
    childProcess.execSync('npm i -D ' + devDependencies, options);
}


module.exports = expressGenTs;