let io;

export const initSocket = (serverInstance) => {
  io = serverInstance;

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User joins their personal room
    socket.on('join:user', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Admin can join a global admin room (optional)
    socket.on('join:admin', () => {
      socket.join('admins');
      console.log(`Admin joined room`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized.');
  }
  return io;
};

// Purifier events
export const emitPurifierCreated = (purifier) => {
  const socketIo = getIo();
  socketIo.emit("purifier:created", purifier);
};

export const emitPurifierUpdated = (purifier) => {
  const socketIo = getIo();
  socketIo.emit("purifier:updated", purifier);
};

export const emitPurifierDeleted = (purifierId) => {
  const socketIo = getIo();
  socketIo.emit("purifier:deleted", { id: purifierId });
};

export const emitPurifierToggled = (purifier) => {
  const socketIo = getIo();
  socketIo.emit("purifier:toggled", purifier);
};
