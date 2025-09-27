import mongoose from 'mongoose';
import { DATABASE_URL } from '../libs/config';

const connectDB = async () => {
  console.log('connecting to database...');

  try {
    mongoose.set('strictQuery', false);
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const conn = await mongoose.connect(DATABASE_URL);
    console.log(`Database connected: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
