import logger from 'jet-logger';

import { Env } from './common/constants/env.constants';
import server from './server';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const SERVER_START_MESSAGE = `Express server started on port: ${Env.PORT}`;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

// Start the server
server.listen(Env.PORT, (err) => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MESSAGE);
  }
});
