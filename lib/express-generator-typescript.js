const childProcess = require('child_process');
const fs = require('fs/promises');
const path = require('path');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const TEMPLATE_DIR = path.join(__dirname, 'template');

// Local build/editor artifacts that only exist when running from a checkout.
const EXCLUDED_NAMES = new Set([
  'node_modules',
  'package-lock.json',
  'dist',
  'tsconfig.tsbuildinfo',
  '.vscode',
  'database.test.json',
]);

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Entry point: scaffold a new project at `dest` and install its dependencies.
 * Rejects on any failure so callers can report it and exit non-zero.
 *
 * @param {string} dest - Absolute path to create the project in.
 * @param {object} [options]
 * @param {boolean} [options.useYarn] - Install with yarn instead of npm.
 * @param {boolean} [options.force] - Allow writing into a non-empty folder.
 * @param {boolean} [options.skipInstall] - Don't install dependencies.
 * @returns {Promise<void>}
 */
async function expressGenTs(dest, options = {}) {
  const { useYarn = false, force = false, skipInstall = false } = options;
  if (!force) {
    await assertEmptyOrMissing(dest);
  }
  await copyProjectFiles(dest);
  await setPackageName(dest);
  await renameGitignoreFile(dest);
  if (!skipInstall) {
    installDependencies(dest, useYarn);
  }
}

/**
 * Throw if `dest` exists and has any contents, so existing work is never
 * overwritten.
 *
 * @param {string} dest
 * @returns {Promise<void>}
 */
async function assertEmptyOrMissing(dest) {
  let entries;
  try {
    entries = await fs.readdir(dest);
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
  if (entries.length > 0) {
    throw new Error(
      `"${dest}" already exists and is not empty. Choose another name or ` +
        'pass --force to write into it anyway.',
    );
  }
}

/**
 * Copy the `template` folder into `dest`.
 *
 * @param {string} dest
 * @returns {Promise<void>}
 */
function copyProjectFiles(dest) {
  return fs.cp(TEMPLATE_DIR, dest, {
    recursive: true,
    filter: (src) => !EXCLUDED_NAMES.has(path.basename(src)),
  });
}

/**
 * Name the new project after its folder.
 *
 * @param {string} dest
 * @returns {Promise<void>}
 */
async function setPackageName(dest) {
  const pkgPath = path.join(dest, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  pkg.name = path.basename(dest);
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

/**
 * Rename the template's `gitignore` to `.gitignore`, because npm does not
 * allow a `.gitignore` file to be published.
 *
 * @param {string} dest
 * @returns {Promise<void>}
 */
function renameGitignoreFile(dest) {
  return fs.rename(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
}

/**
 * Install the versions pinned in the template's package.json.
 *
 * @param {string} dest
 * @param {boolean} useYarn
 * @returns {void}
 */
function installDependencies(dest, useYarn) {
  const cmd = useYarn ? 'yarn install' : 'npm install';
  childProcess.execSync(cmd, { cwd: dest, stdio: 'inherit' });
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

module.exports = expressGenTs;
