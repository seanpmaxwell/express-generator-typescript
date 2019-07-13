import find from 'find';
import Jasmine from 'jasmine';
import { logger } from '@shared';

// Init Jasmine
const jasmine = new Jasmine(null);

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
if (process.argv[2]) {
    const testFile = process.argv[2];
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
