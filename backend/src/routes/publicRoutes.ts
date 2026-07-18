import { Router } from "express";
import {
  getCampuses,
  getCeremonies,
  getCeremonyById,
  getOutfits,
  getDepartmentHeads,
} from "../controllers/publicController";

const router = Router();

// No authentication required — all public

// ─── Campuses ────────────────────────────────────────────────────
router.get("/campuses", getCampuses);

// ─── Ceremonies (per campus) ─────────────────────────────────────
router.get("/campuses/:campusId/ceremonies", getCeremonies);
router.get("/campuses/:campusId/ceremonies/:id", getCeremonyById);

// ─── Outfits (per campus) ────────────────────────────────────────
router.get("/campuses/:campusId/outfits", getOutfits);

// ─── Department Heads (per campus) ───────────────────────────────
router.get("/campuses/:campusId/department-heads", getDepartmentHeads);

export default router;
