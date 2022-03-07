import './pre-start'; // Must be the first import
import envVars from './shared/env-vars';
import logger from 'jet-logger';
import server from './server';


// Constants
const serverStartMsg = 'Express server started on port: ',
        port = (envVars.port || 3000);

// Start server
server.listen(port, () => {
    logger.info(serverStartMsg + port);
});
