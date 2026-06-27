// Script to create predefined users in Firebase
// Run this once to set up initial users
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUser } from '../firebase/firestore';

/**
 * Creates predefined users in Firebase
 * Run this function once to set up initial users
 */
export const setupPredefinedUsers = async () => {
  const users = [
    {
      email: 'hod@department.com',
      password: 'hod123456',
      name: 'Dr. John Smith',
      role: 'hod'
    },
    {
      email: 'faculty1@department.com',
      password: 'faculty123',
      name: 'Prof. Sarah Johnson',
      role: 'faculty'
    },
    {
      email: 'faculty2@department.com',
      password: 'faculty123',
      name: 'Dr. Michael Brown',
      role: 'faculty'
    },
    {
      email: 'faculty3@department.com',
      password: 'faculty123',
      name: 'Prof. Emily Davis',
      role: 'faculty'
    }
  ];

  console.log('Setting up predefined users...');

  for (const userData of users) {
    try {
      // Try to create user (will fail if user already exists)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Create user document in Firestore
      await createUser(userCredential.user.uid, {
        name: userData.name,
        role: userData.role
      });
      
      console.log(`✓ Created user: ${userData.email} (${userData.role})`);
      
      // Sign out after creating
      await auth.signOut();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`✓ User ${userData.email} already exists, skipping...`);
      } else {
        console.error(`✗ Error creating user ${userData.email}:`, error.message);
      }
    }
  }

  console.log('User setup complete!');
};

