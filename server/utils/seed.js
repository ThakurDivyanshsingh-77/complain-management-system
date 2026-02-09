import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

// Load environment variables
dotenv.config();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Staff Member',
    email: 'staff@example.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'IT',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User@123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User@123',
    role: 'user',
  },
];

// Sample complaints (will be created after users)
const getComplaintsData = (userId, staffId) => [
  {
    userId: userId,
    title: 'Wi-Fi not working in Library',
    category: 'IT',
    description: 'The wireless network connection keeps dropping in the central library. This has been happening for the past 3 days and is affecting my research work.',
    priority: 'high',
    status: 'pending',
    timeline: [{
      status: 'pending',
      note: 'Complaint submitted',
      updatedBy: userId,
    }],
  },
  {
    userId: userId,
    title: 'Broken chairs in classroom 301',
    category: 'Infrastructure',
    description: 'Multiple chairs in classroom 301 are broken and need immediate replacement. This is causing inconvenience during lectures.',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: staffId,
    timeline: [
      {
        status: 'pending',
        note: 'Complaint submitted',
        updatedBy: userId,
      },
      {
        status: 'in-progress',
        note: 'Assigned to maintenance team',
        updatedBy: staffId,
      },
    ],
  },
  {
    userId: userId,
    title: 'AC not cooling in Hostel Room 205',
    category: 'Hostel',
    description: 'The air conditioning unit in hostel room 205 is not cooling properly. It makes loud noises but does not reduce the temperature.',
    priority: 'medium',
    status: 'resolved',
    assignedTo: staffId,
    resolutionNote: 'AC serviced and refrigerant refilled. Working properly now.',
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    timeline: [
      {
        status: 'pending',
        note: 'Complaint submitted',
        updatedBy: userId,
      },
      {
        status: 'in-progress',
        note: 'Technician assigned',
        updatedBy: staffId,
      },
      {
        status: 'resolved',
        note: 'AC serviced and refrigerant refilled. Working properly now.',
        updatedBy: staffId,
      },
    ],
  },
];

/**
 * Seed database with sample data
 */
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get first user and staff IDs for complaints
    const regularUser = createdUsers.find(u => u.role === 'user');
    const staffUser = createdUsers.find(u => u.role === 'staff');

    if (regularUser && staffUser) {
      // Create sample complaints
      const complaintsData = getComplaintsData(regularUser._id, staffUser._id);
      const createdComplaints = await Complaint.create(complaintsData);
      console.log(`✅ Created ${createdComplaints.length} complaints`);
    }

    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 Database seeded successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('📧 Sample Login Credentials:');
    console.log('');
    console.log('👑 Admin:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin@123');
    console.log('');
    console.log('👷 Staff:');
    console.log('   Email: staff@example.com');
    console.log('   Password: Staff@123');
    console.log('');
    console.log('👤 User:');
    console.log('   Email: john@example.com');
    console.log('   Password: User@123');
    console.log('');
    console.log('═══════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
