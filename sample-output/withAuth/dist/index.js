"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("./LoadEnv");
const _server_1 = tslib_1.__importDefault(require("@server"));
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const port = Number(process.env.PORT || 3000);
_server_1.default.listen(port, () => {
    Logger_1.default.info('Express server started on port: ' + port);
});
