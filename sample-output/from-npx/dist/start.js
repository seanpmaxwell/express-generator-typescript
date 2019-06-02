"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const Server_1 = require("./Server");
const nodeEnv = process.argv[2] || 'development';
const result2 = dotenv.config({ path: `./env/${nodeEnv}.env` });
if (result2.error) {
    throw result2.error;
}
const server = new Server_1.default();
server.start(Number(process.env.PORT || 3000));
