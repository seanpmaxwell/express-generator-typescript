import jetEnv, { num } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from './constants';


export default jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
});
