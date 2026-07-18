import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

type UploadCategory =
  | 'avatars'
  | 'outfits'
  | 'ceremonies'
  | 'department-heads'
  | 'campuses'
  | 'services';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function createStorage(category: UploadCategory) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads', category);
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
}

function createUploader(category: UploadCategory) {
  return multer({
    storage: createStorage(category),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }).single('image');
}

export const uploadAvatar = createUploader('avatars');
export const uploadOutfit = createUploader('outfits');
export const uploadCeremony = createUploader('ceremonies');
export const uploadDepartmentHead = createUploader('department-heads');
export const uploadCampus = createUploader('campuses');
export const uploadService = createUploader('services');
