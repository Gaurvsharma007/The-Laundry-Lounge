/**
 * Admin Seeder Script
 * Run: node backend/seedAdmin.js
 * 
 * Creates or resets the permanent admin account using credentials from .env
 * Safe to run multiple times — will update existing admin rather than duplicate.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'backend', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/laundry-lounge';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@laundrylounge.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_NAME = 'Super Admin';

async function seedAdmin() {
  try {
    console.log('\n🔌 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define inline schema to avoid ES module import complexity
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      phone: { type: String, default: '0000000000' },
      password: { type: String, select: false },
      role: { type: String, enum: ['user', 'admin', 'operator'], default: 'user' },
      isVerified: { type: Boolean, default: false },
      verificationToken: String,
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Upsert admin — create if not exists, update if exists
    const result = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          phone: '0000000000',
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('═══════════════════════════════════════════');
    console.log('✅ Admin account ready!');
    console.log('───────────────────────────────────────────');
    console.log('📧 Email   :', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('👤 Role    : admin');
    console.log('✔  Verified: true');
    console.log('🆔 ID      :', result._id);
    console.log('═══════════════════════════════════════════\n');

    // Also verify all existing users so they can login
    const updateResult = await User.updateMany(
      { role: 'user', isVerified: false },
      { $set: { isVerified: true } }
    );
    if (updateResult.modifiedCount > 0) {
      console.log(`ℹ  Also verified ${updateResult.modifiedCount} existing user(s) so they can login.\n`);
    }

  } catch (error) {
    console.error('❌ Seeder failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedAdmin();
