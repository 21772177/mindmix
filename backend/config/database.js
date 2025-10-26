const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip if in demo mode (no valid mongo URI)
  const mongoUri = process.env.MONGO_URI;
  const isDemoMode = !mongoUri || mongoUri.includes('localhost') || mongoUri.includes('example');
  
  if (isDemoMode) {
    console.log('🎮 DEMO MODE: Database features disabled');
    console.log('📝 Register/Login disabled - using mock challenges only');
    console.log('💡 To enable full features, configure MongoDB Atlas in .env');
    return false;
  }
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.log('🎮 Running in DEMO MODE (database features disabled)');
    console.log('💡 Fix MONGO_URI in .env to enable full features');
    return false;
  }
};

module.exports = connectDB;
