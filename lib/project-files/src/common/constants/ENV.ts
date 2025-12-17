import jetEnv, { num } from 'jet-env';
import { isValueOf } from 'jet-validators';

import { NODE_ENVS } from '.';

/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isValueOf(NODE_ENVS),
  Port: num,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
