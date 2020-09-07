"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDaoMock = void 0;
const tslib_1 = require("tslib");
const jsonfile_1 = tslib_1.__importDefault(require("jsonfile"));
class MockDaoMock {
    constructor() {
        this.dbFilePath = 'src/daos/MockDb/MockDb.json';
    }
    openDb() {
        return jsonfile_1.default.readFile(this.dbFilePath);
    }
    saveDb(db) {
        return jsonfile_1.default.writeFile(this.dbFilePath, db);
    }
}
exports.MockDaoMock = MockDaoMock;
