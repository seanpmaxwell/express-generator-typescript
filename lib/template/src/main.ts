import logger from 'jet-logger';

import { EnvVars } from './common/constants/environment-consts';
import server from './server';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const SERVER_START_MESSAGE = `Express server started on port: ${EnvVars.PORT}`;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

// Start the server
server.listen(EnvVars.PORT, (err) => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MESSAGE);
  }
});
