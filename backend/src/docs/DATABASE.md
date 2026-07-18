# Database Documentation

## Graduation Ceremony Management System (GCMS)

---

## Overview

- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Total Tables:** 20
- **Total Enums:** 14

---

## Enums

| Enum                   | Values                                                |
| ---------------------- | ----------------------------------------------------- |
| `UserRole`             | `STUDENT` · `ADMIN` · `VENDOR` · `SUPERADMIN`         |
| `UserStatus`           | `ACTIVE` · `INACTIVE`                                 |
| `EligibilityStatus`    | `PENDING` · `ELIGIBLE` · `NOT_ELIGIBLE`               |
| `CeremonyType`         | `BACHELOR` · `MASTER`                                 |
| `CeremonySemester`     | `FALL` · `SPRING` · `SUMMER`                          |
| `CeremonyStatus`       | `UPCOMING` · `COMPLETED` · `CANCELLED`                |
| `RegistrationStatus`   | `REGISTERED` · `CANCELLED` · `ATTENDED`               |
| `ReservationStatus`    | `PENDING` · `CONFIRMED` · `CANCELLED`                 |
| `TicketStatus`         | `ACTIVE` · `USED` · `CANCELLED`                       |
| `OutfitStatus`         | `AVAILABLE` · `UNAVAILABLE`                           |
| `RentalStatus`         | `PENDING` · `APPROVED` · `REJECTED` · `RETURNED`      |
| `SeatStatus`           | `AVAILABLE` · `RESERVED` · `OCCUPIED`                 |
| `VendorRequestStatus`  | `PENDING` · `IN_PROGRESS` · `COMPLETED` · `CANCELLED` |
| `VendorApprovalStatus` | `PENDING` · `APPROVED` · `REJECTED`                   |
| `ScanStatus`           | `VALID` · `INVALID` · `ALREADY_USED`                  |
| `InstructionTarget`    | `STUDENT` · `PARENT` · `GUEST`                        |
| `EmailStatus`          | `SENT` · `FAILED` · `PENDING`                         |

---

## Tables

---

### `campuses`

Managed by Super Admin. Each admin and ceremony belongs to a campus.

| Column      | Type     | Notes    |
| ----------- | -------- | -------- |
| `id`        | Int      | PK       |
| `name`      | String   | Unique   |
| `location`  | String?  | Optional |
| `createdAt` | DateTime | Auto     |
| `updatedAt` | DateTime | Auto     |

**Relations:** has many `users`, `ceremonies`, `department_heads`, `chat_rooms`

---

### `users`

Single table for all roles: Student, Admin, Vendor, Super Admin. Role-specific fields are nullable.

| Column                            | Type                  | Notes                                 |
| --------------------------------- | --------------------- | ------------------------------------- |
| `id`                              | Int                   | PK                                    |
| `fullName`                        | String                |                                       |
| `email`                           | String                | Unique                                |
| `passwordHash`                    | String                |                                       |
| `phone`                           | String?               |                                       |
| `role`                            | UserRole              | STUDENT · ADMIN · VENDOR · SUPERADMIN |
| `status`                          | UserStatus            | Default: ACTIVE                       |
| `campusId`                        | Int?                  | FK → campuses                         |
| `createdAt`                       | DateTime              | Auto                                  |
| `updatedAt`                       | DateTime              | Auto                                  |
| _(Student)_ `universityId`        | String?               | Unique                                |
| _(Student)_ `faculty`             | String?               |                                       |
| _(Student)_ `department`          | String?               |                                       |
| _(Student)_ `graduationYear`      | Int?                  |                                       |
| _(Student)_ `graduationSemester`  | CeremonySemester?     | FALL · SPRING · SUMMER                |
| _(Student)_ `eligibilityStatus`   | EligibilityStatus?    | Default: null                         |
| _(Vendor)_ `companyName`          | String?               |                                       |
| _(Vendor)_ `serviceType`          | String?               |                                       |
| _(Vendor)_ `vendorApprovalStatus` | VendorApprovalStatus? | PENDING until admin approves          |
| _(Vendor)_ `selectedServiceId`    | Int?                  | FK → ceremony_service_offerings       |

**Indexes:** `role` · `status` · `[role, status]`

---

### `ceremonies`

Each ceremony belongs to a campus and has a type (Bachelor/Master) and semester (Fall/Spring/Summer).

| Column         | Type             | Notes                  |
| -------------- | ---------------- | ---------------------- |
| `id`           | Int              | PK                     |
| `title`        | String           |                        |
| `description`  | String?          |                        |
| `ceremonyDate` | DateTime         |                        |
| `startTime`    | DateTime?        |                        |
| `endTime`      | DateTime?        |                        |
| `venue`        | String           |                        |
| `capacity`     | Int?             |                        |
| `ceremonyType` | CeremonyType     | BACHELOR · MASTER      |
| `semester`     | CeremonySemester | FALL · SPRING · SUMMER |
| `status`       | CeremonyStatus   | Default: UPCOMING      |
| `campusId`     | Int?             | FK → campuses          |
| `createdAt`    | DateTime         | Auto                   |
| `updatedAt`    | DateTime         | Auto                   |

---

### `student_ceremony_registrations`

Tracks which students are registered to which ceremony.

| Column               | Type               | Notes                |
| -------------------- | ------------------ | -------------------- |
| `id`                 | Int                | PK                   |
| `userId`             | Int                | FK → users (student) |
| `ceremonyId`         | Int                | FK → ceremonies      |
| `registrationStatus` | RegistrationStatus | Default: REGISTERED  |
| `registeredAt`       | DateTime           | Auto                 |

**Unique:** `[userId, ceremonyId]`

---

### `ticket_reservations`

A student reserves tickets for guests. Price is set by admin per ceremony.

| Column              | Type              | Notes                            |
| ------------------- | ----------------- | -------------------------------- |
| `id`                | Int               | PK                               |
| `userId`            | Int               | FK → users (student)             |
| `ceremonyId`        | Int               | FK → ceremonies                  |
| `numberOfTickets`   | Int               |                                  |
| `pricePerTicket`    | Decimal(10,2)     | Set by admin                     |
| `totalPrice`        | Decimal(10,2)     | numberOfTickets × pricePerTicket |
| `reservationStatus` | ReservationStatus | Default: PENDING                 |
| `reservedAt`        | DateTime          | Auto                             |

---

### `tickets`

Individual ticket per guest. Each has a unique QR code.

| Column          | Type         | Notes                    |
| --------------- | ------------ | ------------------------ |
| `id`            | Int          | PK                       |
| `reservationId` | Int          | FK → ticket_reservations |
| `ticketCode`    | String       | Unique                   |
| `qrCode`        | String       | QR code data/URL         |
| `guestName`     | String?      |                          |
| `seatNumber`    | String?      |                          |
| `ticketStatus`  | TicketStatus | Default: ACTIVE          |
| `createdAt`     | DateTime     | Auto                     |

---

### `outfits`

Graduation gown inventory managed by admin.

| Column              | Type          | Notes              |
| ------------------- | ------------- | ------------------ |
| `id`                | Int           | PK                 |
| `outfitType`        | String        | e.g. Gown, Cap     |
| `size`              | String        | e.g. S, M, L, XL   |
| `color`             | String?       |                    |
| `quantityAvailable` | Int           | Default: 0         |
| `rentalPrice`       | Decimal(10,2) | Default: 0.00      |
| `status`            | OutfitStatus  | Default: AVAILABLE |
| `createdAt`         | DateTime      | Auto               |
| `updatedAt`         | DateTime      | Auto               |

---

### `outfit_rentals`

Student rents an outfit for a specific ceremony.

| Column         | Type         | Notes                |
| -------------- | ------------ | -------------------- |
| `id`           | Int          | PK                   |
| `userId`       | Int          | FK → users (student) |
| `ceremonyId`   | Int          | FK → ceremonies      |
| `outfitId`     | Int          | FK → outfits         |
| `selectedSize` | String       |                      |
| `rentalStatus` | RentalStatus | Default: PENDING     |
| `pickupDate`   | DateTime?    |                      |
| `returnDate`   | DateTime?    |                      |
| `rentedAt`     | DateTime     | Auto                 |

---

### `seats`

Seat layout for a ceremony. Each seat is unique per ceremony.

| Column        | Type       | Notes              |
| ------------- | ---------- | ------------------ |
| `id`          | Int        | PK                 |
| `ceremonyId`  | Int        | FK → ceremonies    |
| `seatNumber`  | String     |                    |
| `sectionName` | String?    | e.g. Section A     |
| `rowNumber`   | String?    |                    |
| `seatStatus`  | SeatStatus | Default: AVAILABLE |
| `createdAt`   | DateTime   | Auto               |

**Unique:** `[ceremonyId, seatNumber]`

---

### `seat_assignments`

Admin assigns a seat to a student for a ceremony, grouped by graduation semester.

| Column          | Type              | Notes                            |
| --------------- | ----------------- | -------------------------------- |
| `id`            | Int               | PK                               |
| `userId`        | Int               | FK → users (student)             |
| `ceremonyId`    | Int               | FK → ceremonies                  |
| `seatId`        | Int               | FK → seats                       |
| `semesterGroup` | CeremonySemester? | Grouping: FALL · SPRING · SUMMER |
| `assignedAt`    | DateTime          | Auto                             |

**Unique:** `[userId, ceremonyId]` · `[ceremonyId, seatId]`
**Seating order:** grouped by `semesterGroup`, sorted by `user.fullName` alphabetically.

---

### `ceremony_service_offerings`

Admin defines services needed for a ceremony with price, quantity, and quality spec.

| Column        | Type          | Notes                       |
| ------------- | ------------- | --------------------------- |
| `id`          | Int           | PK                          |
| `ceremonyId`  | Int           | FK → ceremonies             |
| `title`       | String        | e.g. Photography, Catering  |
| `description` | String?       |                             |
| `price`       | Decimal(10,2) | Fixed price set by admin    |
| `quantity`    | Int           | How many needed. Default: 1 |
| `quality`     | String?       | e.g. "4K Camera", "5-Star"  |
| `isActive`    | Boolean       | Default: true               |
| `createdAt`   | DateTime      | Auto                        |
| `updatedAt`   | DateTime      | Auto                        |

---

### `vendor_requests`

Admin assigns an approved vendor to fulfill a service offering in a ceremony.

| Column               | Type                | Notes                           |
| -------------------- | ------------------- | ------------------------------- |
| `id`                 | Int                 | PK                              |
| `vendorId`           | Int                 | FK → users (vendor)             |
| `ceremonyId`         | Int                 | FK → ceremonies                 |
| `assignedById`       | Int                 | FK → users (admin)              |
| `serviceOfferingId`  | Int?                | FK → ceremony_service_offerings |
| `requestTitle`       | String              |                                 |
| `requestDescription` | String?             |                                 |
| `requestStatus`      | VendorRequestStatus | Default: PENDING                |
| `createdAt`          | DateTime            | Auto                            |
| `updatedAt`          | DateTime            | Auto                            |

---

### `notifications`

In-app notifications sent to any user.

| Column      | Type     | Notes          |
| ----------- | -------- | -------------- |
| `id`        | Int      | PK             |
| `userId`    | Int      | FK → users     |
| `title`     | String   |                |
| `message`   | String   |                |
| `isRead`    | Boolean  | Default: false |
| `createdAt` | DateTime | Auto           |

---

### `department_titles`

Managed by Super Admin. Reusable titles for department heads.

| Column      | Type     | Notes                              |
| ----------- | -------- | ---------------------------------- |
| `id`        | Int      | PK                                 |
| `title`     | String   | Unique. e.g. "Dean of Engineering" |
| `createdAt` | DateTime | Auto                               |

---

### `department_heads`

Admin adds a department head with a photo and description, linked to a title and campus.

| Column        | Type     | Notes                             |
| ------------- | -------- | --------------------------------- |
| `id`          | Int      | PK                                |
| `titleId`     | Int      | FK → department_titles            |
| `adminId`     | Int      | FK → users (admin who created it) |
| `campusId`    | Int      | FK → campuses                     |
| `name`        | String   | Full name                         |
| `photoUrl`    | String?  | Profile photo URL                 |
| `description` | String?  | Bio or role description           |
| `createdAt`   | DateTime | Auto                              |
| `updatedAt`   | DateTime | Auto                              |

---

### `ceremony_instructions`

Static instructions per ceremony for students, parents, or guests. Ordered by admin.

| Column       | Type              | Notes                     |
| ------------ | ----------------- | ------------------------- |
| `id`         | Int               | PK                        |
| `ceremonyId` | Int               | FK → ceremonies           |
| `target`     | InstructionTarget | STUDENT · PARENT · GUEST  |
| `title`      | String            | e.g. "Dress Code"         |
| `content`    | String            | The instruction text      |
| `order`      | Int               | Display order. Default: 0 |
| `createdAt`  | DateTime          | Auto                      |
| `updatedAt`  | DateTime          | Auto                      |

---

### `qr_scans`

Log of every QR scan attempt at the entrance.

| Column        | Type       | Notes                          |
| ------------- | ---------- | ------------------------------ |
| `id`          | Int        | PK                             |
| `ticketId`    | Int        | FK → tickets                   |
| `scannedById` | Int        | FK → users (admin who scanned) |
| `scanStatus`  | ScanStatus | VALID · INVALID · ALREADY_USED |
| `scanNote`    | String?    | Human-readable result message  |
| `scannedAt`   | DateTime   | Auto                           |

---

### `email_logs`

Tracks every email sent by admin to students or groups.

| Column        | Type        | Notes                        |
| ------------- | ----------- | ---------------------------- |
| `id`          | Int         | PK                           |
| `sentById`    | Int         | FK → users (admin)           |
| `recipientId` | Int?        | FK → users (null for bulk)   |
| `campusId`    | Int?        | Campus scope for bulk emails |
| `toEmail`     | String      | Recipient email address      |
| `subject`     | String      |                              |
| `body`        | String      | Email content                |
| `status`      | EmailStatus | Default: PENDING             |
| `sentAt`      | DateTime    | Auto                         |

---

### `chat_rooms`

One chat room per admin-vendor pair, scoped to a campus.

| Column      | Type     | Notes               |
| ----------- | -------- | ------------------- |
| `id`        | Int      | PK                  |
| `campusId`  | Int      | FK → campuses       |
| `adminId`   | Int      | FK → users (admin)  |
| `vendorId`  | Int      | FK → users (vendor) |
| `createdAt` | DateTime | Auto                |

**Unique:** `[adminId, vendorId]`

---

### `chat_messages`

Individual messages within a chat room.

| Column      | Type     | Notes           |
| ----------- | -------- | --------------- |
| `id`        | Int      | PK              |
| `roomId`    | Int      | FK → chat_rooms |
| `senderId`  | Int      | FK → users      |
| `content`   | String   | Message text    |
| `isRead`    | Boolean  | Default: false  |
| `createdAt` | DateTime | Auto            |

---

## Relationships Summary

```
Campus
  ├── User[]                        (admins, students, vendors)
  ├── Ceremony[]
  ├── DepartmentHead[]
  └── ChatRoom[]

User (STUDENT)
  ├── StudentCeremonyRegistration[]
  ├── TicketReservation[]
  ├── OutfitRental[]
  ├── SeatAssignment[]
  ├── Notification[]
  └── CeremonyServiceOffering?      (selectedService at registration)

User (ADMIN)
  ├── VendorRequest[]               (created requests)
  ├── DepartmentHead[]
  ├── ChatRoom[]
  └── EmailLog[]

User (VENDOR)
  ├── VendorRequest[]               (assigned requests)
  └── ChatRoom[]

Ceremony
  ├── StudentCeremonyRegistration[]
  ├── TicketReservation[] → Ticket[] → QrScan[]
  ├── OutfitRental[]
  ├── Seat[] → SeatAssignment[]
  ├── VendorRequest[]
  ├── CeremonyServiceOffering[]
  └── CeremonyInstruction[]
```

---

## Key Constraints

| Rule                                       | Enforcement                                                          |
| ------------------------------------------ | -------------------------------------------------------------------- |
| One registration per student per ceremony  | `@@unique([userId, ceremonyId])` on `student_ceremony_registrations` |
| One seat per student per ceremony          | `@@unique([userId, ceremonyId])` on `seat_assignments`               |
| One seat assigned once per ceremony        | `@@unique([ceremonyId, seatId])` on `seat_assignments`               |
| One ticket code per ticket                 | `@@unique` on `tickets.ticketCode`                                   |
| One chat room per admin-vendor pair        | `@@unique([adminId, vendorId])` on `chat_rooms`                      |
| Admin scoped to campus                     | `campusId` on `User` — enforced at API layer                         |
| Vendor cannot access system until approved | `vendorApprovalStatus = APPROVED` checked at login                   |
