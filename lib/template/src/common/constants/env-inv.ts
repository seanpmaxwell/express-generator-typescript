import jetEnv, { num } from 'jet-env';

import type { ValueOf } from '../types/utility-types';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;
export type NodeEnvs = ValueOf<typeof NodeEnvs>;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

// Setup the is `NodeEnvs` validator
const isNodeEnv = (() => {
  const vals = Object.values(NodeEnvs);
  const valsFin = vals.map((item) => item.toLowerCase());
  const set = new Set(valsFin);
  return (val: unknown): val is NodeEnvs => set.has(val as NodeEnvs);
})();

export const EnvVars = jetEnv({
  NodeEnv: isNodeEnv,
  Port: num,
});
