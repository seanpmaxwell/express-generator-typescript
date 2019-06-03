import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express-serve-static-core';
import {BAD_REQUEST, OK} from 'http-status-codes';
import { User } from '../../entities/User'


@Controller('users')
export class UserController {

    public readonly CURRENT_ROUTE = '/users';
    public readonly REQ_PARAM_MISSING = 'One of the required params is missing';


    @Get(':name/:email')
    private get(req: Request, res: Response) {
        try {
            const { name, email } = req.params;
            if (name && email && email !== 'undefined') {
                return res.status(OK).json({
                    user: new User(name, email),
                });
            } else {
                return res.status(BAD_REQUEST).json({
                    error: this.REQ_PARAM_MISSING,
                });
            }
        } catch (err) {
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }
}
