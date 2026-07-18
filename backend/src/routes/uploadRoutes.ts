import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  uploadAvatar,
  uploadOutfit,
  uploadCeremony,
  uploadCampus,
  uploadService,
  uploadDepartmentHead,
} from '../middlewares/upload';
import {
  uploadUserAvatar,
  uploadOutfitImage,
  uploadCeremonyBanner,
  uploadCampusImage,
  uploadServiceImage,
  uploadDepartmentHeadPhoto,
} from '../controllers/uploadController';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// POST /api/upload/avatar — any authenticated user updates their own avatar
router.post('/avatar', uploadAvatar, uploadUserAvatar);

// POST /api/upload/outfit/:id — admin uploads outfit image
router.post('/outfit/:id', uploadOutfit, uploadOutfitImage);

// POST /api/upload/ceremony/:id — admin uploads ceremony banner
router.post('/ceremony/:id', uploadCeremony, uploadCeremonyBanner);

// POST /api/upload/campus/:id — superadmin uploads campus image
router.post('/campus/:id', uploadCampus, uploadCampusImage);

// POST /api/upload/service/:id — admin uploads service offering image
router.post('/service/:id', uploadService, uploadServiceImage);

// POST /api/upload/department-head/:id — admin uploads department head photo
router.post('/department-head/:id', uploadDepartmentHead, uploadDepartmentHeadPhoto);

export default router;
