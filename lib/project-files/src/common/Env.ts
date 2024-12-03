import jetEnv, { num } from 'jet-env';

import { isEnumVal } from '@src/util/validators';
import { NodeEnvs } from './constants';


export default jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
});
