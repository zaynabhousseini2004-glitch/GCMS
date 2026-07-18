import { Router } from "express";
import { authenticate, requireSuperAdmin } from "../middlewares/auth";
import {
  createAdmin,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deactivateAdminUser,
  activateAdminUser,
} from "../controllers/adminController";
import {
  createCampus,
  getCampuses,
  getCampusById,
  updateCampus,
  deleteCampus,
  getCampusAdmins,
  assignAdminToCampus,
  removeAdminFromCampus,
} from "../controllers/campusController";
import {
  getDepartmentTitles,
  createDepartmentTitle,
  updateDepartmentTitle,
  deleteDepartmentTitle,
} from "../controllers/departmentTitleController";

const router = Router();

// All routes require a valid JWT + SUPERADMIN role
router.use(authenticate, requireSuperAdmin);

// ─── User (Admin) Management ──────────────────────────────────────────────────
router.post("/users", createAdmin);
router.get("/users", getAdminUsers);
router.get("/users/:id", getAdminUserById);
router.patch("/users/:id", updateAdminUser);
router.patch("/users/:id/deactivate", deactivateAdminUser);
router.patch("/users/:id/activate", activateAdminUser);

// ─── Campus Management ────────────────────────────────────────────────────────
router.post("/campuses", createCampus);
router.get("/campuses", getCampuses);
router.get("/campuses/:id", getCampusById);
router.patch("/campuses/:id", updateCampus);
router.delete("/campuses/:id", deleteCampus);

// ─── Campus ↔ Admin Assignment ────────────────────────────────────────────────
router.get("/campuses/:id/admins", getCampusAdmins);
router.post("/campuses/:id/admins", assignAdminToCampus);
router.delete("/campuses/:id/admins/:adminId", removeAdminFromCampus);

// ─── Department Titles ────────────────────────────────────────────────────────
router.get("/department-titles", getDepartmentTitles);
router.post("/department-titles", createDepartmentTitle);
router.patch("/department-titles/:id", updateDepartmentTitle);
router.delete("/department-titles/:id", deleteDepartmentTitle);

export default router;
