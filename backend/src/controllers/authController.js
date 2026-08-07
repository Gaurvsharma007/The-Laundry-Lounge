import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ─── Generate signed JWT with id + role in payload ───────────────────────
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey12345',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// ─── Helper: build & send token response ─────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,          // ← critical for frontend routing
      isVerified: user.isVerified,
    },
  });
};

// ─── @route  POST /api/auth/register ─────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Generate 6-digit OTP
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // role is NOT taken from request body — always defaults to 'user'
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'user',             // hardcoded — users can never self-assign admin
      verificationToken,
    });

    console.log(`[OTP] Verification code for ${email}: ${verificationToken}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your account.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/login ─────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send token + full user object (including role)
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/verify ────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.verificationToken !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/seed-admin ───────────────────────────────────
// Creates the first admin account. Disabled in production.
export const seedAdmin = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Not available in production' });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: 'Admin account already exists',
        email: existingAdmin.email,
      });
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@laundrylounge.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      phone: '0000000000',
      role: 'admin',
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      credentials: {
        email: admin.email,
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/reset-admin ──────────────────────────────────
// Resets admin password from .env — for dev use only
export const resetAdminPassword = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Not available in production' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@laundrylounge.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      // Create admin if doesn't exist
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '0000000000',
        role: 'admin',
        isVerified: true,
      });
      return res.status(201).json({
        success: true,
        message: 'Admin created with credentials from .env',
        credentials: { email: adminEmail, password: adminPassword },
      });
    }

    // Reset password using the pre-save hook
    admin.password = adminPassword;
    admin.role = 'admin';
    admin.isVerified = true;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin password reset successfully',
      credentials: { email: adminEmail, password: adminPassword },
    });
  } catch (error) {
    next(error);
  }
};
