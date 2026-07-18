# Graduation Ceremony Management System (GCMS)

## Project Overview & Pages Documentation

---

## Project Summary

A web-based platform that digitalizes the entire graduation ceremony process — ticket reservation, outfit rental, seating, vendor coordination, and QR validation — replacing manual, error-prone workflows with a structured multi-role system.

**Actors:** Student · Admin · Vendor · Super Admin  
**Stack:** Node.js + Express + TypeScript · PostgreSQL · Prisma · React + ShadCN UI

---

## Pages & Dashboards

---

### 🌐 Landing Page (Student-facing, also home after student login)

Public page accessible before login. After login, students remain here and gain access to their portal pages via the navbar.
first page i want to choose what campus he need then the landing page 

| Section | Description |
|---|---|
| Hero | Ceremony title, date, venue, countdown timer, instructions for every cermoney |
| About | Brief ceremony info and university branding |
| Features | Ticket reservation, outfit rental, seating highlights |
| How It Works | Step-by-step guide for students |
| CTA | Login / Register button (hidden after login) |
|Department Heads| department heads for current campus|


**Routes:** `/` (public + authenticated students)

---

### 👨‍🎓 Student Pages (Accessible after login, no separate dashboard)

Students land on the landing page (`/`) after login. All portal pages are accessible via navbar.

| Page | Path | Description |
|---|---|---|
| Ceremony Details | `/student/ceremony` | View ceremony date, venue, schedule |
| Ticket Reservation | `/student/tickets` | Reserve guest tickets, view QR codes |
| Outfit Rental | `/student/outfit` | Browse outfits, select size, submit rental request |
| My Reservations | `/student/reservations` | Track his all reservations and rental statuses |
| Notifications | `/student/notifications` | View system messages and reminders |

---

### 🧑‍💼 Admin Dashboard

Full control panel for ceremony management.

| Page                | Path                   | Description                                                |
| ------------------- | ---------------------- | ---------------------------------------------------------- |
| Dashboard           | `/admin/dashboard`     | Stats: total students, tickets issued, rentals, ceremonies |
| Student Management  | `/admin/students`      | View, verify, and update student eligibility               |
| Ceremony Management | `/admin/ceremonies`    | Create, edit, cancel ceremonies (type: Bachelor / Master · semester: Fall / Spring / Summer) |
| Ticket Management   | `/admin/tickets`       | View all reservations, confirm/cancel tickets, set ticket price per ceremony |
| Outfit Management   | `/admin/outfits`       | Manage outfit inventory, set rental price, approve/reject rentals            |
| Seating Management  | `/admin/seating`       | Assign seats to students per ceremony                      |
| Vendor Management   | `/admin/vendors`       | View vendor applications, approve or reject vendor access, assign approved vendors to ceremonies |
| Service Offerings   | `/admin/ceremonies/:id/services` | Add service titles and prices needed for a specific ceremony |
| Instructions        | `/admin/instructions`  | Add/edit static instructions per ceremony for Students, Parents, or Guests |
| Department Heads    | `/admin/department-heads` | Assign a title (from super admin), add name, photo, and description for each head |
| QR Validation       | `/admin/qr-scan`       | Scan QR codes at venue entrance — returns access status, attendee name, and ceremony date |
| Chat                | `/admin/chat`          | Chat with vendors on the same campus                                       |
| Notifications       | `/admin/notifications` | Send announcements to students                             |

---

### 🏢 Vendor Pages (Accessible after login, no separate dashboard)

Vendors land on the landing page (`/`) after login — **only if their account is approved by admin**. Until approved, they see a "Pending Approval" screen.

| Page | Path | Description |
|---|---|---|
| My Requests | `/vendor/requests` | View requests assigned by admin for ceremonies |
| Update Request | `/vendor/requests/:id` | Update status of a specific request (In Progress / Completed) |
| Chat | `/vendor/chat` | Chat with the admin of the campus |
| Profile | `/vendor/profile` | Company info, service type |
| Notifications | `/vendor/notifications` | View messages from admin |

---

### 🛡️ Super Admin Dashboard

Full system-level control, above Admin.

| Page | Path | Description |
|---|---|---|
| Dashboard | `/superadmin/dashboard` | System-wide stats across all campuses, and Admins users |
| Campus Management | `/superadmin/campuses` | Add, edit, delete campuses |
| Assign Admin to Campus | `/superadmin/campuses/:id/admins` | Assign or remove admin users from a specific campus |
| Department Titles | `/superadmin/department-titles` | Add and manage titles for university department heads (e.g. Dean of Engineering) |
| User Management | `/superadmin/users` | Create, edit, deactivate admins users|

---

## Role Access Summary

| Feature               | Student | Vendor | Admin | Super Admin |
| --------------------- | :-----: | :----: | :---: | :---------: |
| View ceremony         |   ✅    |   ✅   |  ✅   |     ✅      |
| Reserve tickets       |   ✅    |   ❌   |  ❌   |     ❌      |
| Rent outfit           |   ✅    |   ❌   |  ❌   |     ❌      |
| Manage students       |   ❌    |   ❌   |  ✅   |     ✅      |
| Manage ceremonies     |   ❌    |   ❌   |  ✅   |     ✅      |
| Assign seats          |   ❌    |   ❌   |  ✅   |     ✅      |
| View vendor requests  |   ❌    |   ✅   |  ✅   |     ✅      |
| Update vendor request |   ❌    |   ✅   |  ❌   |     ❌      |
| Manage all users      |   ❌    |   ❌   |  ❌   |     ✅      |
| Scan QR               |   ❌    |   ❌   |  ✅   |     ✅      |
| System logs           |   ❌    |   ❌   |  ❌   |     ✅      |

---

## QR Scan Response

When admin scans a QR code at the entrance, the system immediately returns:

| Field | Description |
|---|---|
| `status` | `VALID` · `INVALID` · `ALREADY_USED` |
| `access` | `GRANTED` or `DENIED` |
| `name` | Guest name (from ticket) or student full name |
| `ceremonyTitle` | Name of the ceremony |
| `ceremonyDate` | Date and time of the ceremony |
| `seatNumber` | Assigned seat (if any) |

**Scan outcomes:**

| Case | Status | Access |
|---|---|---|
| Ticket is active and not yet scanned | `VALID` | `GRANTED` ✅ |
| Ticket was already scanned before | `ALREADY_USED` | `DENIED` ❌ |
| Ticket cancelled / not found / wrong QR | `INVALID` | `DENIED` ❌ |

After a successful scan, ticket status changes from `ACTIVE` → `USED`.

---

## Core Modules

| Module             | Key Feature                                                        |
| ------------------ | ------------------------------------------------------------------ |
| Ticket Reservation | QR code generation per reservation                                 |
| Outfit Rental      | Size selection, availability tracking, approval flow               |
| Seating Management | Admin-assigned seats per ceremony                                  |
| QR Validation      | Real-time entrance scan with VALID / INVALID / ALREADY_USED status |
| Vendor Management  | Request assignment and progress tracking                           |
| Notifications      | Role-targeted messages and reminders                               |

---

## One-line Project Description

> A web-based graduation ceremony management platform enabling students to reserve tickets and rent outfits, admins to manage all operations, vendors to fulfill service requests, and super admins to oversee the entire system — with QR-based entry validation at its core.
