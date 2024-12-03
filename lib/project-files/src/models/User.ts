import schema from '@src/util/schema';
import { isNum, isStr } from '@src/util/validators';


export interface IUser {
  id: number;
  name: string;
  email: string;
  created: Date;
}

const User = schema<IUser>({
  id: isNum,
  name: isStr,
  created: Date,
  email: isStr,
});


// **** Export default **** //

export default User;