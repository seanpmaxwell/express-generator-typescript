/* tslint:disable-next-line */
const Jasmine = require('jasmine');
import { Logger } from '@overnightjs/logger';
import * as dotenv from 'dotenv';
import * as find from 'find';


// Init Jasmine
const jasmine = new Jasmine();


// Load test env vars
dotenv.config({path: `./env/testing.env`});


// Set location of test files
jasmine.loadConfig({
    random: true,
    spec_dir: 'src',
    spec_files: [
        './controllers/**/*.test.ts',
    ],
    stopSpecOnExpectationFailure: false,
});


// On complete callback function
jasmine.onComplete((passed: boolean) => {
    if (passed) {
        Logger.Info('All tests have passed :)');
    } else {
        Logger.Err('At least one test has failed :(');
    }
});


// Run all or a single unit-test
if (process.argv[2]) {
    const testFile = process.argv[2];
    find.file(testFile + '.test.ts', './src/controllers', (files) => {
        if (files.length === 1) {
            jasmine.execute([files[0]], testFile);
        } else {
            Logger.Err('Test file not found!');
        }
    });
} else {
    jasmine.execute();
}
