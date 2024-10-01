var dotenv = require('dotenv');
var path = require('path');


// Check the env
var NODE_ENV = process.env.NODE_ENV || 'development';

// Configure the file
const result2 = dotenv.config({
  path: path.join(__dirname, `./env/${NODE_ENV}.env`),
});

// Check for errors
if (result2.error) {
  throw result2.error;
}
