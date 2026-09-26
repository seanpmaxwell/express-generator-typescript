#!/usr/bin/env node
const path = require('path');
const { parseArgs } = require('util');

const expressGenTs = require('../lib/express-generator-typescript');
const { version, engines } = require('../package.json');

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const DEFAULT_DEST = 'express-gen-ts';
const MIN_NODE = engines.node.replace(/^>=/, '');

const HELP = `Usage: express-generator-typescript [project-name] [options]

Creates a new Express + TypeScript project (default name: "${DEFAULT_DEST}").

Options:
  --use-yarn     Install dependencies with yarn instead of npm
  --force        Write into the target folder even if it is not empty
  -h, --help     Show this help
  -v, --version  Show the version`;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

main().catch((err) => {
  console.error('\nProject setup failed: ' + err.message);
  process.exitCode = 1;
});

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Parse the command-line args and hand off to `expressGenTs`.
 *
 * @returns {Promise<void>}
 */
async function main() {
  // ---- Parse command-line-arguments
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'use-yarn': { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', short: 'v', default: false },
    },
  });
  if (values.help) {
    console.log(HELP);
    return;
  }
  if (values.version) {
    console.log(version);
    return;
  }
  if (positionals.length > 1) {
    throw new Error('Expected at most one project name.\n\n' + HELP);
  }
  assertNodeVersion();

  // ---- Run "express-generator-typescript"
  const dest = path.resolve(process.cwd(), positionals[0] ?? DEFAULT_DEST);
  console.log('Setting up new Express/TypeScript project in ' + dest);
  await expressGenTs(dest, {
    useYarn: values['use-yarn'],
    force: values.force,
  });
  console.log('Project setup complete!');
}

/**
 * The generated project's tooling (vitest, eslint) requires a recent Node, so
 * fail fast instead of producing a project that can't run.
 *
 * @returns {void}
 */
function assertNodeVersion() {
  const toParts = (v) => v.split('.').map(Number);
  const [maj, min] = toParts(process.versions.node);
  const [reqMaj, reqMin] = toParts(MIN_NODE);
  if (maj < reqMaj || (maj === reqMaj && min < reqMin)) {
    throw new Error(
      `Node ${MIN_NODE} or newer is required (found ${process.versions.node}).`,
    );
  }
}
