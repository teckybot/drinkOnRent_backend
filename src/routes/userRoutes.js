import express from 'express';
import { getUserDashboard, requestNewConnection } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorize('user'));

router.get('/dashboard', getUserDashboard);
router.post('/request-connection', requestNewConnection);

export default router;
