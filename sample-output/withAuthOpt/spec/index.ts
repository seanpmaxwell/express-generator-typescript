import './LoadEnv';
import find from 'find';
import Jasmine from 'jasmine';
import commandLineArgs from 'command-line-args';
import { logger } from '@shared';

// Setup command line options
const options = commandLineArgs([
    {
        name: 'testFile',
        alias: 'f',
        type: String,
    },
]);

// Init Jasmine
const jasmine = new Jasmine(null);

// Set location of test files
jasmine.loadConfig({
    random: true,
    spec_dir: 'spec',
    spec_files: [
        './**/*.spec.ts',
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
if (options.testFile) {
    const testFile = options.testFile;
    find.file(testFile + '.spec.ts', './spec', (files) => {
        if (files.length === 1) {
            jasmine.specFiles = [files[0]];
            jasmine.execute();
        } else {
            logger.error('Test file not found!');
        }
    });
} else {
    jasmine.execute();
}
