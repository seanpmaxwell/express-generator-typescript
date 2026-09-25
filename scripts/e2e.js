const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const onInit = require('./onInit');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const ROOT = path.join(__dirname, '..');

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

// Exercises exactly what a user gets: pack the tarball, generate a project
// from it, then build and test that project.
onInit(() => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'egt-e2e-'));
  try {
    run(`npm pack --pack-destination "${tmp}"`, ROOT);
    const tarball = fs.readdirSync(tmp).find((f) => f.endsWith('.tgz'));
    const app = path.join(tmp, 'e2e-app');
    run(
      `npx --yes --package "${path.join(tmp, tarball)}" ` +
        `express-generator-typescript "${app}"`,
      tmp,
    );
    run('npm run typecheck', app);
    run('npm run build', app);
    run('npm test', app, { CI: 'true' });
    console.log('\nE2E passed.');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}, 'e2e');

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Run a shell command, streaming its output and throwing on failure.
 *
 * @param {string} cmd
 * @param {string} cwd
 * @param {Record<string, string>} [env]
 * @returns {void}
 */
function run(cmd, cwd, env = {}) {
  console.log(`\n> ${cmd}  (in ${cwd})`);
  childProcess.execSync(cmd, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
}
