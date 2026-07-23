import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const run = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in .env');
  }

  if (!name || !email || !password) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env before running this script');
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    throw new Error('ADMIN_PASSWORD in .env must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters (e.g. Admin123!@#).');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists for ${email}`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  console.log(`Admin created: ${admin.email}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
