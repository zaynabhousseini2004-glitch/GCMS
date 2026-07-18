import { Request, Response, NextFunction } from 'express';
import { unlinkSync } from 'fs';
import path from 'path';
import { prisma } from '../libs/prisma';

// Helper to build the public URL for an uploaded file
function buildFileUrl(req: Request, category: string, filename: string): string {
  const protocol = req.protocol;
  const host = req.get('host') ?? 'localhost:3001';
  return `${protocol}://${host}/uploads/${category}/${filename}`;
}

// Helper to delete old file safely
function deleteOldFile(oldUrl: string | null): void {
  if (!oldUrl) return;
  try {
    const relativePath = oldUrl.split('/uploads/')[1];
    if (!relativePath) return;
    const fullPath = path.join(__dirname, '../../uploads', relativePath);
    unlinkSync(fullPath);
  } catch {
    // File may not exist, ignore
  }
}

// POST /api/upload/avatar
// Authenticated — any role — updates their own avatarUrl
export async function uploadUserAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatarUrl: true } });
    deleteOldFile(user?.avatarUrl ?? null);

    const url = buildFileUrl(req, 'avatars', req.file.filename);
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
      select: { id: true, fullName: true, avatarUrl: true },
    });

    res.json({ message: 'Avatar uploaded successfully', user: updated });
  } catch (err) {
    next(err);
  }
}

// POST /api/upload/outfit/:id
// Admin only — sets imageUrl on an outfit
export async function uploadOutfitImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const outfitId = Number(req.params.id);
    if (isNaN(outfitId)) {
      res.status(400).json({ message: 'Invalid outfit id' });
      return;
    }

    const outfit = await prisma.outfit.findUnique({ where: { id: outfitId }, select: { imageUrl: true } });
    if (!outfit) {
      res.status(404).json({ message: 'Outfit not found' });
      return;
    }

    deleteOldFile(outfit.imageUrl ?? null);

    const url = buildFileUrl(req, 'outfits', req.file.filename);
    const updated = await prisma.outfit.update({
      where: { id: outfitId },
      data: { imageUrl: url },
      select: { id: true, outfitType: true, imageUrl: true },
    });

    res.json({ message: 'Outfit image uploaded successfully', outfit: updated });
  } catch (err) {
    next(err);
  }
}

// POST /api/upload/ceremony/:id
// Admin only — sets bannerUrl on a ceremony
export async function uploadCeremonyBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const ceremonyId = Number(req.params.id);
    if (isNaN(ceremonyId)) {
      res.status(400).json({ message: 'Invalid ceremony id' });
      return;
    }

    const ceremony = await prisma.ceremony.findUnique({ where: { id: ceremonyId }, select: { bannerUrl: true } });
    if (!ceremony) {
      res.status(404).json({ message: 'Ceremony not found' });
      return;
    }

    deleteOldFile(ceremony.bannerUrl ?? null);

    const url = buildFileUrl(req, 'ceremonies', req.file.filename);
    const updated = await prisma.ceremony.update({
      where: { id: ceremonyId },
      data: { bannerUrl: url },
      select: { id: true, title: true, bannerUrl: true },
    });

    res.json({ message: 'Ceremony banner uploaded successfully', ceremony: updated });
  } catch (err) {
    next(err);
  }
}

// POST /api/upload/campus/:id
// Superadmin only — sets imageUrl on a campus
export async function uploadCampusImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const campusId = Number(req.params.id);
    if (isNaN(campusId)) {
      res.status(400).json({ message: 'Invalid campus id' });
      return;
    }

    const campus = await prisma.campus.findUnique({ where: { id: campusId }, select: { imageUrl: true } });
    if (!campus) {
      res.status(404).json({ message: 'Campus not found' });
      return;
    }

    deleteOldFile(campus.imageUrl ?? null);

    const url = buildFileUrl(req, 'campuses', req.file.filename);
    const updated = await prisma.campus.update({
      where: { id: campusId },
      data: { imageUrl: url },
      select: { id: true, name: true, imageUrl: true },
    });

    res.json({ message: 'Campus image uploaded successfully', campus: updated });
  } catch (err) {
    next(err);
  }
}

// POST /api/upload/service/:id
// Admin only — sets imageUrl on a ceremony service offering
export async function uploadServiceImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const serviceId = Number(req.params.id);
    if (isNaN(serviceId)) {
      res.status(400).json({ message: 'Invalid service id' });
      return;
    }

    const service = await prisma.ceremonyServiceOffering.findUnique({
      where: { id: serviceId },
      select: { imageUrl: true },
    });
    if (!service) {
      res.status(404).json({ message: 'Service offering not found' });
      return;
    }

    deleteOldFile(service.imageUrl ?? null);

    const url = buildFileUrl(req, 'services', req.file.filename);
    const updated = await prisma.ceremonyServiceOffering.update({
      where: { id: serviceId },
      data: { imageUrl: url },
      select: { id: true, title: true, imageUrl: true },
    });

    res.json({ message: 'Service image uploaded successfully', service: updated });
  } catch (err) {
    next(err);
  }
}

// POST /api/upload/department-head/:id
// Admin only — sets photoUrl on a department head
export async function uploadDepartmentHeadPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const headId = Number(req.params.id);
    if (isNaN(headId)) {
      res.status(400).json({ message: 'Invalid department head id' });
      return;
    }

    const head = await prisma.departmentHead.findUnique({ where: { id: headId }, select: { photoUrl: true } });
    if (!head) {
      res.status(404).json({ message: 'Department head not found' });
      return;
    }

    deleteOldFile(head.photoUrl ?? null);

    const url = buildFileUrl(req, 'department-heads', req.file.filename);
    const updated = await prisma.departmentHead.update({
      where: { id: headId },
      data: { photoUrl: url },
      select: { id: true, name: true, photoUrl: true },
    });

    res.json({ message: 'Department head photo uploaded successfully', departmentHead: updated });
  } catch (err) {
    next(err);
  }
}
