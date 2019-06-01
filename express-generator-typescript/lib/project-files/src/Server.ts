import * as express from 'express';
import * as path from 'path';

import { Server as OvernightServer } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { ParentController } from './controllers/ParentController';


class Server extends OvernightServer {

    private readonly BROWSER_MSG = 'Express server started in development mode.';
    private readonly EXPRESS_STARTED_MSG = 'Express server started on port: ';
    private readonly VIEWS_DIR = 'views';
    private readonly IDX_FILE = 'index.html';


    constructor() {
        super(process.env.NODE_ENV === 'development');
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.serveFrontEnd();
        this.addControllers(new ParentController());
    }


    /**
     * Point express to the 'views' directory. If you're
     * using a single-page-application framework like
     * react or angular which has it's own development
     * server, you might want to configure this to only
     * serve and index file while in production mode.
     */
    private serveFrontEnd(): void {
        const dir = path.join(__dirname, this.VIEWS_DIR);
        this.app.set(this.VIEWS_DIR,  dir);
        this.app.use(express.static(dir));
        this.app.get('*', (req, res) => {
            res.sendFile(this.IDX_FILE, {root: dir});
        });
    }


    /**
     * Start the express server.
     * @param port
     */
    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(this.EXPRESS_STARTED_MSG + port);
        });
    }
}

export default Server;
