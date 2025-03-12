import find from 'find';
import Jasmine from 'jasmine';
import logger from 'jet-logger';
import { argv } from 'process';


/******************************************************************************
                                Run
******************************************************************************/

// Start
(async () => {
  try {
    // Init Jasmine
    const jasmine = new Jasmine();
    jasmine.exitOnCompletion = false;
    // Set location of test files
    jasmine.loadConfig({
      random: true,
      spec_dir: 'spec',
      spec_files: [
        './tests/**/*.spec.ts',
      ],
      stopSpecOnExpectationFailure: false,
    });
    // Run all or a single unit-test
    let doneInfo: jasmine.JasmineDoneInfo;
    if (!!argv[2]) {
      const files = await findFile(argv[2]);
      if (files.length === 1) {
        doneInfo = await jasmine.execute([files[0]]);
      } else {
        return logger.err('Test file not found!');
      }
    } else {
      doneInfo = await jasmine.execute();
    }
    // Wait for tests to finish
    if (doneInfo?.overallStatus === 'passed') {
      logger.info('All tests have passed :)');
    } else if (doneInfo?.overallStatus === 'incomplete') {
      logger.warn('Some tests did not complete or were skipped');
    } else {
      logger.err('At least one test has failed :(');
    }
  } catch (err: unknown) {
    return logger.err(err);
  }
})();


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Wrap find file in a promise.
 */
function findFile(testFile: string): Promise<string[]> {
  return new Promise((res, rej) => {
    return find.file(testFile + '.spec.ts', './spec', (files: string[]) => {
      if (files.length > 0) {
        return res(files);
      } else {
        const err = new Error('Test file not found!');
        return rej(err);
      }
    });
  });
}
