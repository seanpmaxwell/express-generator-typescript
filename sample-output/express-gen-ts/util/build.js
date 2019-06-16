const fs = require('fs-extra');
const childProcess = require('child_process');


// remove current build, and create new one
fs.removeSync('./dist/');
fs.copySync('./src/public', './dist/public');
fs.copySync('./src/views', './dist/views');

// transpile the typescript files
childProcess.exec('tsc --build tsconfig.prod.json');
