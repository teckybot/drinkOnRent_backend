
import dotenv from "dotenv";
dotenv.config(); 

import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { initSocket } from './src/sockets/index.js'

const PORT = process.env.PORT || 5000;

// Create HTTP server with Express
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend origin in production
    methods: ['GET','POST','PUT','PATCH']
  }
});

// Attach io to global context for use in controllers
app.set('io', io);

// Initialize socket handlers
initSocket(io);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
