const path = require('path'),
  editJsonFile = require('edit-json-file'),
  childProcess = require('child_process'),
  ncp = require('ncp').ncp,
  fs = require('fs');


/******************************************************************************
                                 Variables
******************************************************************************/

// Project folder paths
const PROJECT_FOLDER_PATH = './project-files';

// Project-folder dependencies
const DEPENDENCIES = 'express dotenv morgan cookie-parser jet-logger ' +
  'module-alias express-async-errors helmet jsonfile inserturlparams ' + 
  'jet-paths dayjs jet-env jet-validators',
  DEV_DEPENDENCIES = 'ts-node typescript nodemon find jasmine supertest ' +
    '@types/node @types/express @types/jasmine @types/find @types/morgan  ' +
    '@types/cookie-parser @types/supertest fs-extra tsconfig-paths jiti @swc/core ' +
    '@types/jsonfile @types/fs-extra @types/module-alias @stylistic/eslint-plugin-js ' +
    'eslint @eslint/js @types/eslint__js typescript-eslint eslint-plugin-n @stylistic/eslint-plugin-ts';

// "ncp" options
const ncpOpts = {
  filter: (fileName) => {
    return !(fileName === 'package-lock.json' || fileName === 'node_modules');
  },
};


/******************************************************************************
                                 Functions
******************************************************************************/

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
  const source = path.join(__dirname, PROJECT_FOLDER_PATH);
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
function downloadNodeModules(destination, useYarn) {
  const options = { cwd: destination };
  // Setup dependencies string
  let depStr = DEPENDENCIES,
    devDepStr = DEV_DEPENDENCIES;
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


/******************************************************************************
                                Export
******************************************************************************/

module.exports = expressGenTs;
