import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

const connectDB = async (): Promise<void> => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      // Start an in-memory MongoDB server so it runs without user needing local MongoDB server
      mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      console.log('\n=============================================');
      console.log('⚡ Started In-Memory MongoDB Server');
      console.log('🔗 TO VIEW YOUR DATA IN MONGODB COMPASS, CONNECT TO THIS URI:');
      console.log(`   ${mongoURI}`);
      console.log('=============================================\n');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
  } catch (error: any) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
