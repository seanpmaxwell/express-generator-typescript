// Must be first
import '../env/loadEnv';
import { logger } from '@shared';
import app from '@server';


// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
