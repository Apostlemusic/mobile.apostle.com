import mongoose from "mongoose";
import { config } from 'dotenv';
config();

// Connect without deprecated options (they're ignored by modern drivers)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log('DB connection error', err));