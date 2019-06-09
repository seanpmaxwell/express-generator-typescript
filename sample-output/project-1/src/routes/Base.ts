import { Router } from 'express';
import UserRouter from './users/Users';

// Init router and path
const router = Router();
const path = '/api';

// Add sub-routes
router.use(UserRouter.path, UserRouter.router);

// Export the base-router
export default { router, path };
