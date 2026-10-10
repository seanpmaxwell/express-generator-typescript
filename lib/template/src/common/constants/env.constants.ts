/* eslint-disable no-process-env */
import logger from 'jet-logger';
import { z } from 'zod';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;
export type NodeEnvs = z.infer<typeof NodeEnvsEnum>;

export const Env = {
  NODE_ENV: process.env.NODE_ENV?.toLowerCase(),
  PORT: Number(process.env.PORT),
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const NodeEnvsEnum = z.enum(NodeEnvs, 'Not a valid node environment');

const EnvSchema = z.object({
  NODE_ENV: NodeEnvsEnum,
  PORT: z.uint32('Express port must be a positive integer'),
});

// ===================== Validate Environment Variables ==================== //

{
  try {
    EnvSchema.parse(Env);
  } catch (err) {
    logger.err(err);
    throw err;
  }
}
