import { getIo } from './index.js';

export const emitConnectionRequested = (user) => {
  // Emit to admins (who joined 'admins' room)
  const io = getIo();
  io.to('admins').emit('connection:requested', { userId: user._id, name: user.name });
};

export const emitConnectionAccepted = (user, purifier) => {
  const io = getIo();
  io.to(user._id.toString()).emit('connection:accepted', purifier);
  // Notify admins to refresh pending list
  io.to('admins').emit('connection:updated', { userId: user._id.toString(), status: 'approved' });
};

export const emitConnectionRejected = (user) => {
  const io = getIo();
  io.to(user._id.toString()).emit('connection:rejected');
  // Notify admins to refresh pending list
  io.to('admins').emit('connection:updated', { userId: user._id.toString(), status: 'rejected' });
};
