
import express from 'express';
import {
  getSwitchStatus,
  getSwitchStatusAndActivate,
  updateSwitchStatus
} from '../controllers/developerPurifierController.js';

const router = express.Router();

/**
 * Developer / IoT APIs
 * Only the 3 APIs used by hardware team
 */

// API1: GET /api/purifiers/:id/status
// Returns the switch status (onlineStatus)
router.get('/:id/status', (req, res, next) => {
  const { onlineStatus } = req.query;
  // If query param onlineStatus=1 → call activate controller, else call normal status
  if (onlineStatus === '1' || onlineStatus === '0') {
    return getSwitchStatusAndActivate(req, res, next);
  }
  return getSwitchStatus(req, res, next);
});

// API3: PUT /api/purifiers?id=456&status=0
// Updates switch status based on query parameter
router.put('/', updateSwitchStatus);

export default router;
