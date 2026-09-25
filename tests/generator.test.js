const assert = require('assert/strict');
const childProcess = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { afterEach, beforeEach, describe, it } = require('test');

const expressGenTs = require('../lib/express-generator-typescript');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const ROOT = path.join(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'cli.js');

// Files the generated app can't run without (they once went missing from the
// published tarball).
const REQUIRED_TEMPLATE_FILES = [
  'bs-config.js',
  'package.json',
  'gitignore',
  'src/main.ts',
  'src/public/scripts/http.js',
  'src/public/scripts/render-users.js',
  'src/public/scripts/users.js',
  'src/public/scripts/lib/bootstrap.bundle.min.js',
  'src/views/users.html',
];

// ========================================================================= //
//                                   TESTS                                   //
// ========================================================================= //

describe('expressGenTs', () => {
  let tmp;

  beforeEach(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'egt-'));
  });

  afterEach(async () => {
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('copies the template, renames gitignore and sets the name', async () => {
    const dest = path.join(tmp, 'my-app');
    await expressGenTs(dest, { skipInstall: true });
    for (const file of REQUIRED_TEMPLATE_FILES.filter((f) => f !== 'gitignore')) {
      await fs.access(path.join(dest, file));
    }
    await fs.access(path.join(dest, '.gitignore'));
    await assert.rejects(fs.access(path.join(dest, 'gitignore')));
    const pkg = JSON.parse(await fs.readFile(path.join(dest, 'package.json')));
    assert.equal(pkg.name, 'my-app');
    assert.ok(Object.keys(pkg.dependencies).length > 0);
  });

  it('does not copy local build artifacts', async () => {
    const dest = path.join(tmp, 'app');
    await expressGenTs(dest, { skipInstall: true });
    for (const name of ['node_modules', 'dist', 'package-lock.json']) {
      await assert.rejects(fs.access(path.join(dest, name)));
    }
    await assert.rejects(
      fs.access(path.join(dest, 'src/repos/common/database.test.json')),
    );
  });

  it('refuses to write into a non-empty folder', async () => {
    const dest = path.join(tmp, 'existing');
    await fs.mkdir(dest);
    await fs.writeFile(path.join(dest, 'README.md'), 'mine');
    await assert.rejects(
      expressGenTs(dest, { skipInstall: true }),
      /not empty/,
    );
    assert.equal(await fs.readFile(path.join(dest, 'README.md'), 'utf8'), 'mine');
  });

  it('writes into a non-empty folder with force', async () => {
    const dest = path.join(tmp, 'existing');
    await fs.mkdir(dest);
    await fs.writeFile(path.join(dest, 'notes.txt'), 'keep');
    await expressGenTs(dest, { skipInstall: true, force: true });
    await fs.access(path.join(dest, 'src/main.ts'));
    await fs.access(path.join(dest, 'notes.txt'));
  });
});

// ================================ Test `CLI` ============================= //

describe('cli', () => {
  const run = (...args) =>
    childProcess.spawnSync(process.execPath, [CLI, ...args], {
      encoding: 'utf8',
    });

  it('prints help and exits 0', () => {
    const res = run('--help');
    assert.equal(res.status, 0);
    assert.match(res.stdout, /Usage: express-generator-typescript/);
  });

  it('prints the version', () => {
    const res = run('-v');
    assert.equal(res.status, 0);
    assert.equal(res.stdout.trim(), require('../package.json').version);
  });

  it('rejects unknown options instead of using them as the folder name', () => {
    const res = run('--use-yran');
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Unknown option/);
  });
});

describe('published package', () => {
  it('includes every file the generated app needs', () => {
    const out = childProcess.execSync(
      'npm pack --dry-run --json --ignore-scripts',
      { cwd: ROOT, encoding: 'utf8' },
    );
    const files = new Set(JSON.parse(out)[0].files.map((f) => f.path));
    for (const file of REQUIRED_TEMPLATE_FILES) {
      assert.ok(
        files.has('lib/project-files/' + file),
        `missing from tarball: lib/project-files/${file}`,
      );
    }
    for (const file of files) {
      assert.doesNotMatch(
        file,
        /project-files\/(node_modules|dist|\.vscode)\/|package-lock\.json$/,
      );
    }
  });
});
