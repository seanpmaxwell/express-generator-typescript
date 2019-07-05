let dotenv = require('dotenv');

// Set default to "development"
const nodeEnv = process.env.LOAD_ENV || 'development';
const result2 = dotenv.config({
    path: `./env/${nodeEnv}.env`,
});

if (result2.error) {
    throw result2.error;
}
