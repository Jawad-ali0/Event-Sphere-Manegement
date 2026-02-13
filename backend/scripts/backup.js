const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for backup');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Backup function
const createBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Get all collections
    const collections = mongoose.connection.db.listCollections();
    const backupData = {};

    for await (const collection of collections) {
      const collectionName = collection.name;
      const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      backupData[collectionName] = data;
    }

    // Write backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup created: ${backupFile}`);

    // Clean up old backups (keep last 10)
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-'))
      .sort()
      .reverse();

    if (files.length > 10) {
      files.slice(10).forEach(file => {
        fs.unlinkSync(path.join(backupDir, file));
        console.log(`🗑️ Deleted old backup: ${file}`);
      });
    }

  } catch (error) {
    console.error('Backup error:', error);
    process.exit(1);
  }
};

// Restore function
const restoreBackup = async (backupFile) => {
  try {
    if (!fs.existsSync(backupFile)) {
      console.error('Backup file not found:', backupFile);
      process.exit(1);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    for (const [collectionName, documents] of Object.entries(backupData)) {
      const collection = mongoose.connection.db.collection(collectionName);

      // Clear existing data
      await collection.deleteMany({});

      // Insert backup data
      if (documents.length > 0) {
        await collection.insertMany(documents);
      }

      console.log(`✅ Restored ${documents.length} documents to ${collectionName}`);
    }

    console.log('✅ Database restored successfully');

  } catch (error) {
    console.error('Restore error:', error);
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  const command = process.argv[2];
  const backupFile = process.argv[3];

  await connectDB();

  if (command === 'backup') {
    await createBackup();
  } else if (command === 'restore' && backupFile) {
    await restoreBackup(backupFile);
  } else {
    console.log('Usage:');
    console.log('  node backup.js backup');
    console.log('  node backup.js restore <backup-file>');
    process.exit(1);
  }

  await mongoose.connection.close();
  console.log('Database connection closed');
};

if (require.main === module) {
  main();
}

module.exports = { createBackup, restoreBackup };
