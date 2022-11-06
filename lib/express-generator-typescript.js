/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require('path');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;
const fs = require('fs');


// **** Variables **** //

// Misc
const prjFolder = './project-files';

// ncp options
const ncpOpts = {
  filter: (fileName) => {
    return !(fileName === 'package-lock.json' || fileName === 'node_modules');
  },
};

// Project-folder dependencies
const dependencies = 'express dotenv morgan cookie-parser jet-logger ' +
  'module-alias command-line-args express-async-errors helmet jsonfile ' + 
  'bcrypt jsonwebtoken jet-validator';

// Project-folder development dependencies
const devDependencies = 'ts-node typescript nodemon find jasmine supertest ' +
  '@types/node @types/express @types/jasmine @types/find @types/morgan  ' +
  '@types/cookie-parser @types/supertest fs-extra tsconfig-paths ' +
  '@types/jsonfile @types/command-line-args ' +
  '@typescript-eslint/eslint-plugin @typescript-eslint/parser eslint ' + 
  '@types/fs-extra @types/bcrypt @types/jsonwebtoken eslint-plugin-node';


// **** Functions **** //

/**
 * Entry point
 */
async function expressGenTs(destination, useYarn) {
  try {
    await copyProjectFiles(destination);
    updatePackageJson(destination);
    await renameGitigoreFile(destination);
    downloadNodeModules(destination, useYarn);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Copy project files
 */
function copyProjectFiles(destination) {
  const source = path.join(__dirname, prjFolder);
  return new Promise((res, rej) => {
    ncp.limit = 16;
    return ncp(source, destination, ncpOpts, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Set update the package.json file.
 */
function updatePackageJson(destination) {
  let file = editJsonFile(destination + '/package.json', {
    autosave: true
  });
  file.set('name', path.basename(destination));
  file.set('dependencies', {});
  file.set('devDependencies', {});
}

/**
 * Because npm does not allow .gitignore to be published.
 */
function renameGitigoreFile(destination) {
  return new Promise((res, rej) => 
    fs.rename(
      (destination + '/gitignore'),
      (destination + '/.gitignore'),
      (err => !!err ? rej(err) : res()),
    )
  );
}

/**
 * Download the dependencies.
 */
function downloadNodeModules(destination, useYarn) {
  const options = {cwd: destination};
  let downloadLibCmd;
  let downloadDepCmd;
  if (useYarn) {
    downloadLibCmd = 'yarn add ' + dependencies;
    downloadDepCmd = 'yarn add ' + devDependencies + ' -D';
  } else {
    downloadLibCmd = 'npm i -s ' + dependencies;
    downloadDepCmd = 'npm i -D ' + devDependencies;
  }
  childProcess.execSync(downloadLibCmd, options);
  childProcess.execSync(downloadDepCmd, options);
}


// **** Export entry point **** //

module.exports = expressGenTs;
