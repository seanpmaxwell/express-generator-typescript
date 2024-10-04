/* eslint-disable */

const dotenv = require('dotenv');
const path = require('path');
const moduleAlias = require('module-alias');


// Check the env
const NODE_ENV = (process.env.NODE_ENV || 'development');

// Configure "dotenv"
const result2 = dotenv.config({
  path: path.join(__dirname, `./env/${NODE_ENV}.env`),
});
if (result2.error) {
  throw result2.error;
}

// Configure module-alias
if (NODE_ENV === 'production') {
  moduleAlias.addAlias('@src', __dirname + '/dist');
}

