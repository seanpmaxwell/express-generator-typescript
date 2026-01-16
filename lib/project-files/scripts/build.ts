import logger from 'jet-logger';

import { copy, copyFilesRec, exec, remove } from './common/utils';

/******************************************************************************
                                  Run
******************************************************************************/

(async () => {
  // Remove current build
    await remove('./dist/');
    await exec('npm run lint', '../');
    await exec('tsc --project tsconfig.prod.json', '../');
    // Copy
    await copyFilesRec('./src', './dist', ['.ts']);
    await copy('./temp/config.js', './config.js');
    await copy('./temp/src', './dist');
    await remove('./temp/');
})().catch((err) => {
    logger.err(err);
    process.exit(1);
})

