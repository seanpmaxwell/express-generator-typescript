// Must be first
import '../env/loadEnv';

import logger from './Logger';
import app from './Server';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
    logger.info('Horse');
});
