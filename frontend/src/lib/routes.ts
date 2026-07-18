// Centralized route definitions — single source of truth for all navigation paths.
// Protected routes (admin / student / vendor) are scoped by campusId in the URL:
//   /admin/:campusId/dashboard, /student/:campusId/ceremony, etc.
// Pass a numeric campusId to each helper to get the concrete path.

// ── Public / Auth (no campusId) ───────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  campusSelection: "/campus-selection",

  // ── Superadmin (global – no campusId) ─────────────────────────────────────
  superadmin: {
    home: "/superadmin/dashboard",
    dashboard: "/superadmin/dashboard",
    campuses: "/superadmin/campuses",
    campusAdmins: "/superadmin/campus-admins",
    users: "/superadmin/users",
    deptTitles: "/superadmin/dept-titles",
    profile: "/superadmin/profile",
  },
} as const;

// ── Admin routes (campus-scoped) ──────────────────────────────────────────────
export const adminRoutes = (campusId: number | string) => ({
  home: `/admin/${campusId}/home`,
  dashboard: `/admin/${campusId}/dashboard`,
  students: `/admin/${campusId}/students`,
  ceremonies: `/admin/${campusId}/ceremonies`,
  tickets: `/admin/${campusId}/tickets`,
  outfits: `/admin/${campusId}/outfits`,
  seating: `/admin/${campusId}/seating`,
  vendors: `/admin/${campusId}/vendors`,
  chat: `/admin/${campusId}/chat`,
  services: `/admin/${campusId}/services`,
  instructions: `/admin/${campusId}/instructions`,
  notifications: `/admin/${campusId}/notifications`,
  deptHeads: `/admin/${campusId}/dept-heads`,
  qrScan: `/admin/${campusId}/qr-scan`,
  profile: `/admin/${campusId}/profile`,
});

// ── Student routes (campus-scoped) ────────────────────────────────────────────
export const studentRoutes = (campusId: number | string) => ({
  home: `/student/${campusId}/home`,
  dashboard: `/student/${campusId}/dashboard`,
  ceremony: `/student/${campusId}/ceremony`,
  tickets: `/student/${campusId}/tickets`,
  outfit: `/student/${campusId}/outfit`,
  reservations: `/student/${campusId}/reservations`,
  reservationDetail: (id: number | string) => `/student/${campusId}/reservations/${id}`,
  notifications: `/student/${campusId}/notifications`,
  profile: `/student/${campusId}/profile`,
});

// ── Vendor routes (campus-scoped) ─────────────────────────────────────────────
export const vendorRoutes = (campusId: number | string) => ({
  home: `/vendor/${campusId}/home`,
  dashboard: `/vendor/${campusId}/dashboard`,
  requests: `/vendor/${campusId}/requests`,
  requestDetail: `/vendor/${campusId}/request-detail`,
  profile: `/vendor/${campusId}/profile`,
  chat: `/vendor/${campusId}/chat`,
  pending: `/vendor/${campusId}/pending`,
});
