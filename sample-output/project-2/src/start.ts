/**
 * Local environment variables and start the server
 *
 * created by Sean Maxwell, 5/31/2019
 */

import * as dotenv from 'dotenv';
import Server from './Server';


// Set default env
const nodeEnv = process.argv[2] || 'development';

// Load the environment variables
const result2 = dotenv.config({path: `./env/${nodeEnv}.env`});
if (result2.error) {
    throw result2.error;
}

// Start the server
const server = new Server();
server.start(Number(process.env.PORT || 3000));
