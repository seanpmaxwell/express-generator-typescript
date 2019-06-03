
// Setup the environment variables
import * as dotenv from 'dotenv';

const nodeEnv = process.argv[2] || 'development';
const envFilePath = `./env/${nodeEnv}.env`;

const result2 = dotenv.config({path: envFilePath});
if (result2.error) {
    throw result2.error;
}


// Start the server, server must be imported
// after loading the environment variables
import Server from './Server';
const isDevMode = (nodeEnv === 'development');

const server = new Server(isDevMode);
server.start(Number(process.env.PORT || 3000));
