import jetEnv, { num } from 'jet-env';
import { isValueOf } from 'jet-validators';

import { NodeEnvs } from '.';

/******************************************************************************
                                 Setup
******************************************************************************/

const EnvVars = jetEnv({
  NodeEnv: isValueOf(NodeEnvs),
  Port: num,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
