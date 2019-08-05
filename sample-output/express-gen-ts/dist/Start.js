"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _server_1 = tslib_1.__importDefault(require("@server"));
const _shared_1 = require("@shared");
const port = Number(process.env.PORT || 3000);
_server_1.default.listen(port, () => {
    _shared_1.logger.info('Express server started on port: ' + port);
});
