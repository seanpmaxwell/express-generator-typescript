import * as express from 'express';
import * as path from 'path';

import { Server as OvernightServer } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { ParentController } from './controllers/ParentController';


class Server extends OvernightServer {

    private readonly EXPRESS_STARTED_MSG = 'Express server started on port: ';


    constructor() {
        super(process.env.NODE_ENV === 'development');
        this.setupExpress();
        this.serveFrontEnd();
        this.addControllers(new ParentController());
    }


    public setupExpress(): void {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
    }


    /**
     * Point express to the 'views' directory. If you're
     * using a single-page-application framework like
     * react or angular which has it's own development
     * server, you might want to configure this to only
     * serve the index file while in production mode.
     */
    private serveFrontEnd(): void {
        const viewsDir = path.join(__dirname, 'views');
        this.app.set('views', viewsDir);
        const staticDir = path.join(__dirname, 'public');
        this.app.use(express.static(staticDir));
        this.app.get('*', (req, res) => {
            res.sendFile('index.html', {root: viewsDir});
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
