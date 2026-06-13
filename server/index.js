import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js';

import authRoutes        from './routes/authRoutes.js';
import productRoutes     from './routes/productRoutes.js';
import serviceRoutes     from './routes/serviceRoutes.js';
import teamRoutes        from './routes/teamRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import inquiryRoutes     from './routes/inquiryRoutes.js';
import uploadRoutes      from './routes/uploadRoutes.js';
import equipmentRoutes   from './routes/equipmentRoutes.js';
import partnerRoutes     from './routes/partnerRoutes.js';
import projectRoutes     from './routes/projectRoutes.js';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => { console.error(err); process.exit(1); });

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173,http://localhost:2000').split(',');

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth',         authRoutes);
app.use('/api/products',     productRoutes);
app.use('/api/services',     serviceRoutes);
app.use('/api/team',         teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries',    inquiryRoutes);
app.use('/api/upload',       uploadRoutes);
app.use('/api/equipment',    equipmentRoutes);
app.use('/api/partners',     partnerRoutes);
app.use('/api/projects',     projectRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
