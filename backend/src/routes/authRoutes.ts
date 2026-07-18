import { Router } from 'express';
import { register, login, selectCampus, getMe, updateMyProfile, changePassword } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// POST /api/auth/register  — accepts role: STUDENT | VENDOR only
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/select-campus — save campusId after campus selection
router.post('/select-campus', authenticate, selectCampus);

// GET  /api/auth/me            — get own full profile
router.get('/me', authenticate, getMe);

// PATCH /api/auth/profile      — update name / phone
router.patch('/profile', authenticate, updateMyProfile);

// POST /api/auth/change-password
router.post('/change-password', authenticate, changePassword);

export default router;
