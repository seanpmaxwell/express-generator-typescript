const path = require('path'),
  editJsonFile = require('edit-json-file'),
  childProcess = require('child_process'),
  ncp = require('ncp').ncp,
  fs = require('fs');


// **** Variables **** //

// Project folder paths
const PROJECT_FOLDER_PATH = './project-files',
  PROJECT_FOLDER_PATH_AUTH = './project-files-auth';

// Project-folder dependencies
const DEPENDENCIES = 'express dotenv morgan cookie-parser jet-logger ' +
  'module-alias express-async-errors helmet jsonfile inserturlparams ' + 
  'jet-paths moment ',
  DEPENDENCIES_AUTH = ' bcrypt jsonwebtoken',
  DEV_DEPENDENCIES = 'ts-node typescript nodemon find jasmine supertest ' +
    '@types/node @types/express @types/jasmine @types/find @types/morgan  ' +
    '@types/cookie-parser @types/supertest fs-extra tsconfig-paths ' +
    '@types/jsonfile @types/fs-extra ' +
    'eslint @eslint/js @types/eslint__js typescript-eslint eslint-plugin-n @stylistic/eslint-plugin-ts',
  DEV_DEPENDENCIES_AUTH = ' @types/bcrypt @types/jsonwebtoken';

// "ncp" options
const ncpOpts = {
  filter: (fileName) => {
    return !(fileName === 'package-lock.json' || fileName === 'node_modules');
  },
};


// **** Functions **** //

/**
 * Entry point
 */
async function expressGenTs(destination, useYarn, withAuth) {
  try {
    await copyProjectFiles(destination, withAuth);
    updatePackageJson(destination);
    await renameGitigoreFile(destination);
    downloadNodeModules(destination, useYarn, withAuth);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Copy project files
 */
function copyProjectFiles(destination, withAuth) {
  const folder = (withAuth ? PROJECT_FOLDER_PATH_AUTH : PROJECT_FOLDER_PATH),
    source = path.join(__dirname, folder);
  return /** @type {Promise<void>} */(new Promise((res, rej) => {
    return ncp(source, destination, ncpOpts, (err) => {
      return (!!err ? rej(err) : res());
    });
  }));
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
  return /** @type {Promise<void>} */(new Promise((res, rej) => 
    fs.rename(
      (destination + '/gitignore'),
      (destination + '/.gitignore'),
      (err => !!err ? rej(err) : res()),
    )
  ));
}

/**
 * Download the dependencies.
 */
function downloadNodeModules(destination, useYarn, withAuth) {
  const options = { cwd: destination };
  // Setup dependencies string
  let depStr = DEPENDENCIES,
    devDepStr = DEV_DEPENDENCIES;
  if (withAuth) {
    depStr += DEPENDENCIES_AUTH;
    devDepStr += DEV_DEPENDENCIES_AUTH;
  }
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


// **** Export entry point **** //

module.exports = expressGenTs;
