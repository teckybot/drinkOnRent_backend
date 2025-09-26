import { RegularUser } from '../models/User.js';
import Purifier from '../models/Purifier.js';
import { emitConnectionRequested } from '../sockets/connectionEvents.js';

// GET /api/user/dashboard
export const getUserDashboard = async (req, res) => {
  try {
    let user = await RegularUser.findById(req.user.sub).populate('assignedPurifiers');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter out any missing or deleted purifier refs
    let assigned = Array.isArray(user.assignedPurifiers)
      ? user.assignedPurifiers.filter(Boolean)
      : [];

    // If no explicit assignment found, try to link by phoneNumber
    if (!assigned.length && user.phoneNumber) {
      const linked = await Purifier.findOne({ 'location.phoneNumber': user.phoneNumber });
      if (linked) {
        // Attach and persist; also reflect accepted state
        user.assignedPurifiers.push(linked._id);
        user.connectionRequestStatus = 'accepted';
        await user.save();
        // re-populate to return full doc
        user = await RegularUser.findById(req.user.sub).populate('assignedPurifiers');
        assigned = user.assignedPurifiers.filter(Boolean);
      }
    }

    res.json({
      assignedPurifiers: assigned,
      connectionRequestStatus: user.connectionRequestStatus
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/user/request-connection
export const requestNewConnection = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location || !location.houseNoStreet || !location.area || !location.pincode) {
      return res.status(400).json({ message: 'Name and complete location are required' });
    }

    const user = await RegularUser.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.connectionRequestStatus === 'pending') {
      return res.status(400).json({ message: 'Request already pending' });
    }

    // Update user info
    user.name = name;
    user.location = location; // add `location` field to RegularUser schema if not exists
    user.connectionRequestStatus = 'pending';
    await user.save();

    // Emit event to admins
    emitConnectionRequested(user);

    res.json({ message: 'Connection request sent successfully', status: user.connectionRequestStatus });
  } catch (err) {
    console.error('Request connection error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
