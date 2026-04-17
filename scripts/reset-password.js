const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('rotorbladet');
    const users = db.collection('users');

    const hashedPassword = await bcrypt.hash('7!Vt74%zH4MU', 10);

    const result = await users.updateOne(
      { email: 'gustav@copture.com' },
      {
        $set: {
          password: hashedPassword,
          lockUntil: null,
          loginAttempts: 0
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log('User not found, creating new admin user...');
      await users.insertOne({
        email: 'gustav@copture.com',
        password: hashedPassword,
        roles: ['admin'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created new user');
    } else {
      console.log('Password reset successful');
    }
  } finally {
    await client.close();
  }
}

resetPassword().catch(err => {
  console.error(err);
  process.exit(1);
});
