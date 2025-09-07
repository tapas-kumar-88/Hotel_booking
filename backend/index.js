import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/connectDB.js';

import userRouter from './routes/user.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import roomRouter from './routes/room.routes.js';
import bookingRouter from './routes/booking.routes.js';
import dotenv from 'dotenv';
dotenv.config();
import path from "path";

const app = express();
const __dirname = path.resolve();

connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('E-commerce Backend is running');
});

// Routes
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/room', roomRouter);
app.use('/api/bookings', bookingRouter);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  
  app.get("*rest", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
