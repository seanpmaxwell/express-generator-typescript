"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const functions_1 = require("@shared/functions");
const MockDao_mock_1 = require("../MockDb/MockDao.mock");
class UserDao extends MockDao_mock_1.MockDaoMock {
    getOne(email) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                for (const user of db.users) {
                    if (user.email === email) {
                        return user;
                    }
                }
                return null;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAll() {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                return db.users;
            }
            catch (err) {
                throw err;
            }
        });
    }
    add(user) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                user.id = functions_1.getRandomInt();
                db.users.push(user);
                yield _super.saveDb.call(this, db);
            }
            catch (err) {
                throw err;
            }
        });
    }
    update(user) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                for (let i = 0; i < db.users.length; i++) {
                    if (db.users[i].id === user.id) {
                        db.users[i] = user;
                        yield _super.saveDb.call(this, db);
                        return;
                    }
                }
                throw new Error('User not found');
            }
            catch (err) {
                throw err;
            }
        });
    }
    delete(id) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                for (let i = 0; i < db.users.length; i++) {
                    if (db.users[i].id === id) {
                        db.users.splice(i, 1);
                        yield _super.saveDb.call(this, db);
                        return;
                    }
                }
                throw new Error('User not found');
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = UserDao;
