import express from 'express'; // Trigger restart
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import config from './config/env';
import connectDB from './config/database';
import errorHandler from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import complaintRoutes from './routes/complaints';
import analyticsRoutes from './routes/analytics';
import spendingRoutes from './routes/spending';
import notificationRoutes from './routes/notifications';

const app = express();

// Connect to MongoDB
connectDB().then(async () => {
  // Auto-seed data for in-memory database
  try {
    const User = (await import('./models/User')).default;
    const { default: bcrypt } = await import('bcryptjs');
    const Complaint = (await import('./models/Complaint')).default;
    
    if (await User.countDocuments() === 0) {
      console.log('🌱 Seeding initial data into database...');
      const password = 'password123';
      const citizenUser = await User.create({ name: 'Priya Patel', email: 'priya@example.com', password, role: 'citizen', notificationPrefs: { email: true, push: true, inApp: true } });
      await User.create({ name: 'Commissioner Sharma', email: 'admin@roadwatch.com', password, role: 'authority', notificationPrefs: { email: true, push: true, inApp: true } });
      
      await Complaint.create({
        citizen: citizenUser._id,
        title: 'Massive Pothole on Sector 62 Road',
        description: 'There is a huge pothole causing traffic jams.',
        images: [{ url: 'https://picsum.photos/seed/noida/400/300', publicId: 'mock1' }],
        category: 'pothole',
        severity: 'high',
        status: 'submitted',
        location: { type: 'Point', coordinates: [77.3639, 28.6276], address: 'Sector 62, Noida' },
        priority: 4,
        validationScore: 98,
        statusHistory: [{ status: 'submitted', updatedBy: citizenUser._id, note: 'Initial submission' }]
      });
      console.log('✅ Seeding complete.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  }
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'RoadWatch API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/spending', spendingRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║         🛣️  RoadWatch API Server                ║
║══════════════════════════════════════════════════║
║  Environment : ${config.nodeEnv.padEnd(33)}║
║  Port        : ${String(PORT).padEnd(33)}║
║  Frontend    : ${config.frontendUrl.padEnd(33)}║
║  API URL     : http://localhost:${PORT}/api${' '.repeat(14)}║
╚══════════════════════════════════════════════════╝
  `);
});

export default app;
