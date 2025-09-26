import { RegularUser } from '../models/User.js';
import Purifier from '../models/Purifier.js';
import { emitConnectionAccepted, emitConnectionRejected } from '../sockets/connectionEvents.js';
import { emitPurifierCreated } from '../sockets/index.js';

// GET /api/admin/pending-connections
export const getPendingConnections = async (req, res) => {
  try {
    const pendingUsers = await RegularUser.find({ connectionRequestStatus: 'pending' })
      .select('_id name phoneNumber location connectionRequestStatus');
    res.json(pendingUsers);
  } catch (err) {
    console.error('Pending connections error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/accept-connection
export const acceptConnection = async (req, res) => {
  try {
    const { userId, purifierData } = req.body;

    if (!userId || !purifierData || !purifierData.location || !purifierData.name) {
      return res.status(400).json({ message: 'userId and purifierData with name & location are required' });
    }

    const user = await RegularUser.findById(userId);
    if (!user || user.connectionRequestStatus !== 'pending') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Generate unique 5-digit Purifier ID
    let randomId;
    let exists = true;
    while (exists) {
      randomId = Math.floor(10000 + Math.random() * 90000).toString();
      exists = await Purifier.findOne({ id: randomId });
    }
    purifierData.id = randomId;

    const newPurifier = await Purifier.create(purifierData);

    // Notify dashboards about new purifier
    emitPurifierCreated(newPurifier);

    // Assign to user
    user.assignedPurifiers.push(newPurifier._id);
    user.connectionRequestStatus = 'accepted';
    await user.save();

    // Emit socket event to user
    emitConnectionAccepted(user, newPurifier);

    res.json({ message: 'Connection accepted', purifier: newPurifier });

  } catch (err) {
    console.error('Accept connection error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /api/admin/reject-connection/:userId
export const rejectConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const user = await RegularUser.findById(userId);
    if (!user || user.connectionRequestStatus !== 'pending') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    user.connectionRequestStatus = 'rejected';
    await user.save();

    emitConnectionRejected(user);

    res.json({ message: 'Connection rejected' });

  } catch (err) {
    console.error('Reject connection error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
