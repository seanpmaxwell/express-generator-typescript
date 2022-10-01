import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import envVars from '@shared/env-vars';
import server from './server';


// **** Start server **** //

const msg = ('Express server started on port: ' + envVars.port.toString());
server.listen(envVars.port, () => logger.info(msg));
