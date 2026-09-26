import jetEnv, { num } from 'jet-env';
import tspo from 'tspo';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const EnvVars = jetEnv({
  NodeEnv: (v) => tspo.isValue(NodeEnvs, v),
  Port: num,
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default EnvVars;
