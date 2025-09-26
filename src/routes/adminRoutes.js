import express from 'express';
import { getPendingConnections, acceptConnection, rejectConnection } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/pending-connections', getPendingConnections);
router.post('/accept-connection', acceptConnection);
router.patch('/reject-connection/:userId', rejectConnection);

export default router;
