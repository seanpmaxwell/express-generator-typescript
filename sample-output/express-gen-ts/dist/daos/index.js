"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usingMockDb = (process.env.USE_MOCK_DB || '').toLowerCase();
let userDaoPath = './User/UserDao';
if (usingMockDb === 'true') {
    userDaoPath += '.mock';
}
exports.UserDao = require(userDaoPath).UserDao;
