const fs = require('fs/promises');
const logger = require('jet-logger').default;

const onInit = require('./onInit');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const ROOT_README = './README.md';
const NPM_README = './assets/README-npm.md';
const BACKUP = './assets/README.backup.md';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

onInit(async () => {
  const command = process.argv[2];
  if (command === 'swap') {
    return swap();
  }
  if (command === 'restore') {
    return restore();
  }
  throw new Error(`Usage: node scripts/readme.js <swap|restore>`);
}, 'readme');

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Put the npm README at the root, keeping a backup of the real one.
 *
 * Copies rather than moves, so a failure at any point leaves every file
 * still readable somewhere. Refuses to run when a backup already exists,
 * because that means an earlier swap never got restored and overwriting
 * the backup would lose the only copy of the real README.
 *
 * @returns {Promise<void>}
 */
async function swap() {
  if (await exists(BACKUP)) {
    throw new Error(
      `"${BACKUP}" already exists, so a previous swap was never restored. ` +
        'Run "npm run readme:restore" before packing again.',
    );
  }
  if (await notExists(ROOT_README)) {
    throw new Error(`"${ROOT_README}" is missing; refusing to swap.`);
  }
  if (await notExists(NPM_README)) {
    throw new Error(`"${NPM_README}" is missing; refusing to swap.`);
  }
  await fs.copyFile(ROOT_README, BACKUP);
  await fs.copyFile(NPM_README, ROOT_README);
  logger.info('README swapped for the npm version.');
}

/**
 * Put the real README back.
 *
 * A no-op when no backup exists. That case is normal, not an error: npm
 * fires `postpack` on every pack, including ones that never swapped, and an
 * unguarded restore is what used to overwrite the files it meant to protect.
 *
 * @returns {Promise<void>}
 */
async function restore() {
  if (await notExists(BACKUP)) return;
  await fs.copyFile(BACKUP, ROOT_README);
  await fs.rm(BACKUP, { force: true });
  logger.info('README restored.');
}

// ============================= Shared Helpers ============================ //

/**
 * Whether a path exists.
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function notExists(path) {
  return !(await exists(path));
}

/**
 * Whether a path exists.
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
