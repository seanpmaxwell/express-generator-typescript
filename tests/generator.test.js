const assert = require('assert/strict');
const childProcess = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { afterEach, beforeEach, describe, it } = require('node:test');

const expressGenTs = require('../lib/express-generator-typescript');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const ROOT = path.join(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'cli.js');

// Files the generated app can't run without (they once went missing from the
// published tarball).
const REQUIRED_TEMPLATE_FILES = [
  'package.json',
  'gitignore',
  'src/main.ts',
  'src/public/scripts/HttpClient.js',
  'src/public/scripts/renderUsers.js',
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
    const requiredFiles = REQUIRED_TEMPLATE_FILES.filter(
      (file) => file !== 'gitignore',
    );
    for (const file of requiredFiles) {
      const filePath = path.join(dest, file);
      await fs.access(filePath);
    }
    const gitignorePath = path.join(dest, '.gitignore');
    await fs.access(gitignorePath);
    const templateGitignorePath = path.join(dest, 'gitignore');
    const templateGitignoreAccess = fs.access(templateGitignorePath);
    await assert.rejects(templateGitignoreAccess);
    const packagePath = path.join(dest, 'package.json');
    const packageJson = await fs.readFile(packagePath);
    const pkg = JSON.parse(packageJson);
    assert.equal(pkg.name, 'my-app');
    const dependencyNames = Object.keys(pkg.dependencies);
    assert.ok(dependencyNames.length > 0);
  });

  it('does not copy local build artifacts', async () => {
    const dest = path.join(tmp, 'app');
    await expressGenTs(dest, { skipInstall: true });
    for (const name of ['node_modules', 'dist', 'package-lock.json']) {
      const artifactPath = path.join(dest, name);
      const artifactAccess = fs.access(artifactPath);
      await assert.rejects(artifactAccess);
    }
    const databasePath = path.join(dest, 'src/repos/common/database.test.json');
    const databaseAccess = fs.access(databasePath);
    await assert.rejects(databaseAccess);
  });

  it('refuses to write into a non-empty folder', async () => {
    const dest = path.join(tmp, 'existing');
    await fs.mkdir(dest);
    const readmePath = path.join(dest, 'README.md');
    await fs.writeFile(readmePath, 'mine');
    const generation = expressGenTs(dest, { skipInstall: true });
    await assert.rejects(generation, /not empty/);
    const readme = await fs.readFile(readmePath, 'utf8');
    assert.equal(readme, 'mine');
  });

  it('writes into a non-empty folder with force', async () => {
    const dest = path.join(tmp, 'existing');
    await fs.mkdir(dest);
    const notesPath = path.join(dest, 'notes.txt');
    await fs.writeFile(notesPath, 'keep');
    await expressGenTs(dest, { skipInstall: true, force: true });
    const mainPath = path.join(dest, 'src/main.ts');
    await fs.access(mainPath);
    await fs.access(notesPath);
  });
});

// =============================== Test `CLI` ============================== //

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
    const stdout = res.stdout.trim();
    const pkg = require('../package.json');
    assert.equal(stdout, pkg.version);
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
    const packageInfo = JSON.parse(out);
    const filePaths = packageInfo[0].files.map((file) => file.path);
    const files = new Set(filePaths);
    for (const file of REQUIRED_TEMPLATE_FILES) {
      const packagePath = 'lib/template/' + file;
      const isIncluded = files.has(packagePath);
      assert.ok(
        isIncluded,
        `missing from tarball: lib/template/${file}`,
      );
    }
    for (const file of files) {
      assert.doesNotMatch(
        file,
        /template\/(node_modules|dist|\.vscode)\/|package-lock\.json$/,
      );
    }
  });
});
