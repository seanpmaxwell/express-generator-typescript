"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../env/loadEnv");
const Logger_1 = require("./Logger");
const Server_1 = require("./Server");
const port = Number(process.env.PORT || 3000);
Server_1.default.listen(port, () => {
    Logger_1.default.info('Express server started on port: ' + port);
});
