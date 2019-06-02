"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const core_1 = require("@overnightjs/core");
const logger_1 = require("@overnightjs/logger");
const ParentController_1 = require("./controllers/ParentController");
class Server extends core_1.Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
        this.EXPRESS_STARTED_MSG = 'Express server started on port: ';
        this.setupExpress();
        this.addControllers(new ParentController_1.ParentController());
        this.serveFrontEnd();
    }
    setupExpress() {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false,
        }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
    }
    serveFrontEnd() {
        const viewsDir = path.join(__dirname, 'views');
        this.app.set('views', viewsDir);
        const staticDir = path.join(__dirname, 'public');
        this.app.use(express.static(staticDir));
        this.app.get('*', (req, res) => {
            res.sendFile('index.html', { root: viewsDir });
        });
    }
    start(port) {
        this.app.listen(port, () => {
            logger_1.Logger.Imp(this.EXPRESS_STARTED_MSG + port);
        });
    }
}
exports.default = Server;
