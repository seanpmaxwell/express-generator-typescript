// Must be first
import '../env/loadEnv';

import * as find from 'find';
import logger from './Logger';

/* tslint:disable-next-line */
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

// Set location of test files
jasmine.loadConfig({
    random: true,
    spec_dir: 'src',
    spec_files: [
        './routes/**/*.test.ts',
    ],
    stopSpecOnExpectationFailure: false,
});

// On complete callback function
jasmine.onComplete((passed: boolean) => {
    if (passed) {
        logger.info('All tests have passed :)');
    } else {
        logger.error('At least one test has failed :(');
    }
});

// Run all or a single unit-test
if (process.argv[3]) {
    const testFile = process.argv[3];
    find.file(testFile + '.test.ts', './src/routes', (files) => {
        if (files.length === 1) {
            jasmine.execute([files[0]], testFile);
        } else {
            logger.error('Test file not found!');
        }
    });
} else {
    jasmine.execute();
}
