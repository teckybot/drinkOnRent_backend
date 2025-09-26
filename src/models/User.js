import mongoose from 'mongoose';

// Base schema for all users
const options = { discriminatorKey: 'role', timestamps: true };

const BaseUserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true, match: /^\d{10}$/ },
  passwordHash: { type: String, required: true }
}, options);

// Base model
export const User = mongoose.model('User', BaseUserSchema);

// Regular User schema (inherits BaseUserSchema)
export const RegularUser = User.discriminator('user', new mongoose.Schema({
  name: { type: String, trim: true },
  location: {
    houseNoStreet: { type: String, trim: true },
    area: { type: String, trim: true },
    pincode: { type: String, match: /^\d{6}$/ },
  },
  assignedPurifiers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purifier' }],
  connectionRequestStatus: { type: String, enum: ['none', 'pending', 'accepted', 'rejected'], default: 'none' }
}));

// Admin schema (inherits BaseUserSchema)
export const AdminUser = User.discriminator('admin', new mongoose.Schema({
  // Admin-specific fields can go here (if needed)
  // If no extra fields, just leave empty
}));
