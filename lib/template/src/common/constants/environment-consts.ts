/* eslint-disable no-process-env */
import logger from 'jet-logger';

import { isNumber, isValueOf, type ValueOf } from '../utils/validators';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;
export type NodeEnvs = ValueOf<typeof NodeEnvs>;

export const EnvVars = {
  NODE_ENV: process.env.NODE_ENV?.toLowerCase(),
  PORT: Number(process.env.PORT),
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

// ---- Validation
// Validate the "environment variables"
{
  try {
    const isNodeEnv = isValueOf(NodeEnvs);
    if (!isNodeEnv(EnvVars.NODE_ENV)) {
      throw new Error(
        'process.env.NODE_ENV must be "development", "test", or "production"',
      );
    }
    if (!isNumber(EnvVars.PORT)) {
      throw new Error('process.env.PORT must be a valid number');
    }
  } catch (err) {
    logger.err(err);
    throw err;
  }
}
