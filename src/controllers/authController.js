import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegularUser, AdminUser } from '../models/User.js';

const JWT_EXPIRES_IN = '7d';

export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    // Find the user in the base User collection
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Minimal response: phoneNumber and role
    res.json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { phoneNumber, password, role } = req.body;

    if (!phoneNumber || !password || !role) {
      return res.status(400).json({ message: 'Phone number, password, and role are required' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await User.findOne({ phoneNumber });
    if (exists) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'user') {
      newUser = await RegularUser.create({ phoneNumber, passwordHash });
    } else if (role === 'admin') {
      newUser = await AdminUser.create({ phoneNumber, passwordHash });
    }

    const token = jwt.sign(
      { sub: newUser._id, role: newUser.role, phoneNumber: newUser.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};
