import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import envVars from '@shared/env-vars';
import server from './server';


// Constants
const serverStartMsg = 'Express server started on port: ';

// Start server
server.listen(envVars.port, () => {
  logger.info(serverStartMsg + envVars.port.toString());
});
