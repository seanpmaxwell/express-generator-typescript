const path = require('path');
const editJsonFile = require('edit-json-file');
const childProcess = require('child_process');
const ncp = require('ncp').ncp;
const fs = require('fs');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const PROJECT_FOLDER_PATH = './project-files';

const DEPENDENCIES = [
  'cookie-parser',
  'cross-env',
  'dayjs',
  'dotenv',
  'express',
  'helmet',
  'jet-env',
  'jet-logger',
  'jet-paths',
  'jet-validators',
  'jsonfile',
  'module-alias',
  'morgan',
  'tspo',
];

const DEV_DEPENDENCIES = [
  '@eslint/js',
  '@swc/core',
  '@trivago/prettier-plugin-sort-imports',
  '@types/cookie-parser',
  '@types/find',
  '@types/fs-extra',
  '@types/jsonfile',
  '@types/module-alias',
  '@types/morgan',
  '@types/node',
  '@types/supertest',
  'browser-sync',
  'concurrently',
  'delay-cli',
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-n',
  'find',
  'fs-extra',
  'jet-id',
  'jiti',
  'nodemon',
  'prettier',
  'shx',
  'supertest',
  'ts-node',
  'tsconfig-paths',
  'typescript',
  'typescript-eslint',
  'vitest',
];

// ========================================================================= //
//                                    EXEC                                   //
// ========================================================================= //

const copyFolder = initCopyFolderFn();

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Entry point: scaffold a new project at `destination` and install its
 * dependencies.
 *
 * @param {string} dest - Absolute path to create the project in.
 * @param {boolean} useYarn - Install with yarn instead of npm.
 * @returns {Promise<void>}
 */
async function expressGenTs(dest, useYarn) {
  try {
    await copyProjectFiles(dest);
    updatePackageJson(dest);
    await renameGitigoreFile(dest);
    downloadNodeModules(dest, useYarn);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Copy the `project-files` template into `destination`.
 *
 * @param {string} dest
 * @returns {Promise<void>}
 */
function copyProjectFiles(dest) {
  const src = path.join(__dirname, PROJECT_FOLDER_PATH);
  return copyFolder(src, dest)
}

/**
 * Set the new project's name in package.json and clear out the template's
 * dependency lists (they get reinstalled fresh by `downloadNodeModules`).
 *
 * @param {string} dest
 * @returns {void}
 */
function updatePackageJson(dest) {
  let file = editJsonFile(dest + '/package.json', {
    autosave: true
  });
  file.set('name', path.basename(dest));
  file.set('dependencies', {});
  file.set('devDependencies', {});
}

/**
 * Rename the template's `gitignore` to `.gitignore`, because npm does not
 * allow a `.gitignore` file to be published.
 *
 * @param {string} dest
 * @returns {Promise<void>}
 */
function renameGitigoreFile(dest) {
  return /** @type {Promise<void>} */(new Promise((res, rej) => 
    fs.rename(
      (dest + '/gitignore'),
      (dest + '/.gitignore'),
      (err => !!err ? rej(err) : res()),
    )
  ));
}

/**
 * Install `DEPENDENCIES` and `DEV_DEPENDENCIES` into the new project.
 *
 * @param {string} dest
 * @param {boolean} useYarn - Install with yarn instead of npm.
 * @returns {void}
 */
function downloadNodeModules(dest, useYarn) {
  const options = { cwd: dest };
  // Setup dependencies string
  let depStr = DEPENDENCIES.join(' '),
    devDepStr = DEV_DEPENDENCIES.join(' ');
  // Setup download command
  let downloadLibCmd,
    downloadDepCmd;
  if (useYarn) {
    downloadLibCmd = 'yarn add ' + depStr;
    downloadDepCmd = 'yarn add ' + devDepStr + ' -D';
  } else {
    downloadLibCmd = 'npm i -s ' + depStr;
    downloadDepCmd = 'npm i -D ' + devDepStr;
  }
  // Execute command
  childProcess.execSync(downloadLibCmd, options);
  childProcess.execSync(downloadDepCmd, options);
}

/**
 * Initalize the copy-folder function
 * 
 * @returns {(src: string, dest: string) => Promise<void>}
 */
function initCopyFolderFn() {
  // Init `options`
  const options = {
    filter: (fileName) => {
      return !(fileName === 'package-lock.json' || fileName === 'node_modules');
    },
  };
  // Return function which wraps ncp in a `Promise`
  return (src, dest) => {
    return new Promise((res, rej) => {
      return ncp(src, dest, options, (err) => {
        return (!!err ? rej(err) : res());
      });
    });
  }
}

// ========================================================================= //
//                                   EXPORT                                  //
// ========================================================================= //

module.exports = expressGenTs;
