import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';
import authRoutes from '../routes/authRoutes';
import superadminRoutes from '../routes/superadminRoutes';
import adminRoutes from '../routes/adminRoutes';
import vendorRoutes from '../routes/vendorRoutes';
import studentRoutes from '../routes/studentRoutes';
import publicRoutes from '../routes/publicRoutes';
import uploadRoutes from '../routes/uploadRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/', (req, res) => {
  res.json({ message: 'Graduation Ceremony API is running!' });
});

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/upload', uploadRoutes);

export default app;
