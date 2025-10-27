const mongoose = require('mongoose');

const connectDB = async () => {
  // Get MongoDB URI from environment
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.log('⚠️  No MongoDB URI found. Running in DEMO MODE.');
    console.log('💡 Set MONGO_URI environment variable to enable database features');
    return false;
  }
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Running in DEMO MODE (database features disabled)');
    console.log('💡 Check MONGO_URI in environment variables');
    return false;
  }
};

module.exports = connectDB;
