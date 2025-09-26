
import Purifier from '../models/Purifier.js';
import activeTimers from '../utils/activeTimers.js';
import { emitPurifierUpdated, emitPurifierToggled } from '../sockets/index.js';

/**
 * API1 - GET /api/purifiers/:id/status
 * Returns the switch status (onlineStatus) only
 */
export const getSwitchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const purifier = await Purifier.findOne({ id });

    if (!purifier) {
      return res.status(404).json({ message: 'Purifier not found', id });
    }

    // Emit real-time update to dashboard
    emitPurifierUpdated(purifier);

    res.json({
      id: purifier.id,
      switchStatus: purifier.onlineStatus ? 1 : 0,
      message: 'Switch status returned'
    });
  } catch (error) {
    console.error('Error in getSwitchStatus:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

/**
 * API2 - GET /api/purifiers/:id/status?onlineStatus=1
 * Returns switch status and activates device temporarily for 60 seconds if onlineStatus=1
 */
export const getSwitchStatusAndActivate = async (req, res) => {
  try {
    const { id } = req.params;
    const { onlineStatus } = req.query;

    const purifier = await Purifier.findOne({ id });

    if (!purifier) {
      return res.status(404).json({ message: 'Purifier not found', id });
    }

    // If onlineStatus=1, activate device temporarily
    if (onlineStatus === '1') {
      purifier.status = true; // turn ON device
      purifier.lastOnline = null; // reset lastOnline while online

      // Clear existing timer if exists
      if (activeTimers.has(id)) {
        clearTimeout(activeTimers.get(id));
      }

      const timer = setTimeout(async () => {
        if (purifier.status) {
          purifier.status = false; // turn OFF after 60s
          purifier.lastOnline = new Date();
          await purifier.save();

          // Emit update after timer ends
          emitPurifierUpdated(purifier);
        }
        activeTimers.delete(id);
      }, 60000); // 60 seconds

      activeTimers.set(id, timer);

    } else {
      // onlineStatus != 1 → force deviceStatus to 0
      if (purifier.status) {
        purifier.status = false;
        purifier.lastOnline = new Date(); // only set if device was ON
      }
      // Clear any running timer
      if (activeTimers.has(id)) {
        clearTimeout(activeTimers.get(id));
        activeTimers.delete(id);
      }
    }

    await purifier.save();
    // Emit update immediately after activation
    emitPurifierUpdated(purifier);

    res.json({
      id: purifier.id,
      switchStatus: purifier.onlineStatus ? 1 : 0,
      deviceStatus: purifier.status ? 1 : 0,
      message: onlineStatus === '1'
        ? 'Switch status returned and purifier activated'
        : 'Switch status returned and purifier deactivated'
    });
  } catch (error) {
    console.error('Error in getSwitchStatusAndActivate:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

/**
 * API3 - PUT /api/purifiers?id=456&status=0
 * Updates the switch status (onlineStatus) based on query parameter
 */
export const updateSwitchStatus = async (req, res) => {
  try {
    const { id, status } = req.query;

    if (!id || typeof status === 'undefined') {
      return res.status(400).json({ message: 'id and status query parameters are required' });
    }

    const purifier = await Purifier.findOne({ id });

    if (!purifier) {
      return res.status(404).json({ message: 'Purifier not found', id });
    }

    purifier.onlineStatus = status === '1';

    await purifier.save();

    // Emit update to dashboard
    emitPurifierToggled(purifier);

    res.json({
      id: purifier.id,
      status: purifier.onlineStatus ? 1 : 0,
      message: 'Switch status updated successfully'
    });
  } catch (error) {
    console.error('Error in updateSwitchStatus:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
