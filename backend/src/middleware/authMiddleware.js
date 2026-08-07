import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Protect: verify JWT and attach user to req ───────────────────────────
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

    const user = await User.findById(decoded.id).select('-password');

    // Guard: user may have been deleted after token was issued
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
  }
};

// ─── Authorize: restrict access to specific roles ─────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: role '${req.user?.role}' is not authorized`,
      });
    }
    next();
  };
};

// ─── Admin-only shorthand middleware ─────────────────────────────────────
export const adminOnly = [protect, authorize('admin')];
