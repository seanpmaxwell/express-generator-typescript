const fs = require('fs-extra');
const childProcess = require('child_process');


// remove current build
fs.removeSync('./dist/');

// transpile the typescript files
childProcess.execSync('tsc --build tsconfig.prod.json');

// Copy src and public files
fs.copySync('./src/public', './dist/public');
fs.copySync('./src/views', './dist/views');
