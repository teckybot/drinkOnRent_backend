
import express from 'express';
import {
  getAllPurifiers,
  createPurifier,
  updatePurifier,
  deletePurifier,
  togglePurifierStatus,
} from '../controllers/purifierController.js';

const router = express.Router();

/**
 * Application / Admin APIs
 * CRUD + toggle (internal use)
 */

// Get all purifiers
router.get('/', getAllPurifiers);

// Create a new purifier
router.post('/', createPurifier);

// Update a purifier by id
router.put('/:id', updatePurifier);

// Delete a purifier by id
router.delete('/:id', deletePurifier);

// Toggle purifier switch status by id
router.patch('/:id/toggle-status', togglePurifierStatus);

export default router;
