// This is a simple test script to directly test user creation with a role
// Run with: node -r @babel/register test-user-creation.js

import { createUser } from './db/utils';

async function testUserCreation() {
  try {
    console.log('Testing user creation with role...');
    
    const testUser = await createUser({
      username: 'testrenter_direct',
      email: 'testrenter_direct@example.com',
      password: '123456',
      role: 'renter', // Explicitly setting role
      full_name: 'Test Direct',
    });
    
    console.log('User created successfully:', testUser);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

testUserCreation(); 