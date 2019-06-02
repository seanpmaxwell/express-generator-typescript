const fs = require('fs-extra');
const childProcess = require('child_process');


// remove current build
fs.removeSync('./dist/');

// transpile the typescript files
childProcess.execSync('tsc --sourceMap false');

// Copy src and public files
fs.copySync('./src/public', './dist/public');
fs.copySync('./src/views', './dist/views');
