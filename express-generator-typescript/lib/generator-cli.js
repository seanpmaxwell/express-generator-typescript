/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const async = require('async');
const path = require('path');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;



start().then(() => {
    console.log('Setting up new Express/TypeScript project complete')
});


async function start() {
    try {
        const source = path.join(__dirname, './project-files');
        const destination = path.join(process.cwd(), (process.argv[2] || ''));
        await copyProjectFiles(source, destination);
        downloadNodeModules(destination);
    } catch (err) {
        console.error(err);
    }
}


function copyProjectFiles(source, destination) {
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

function downloadNodeModules(destination) {

    const dependencies = 'express @overnightjs/core @overnightjs/logger dotenv ' +
        'http-status-codes morgan cookie-parser';

    const devDependencies = 'ts-node tslint typescript nodemon find jasmine supertest ' +
        '@types/node @types/dotenv @types/express @types/jasmine @types/find @types/morgan ' +
        '@types/cookie-parser @types/supertest';

    const options = {cwd: destination};

    childProcess.execSync('npm i -s ' + dependencies, options);
    childProcess.execSync('npm i -D ' + devDependencies, options);
}
