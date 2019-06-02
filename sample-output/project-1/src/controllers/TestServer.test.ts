import { Server } from '@overnightjs/core';
import * as express from 'express';


export class TestServer extends Server {


    constructor() {
        super();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }


    public setController(controller: InstanceType<any>): void {
        super.addControllers(controller);
    }


    public getExpressInstance(): express.Application {
        return this.app;
    }
}
