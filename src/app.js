
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import purifierRoutes from './routes/purifierRoutes.js';
import developerPurifierRoutes from './routes/developerPurifierRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { authenticate, authorize } from './middlewares/auth.js';
import { removeHeaders, errorHandler } from './middlewares/header_ErrorHandler.js';
import { connectDB } from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.disable('x-powered-by');
app.set('etag', false);

app.use(removeHeaders);

// Correct CORS configuration (only one instance)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/user', authenticate, authorize('user'), userRoutes);

// Admin routes
app.use('/api/admin', authenticate, authorize('admin'), adminRoutes);

// Protect admin/application APIs
app.use('/api/purifiers', authenticate, authorize(['admin']), purifierRoutes);

// Developer/ IOT APIs
app.use('/api/dev/purifiers', developerPurifierRoutes);


// Test route
app.get('/', (req, res) => res.send('Ping successful. DOR-Server responded'));

// Error handling middleware
app.use(errorHandler);

export default app;