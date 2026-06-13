import mongoose from 'mongoose';

class Database {
  #instance = null;

  async connect() {
    if (this.#instance) return;
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not set. Add it to server/.env before starting the API.');
    }

    const conn = await mongoose.connect(mongoUri);
    this.#instance = conn;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  }
}

export default new Database();
