import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express-serve-static-core';
import { OK } from 'http-status-codes';
import User from '../../entities/User'


@Controller('users')
export class UserController {


    @Get(':name/:email')
    private get(req: Request, res: Response) {
        return res.status(OK).json({
            user: new User(req.params.name, req.params.email),
        })
    }
}
