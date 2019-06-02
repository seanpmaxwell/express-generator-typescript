import { Children, Controller } from '@overnightjs/core';
import { UserController } from './user/UserController';


@Controller('api')
@Children([
    new UserController(),
])
export class ParentController { }
