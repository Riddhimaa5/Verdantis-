/**
 * Seed script — populates the database with minimal demo data so the
 * hackathon demo has something to show immediately.
 * Run with: npm run seed
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Department = require('../models/Department');
const EmissionFactor = require('../models/EmissionFactor');
const DepartmentESGScore = require('../models/DepartmentESGScore');
const Badge = require('../models/Badge');
const Reward = require('../models/Reward');

const seed = async () => {
  await connectDB();

  console.log('🌱 Clearing existing demo collections...');
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    EmissionFactor.deleteMany({}),
    DepartmentESGScore.deleteMany({}),
    Badge.deleteMany({}),
    Reward.deleteMany({}),
  ]);

  console.log('🏢 Creating departments...');
  const departments = await Department.insertMany([
    { name: 'Operations', code: 'OPS', description: 'Operations & Facilities' },
    { name: 'Human Resources', code: 'HR', description: 'People & Culture' },
    { name: 'Engineering', code: 'ENG', description: 'Product & Engineering' },
  ]);

  await DepartmentESGScore.insertMany(departments.map((d) => ({ department: d._id })));

  console.log('👤 Creating users (password for all: Password123)...');
  const admin = await User.create({
    name: 'Ava Admin',
    email: 'admin@verdantis.io',
    password: 'Password123',
    role: 'Admin',
    department: departments[0]._id,
  });

  const manager = await User.create({
    name: 'Max Manager',
    email: 'manager@verdantis.io',
    password: 'Password123',
    role: 'Manager',
    department: departments[2]._id,
  });

  const employee = await User.create({
    name: 'Eli Employee',
    email: 'employee@verdantis.io',
    password: 'Password123',
    role: 'Employee',
    department: departments[2]._id,
  });

  console.log('🔥 Creating emission factors...');
  await EmissionFactor.insertMany([
    { activityType: 'Electricity', unit: 'kWh', factorValue: 0.4, scope: 'Scope 2', createdBy: admin._id },
    { activityType: 'Diesel Fuel', unit: 'litre', factorValue: 2.68, scope: 'Scope 1', createdBy: admin._id },
    { activityType: 'Air Travel', unit: 'km', factorValue: 0.15, scope: 'Scope 3', createdBy: admin._id },
  ]);

  console.log('🏅 Creating badges...');
  await Badge.insertMany([
    { name: 'Green Starter', xpRequired: 0, tier: 'Bronze', description: 'Welcome to Verdantis!' },
    { name: 'Eco Warrior', xpRequired: 100, tier: 'Silver', description: 'Earned 100 XP' },
    { name: 'Sustainability Champion', xpRequired: 500, tier: 'Gold', description: 'Earned 500 XP' },
  ]);

  console.log('🎁 Creating rewards...');
  await Reward.insertMany([
    { title: 'Reusable Water Bottle', pointsCost: 50, stock: 20, category: 'Merchandise' },
    { title: 'Extra Day Off', pointsCost: 500, stock: 5, category: 'Time Off' },
  ]);

  console.log('✅ Seed complete!');
  console.log(`   Admin login:    admin@verdantis.io / Password123`);
  console.log(`   Manager login:  manager@verdantis.io / Password123`);
  console.log(`   Employee login: employee@verdantis.io / Password123`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
