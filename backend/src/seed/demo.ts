import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {
  DEMO_PASSWORD,
  CAMPUSES,
  DEPARTMENT_TITLES,
  FACULTIES,
  AVIATION_FACULTY,
  CEREMONY_VENUES,
  CEREMONY_BANNERS,
  OUTFIT_IMAGES,
  VENDOR_COMPANIES,
  SERVICE_OFFERINGS_TEMPLATE,
  FIRST_NAMES_MALE,
  FIRST_NAMES_FEMALE,
  LAST_NAMES,
  NOTIFICATION_TEMPLATES,
} from "./demoData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Small helpers ──────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function atTime(date: Date, hours: number, minutes: number): Date {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function daysFrom(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

let avatarCursor = 0;
function nextAvatar(): string {
  avatarCursor += 1;
  const img = ((avatarCursor - 1) % 70) + 1;
  return `https://i.pravatar.cc/300?img=${img}`;
}

// Shared pool of unique {firstName, lastName} pairs — shared across every
// role so no two seeded people (student, admin, vendor, dept head) collide.
type NamePair = { firstName: string; lastName: string; gender: "M" | "F" };
function buildNamePool(): NamePair[] {
  const pool: NamePair[] = [];
  for (const f of FIRST_NAMES_MALE) {
    for (const l of LAST_NAMES) pool.push({ firstName: f, lastName: l, gender: "M" });
  }
  for (const f of FIRST_NAMES_FEMALE) {
    for (const l of LAST_NAMES) pool.push({ firstName: f, lastName: l, gender: "F" });
  }
  return shuffle(pool);
}
const namePool = buildNamePool();
let nameCursor = 0;
function nextName(): NamePair {
  const n = namePool[nameCursor % namePool.length];
  nameCursor += 1;
  return n;
}

let ticketCodeSet = new Set<string>();
function nextTicketCode(): string {
  let code = "";
  do {
    code = `TKT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  } while (ticketCodeSet.has(code));
  ticketCodeSet.add(code);
  return code;
}
function qrForTicket(ticketCode: string): string {
  return `GCMS:${ticketCode}`;
}

let universityIdCounter = 1;
function nextUniversityId(): string {
  const admissionYear = randomInt(20, 23);
  const seq = String(universityIdCounter).padStart(5, "0");
  universityIdCounter += 1;
  return `LIU${admissionYear}${seq}`;
}

function seatGrid(targetCapacity: number) {
  const sections = ["A", "B", "C", "D"];
  const rows = 10;
  const seatsPerRow = Math.max(4, Math.ceil(targetCapacity / (sections.length * rows)));
  const seats: { seatNumber: string; sectionName: string; rowNumber: string }[] = [];
  for (const section of sections) {
    for (let row = 1; row <= rows; row++) {
      for (let seatIdx = 1; seatIdx <= seatsPerRow; seatIdx++) {
        seats.push({
          seatNumber: `${section}${row}-${String(seatIdx).padStart(2, "0")}`,
          sectionName: section,
          rowNumber: String(row),
        });
      }
    }
  }
  return seats;
}

const SERVICE_CATEGORY_MATCH: Record<string, string> = {
  "Photography & Videography": "Graduation Photography Package",
  Catering: "Guest Catering & Refreshments",
  "Floral & Stage Decor": "Stage Floral & Backdrop Decor",
  "Audio-Visual & Lighting": "Sound, Lighting & Live Streaming",
  "Printing & Stationery": "Printed Programs & Signage",
};

// ─── Wipe ───────────────────────────────────────────────────────────────────

async function wipeDatabase() {
  console.log("🧹 Wiping existing data...");
  await prisma.qrScan.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.vendorRequest.deleteMany();
  await prisma.ceremonyServiceOffering.deleteMany();
  await prisma.seatAssignment.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.outfitRental.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ticketReservation.deleteMany();
  await prisma.studentCeremonyRegistration.deleteMany();
  await prisma.ceremonyInstruction.deleteMany();
  await prisma.departmentHead.deleteMany();
  await prisma.ceremony.deleteMany();
  await prisma.outfit.deleteMany();
  await prisma.departmentTitle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.campus.deleteMany();
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  await wipeDatabase();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // Superadmin
  const superEmail = process.env.SUPERADMIN_EMAIL || "superadmin@liu.edu.lb";
  const superPassword = process.env.SUPERADMIN_PASSWORD || DEMO_PASSWORD;
  const superName = process.env.SUPERADMIN_NAME || "GCMS System Administrator";
  const superHash =
    superPassword === DEMO_PASSWORD ? passwordHash : await bcrypt.hash(superPassword, 12);
  await prisma.user.create({
    data: {
      fullName: superName,
      email: superEmail,
      passwordHash: superHash,
      role: "SUPERADMIN",
      status: "ACTIVE",
      avatarUrl: nextAvatar(),
    },
  });
  console.log(`✅ Superadmin: ${superEmail}`);

  // Campuses
  const campuses = [];
  for (const c of CAMPUSES) {
    const campus = await prisma.campus.create({
      data: { name: c.name, location: c.location, imageUrl: c.imageUrl },
    });
    campuses.push(campus);
  }
  console.log(`✅ Campuses: ${campuses.length}`);

  // Department titles (global catalog)
  const deptTitles = [];
  for (const title of DEPARTMENT_TITLES) {
    deptTitles.push(await prisma.departmentTitle.create({ data: { title } }));
  }
  const deanTitle = deptTitles.find((t) => t.title === "Dean")!;
  const coordinatorTitle = deptTitles.find((t) => t.title === "Program Coordinator")!;

  const today = new Date("2026-07-21T00:00:00");
  let studentCount = 0;
  let vendorPoolCursor = 0;

  for (let ci = 0; ci < campuses.length; ci++) {
    const campus = campuses[ci];
    const isRayak = campus.name === "Rayak Campus";
    const isAkkar = campus.name === "Akkar Campus";

    // ── Admins ────────────────────────────────────────────────────────────
    const admins = [];
    for (let i = 0; i < 2; i++) {
      const n = nextName();
      const admin = await prisma.user.create({
        data: {
          fullName: `${n.firstName} ${n.lastName}`,
          email: `${slugify(n.firstName)}.${slugify(n.lastName)}@liu.edu.lb`,
          passwordHash,
          phone: `+9613${randomInt(100000, 999999)}`,
          role: "ADMIN",
          status: "ACTIVE",
          avatarUrl: nextAvatar(),
          campusId: campus.id,
        },
      });
      admins.push(admin);
    }
    const manager = admins[0];

    // ── Vendors ───────────────────────────────────────────────────────────
    const vendors = [];
    for (let i = 0; i < 2; i++) {
      const vc = VENDOR_COMPANIES[vendorPoolCursor % VENDOR_COMPANIES.length];
      vendorPoolCursor += 1;
      const n = nextName();
      const approvalStatus = i === 0 ? "APPROVED" : randomChoice(["APPROVED", "APPROVED", "PENDING", "REJECTED"]);
      const vendor = await prisma.user.create({
        data: {
          fullName: `${n.firstName} ${n.lastName}`,
          email: `${slugify(n.firstName)}.${slugify(n.lastName)}@${slugify(vc.companyName)}.com`,
          passwordHash,
          phone: `+9613${randomInt(100000, 999999)}`,
          role: "VENDOR",
          status: "ACTIVE",
          avatarUrl: nextAvatar(),
          companyName: vc.companyName,
          serviceType: vc.serviceType,
          vendorApprovalStatus: approvalStatus as "APPROVED" | "PENDING" | "REJECTED",
          campusId: campus.id,
        },
      });
      vendors.push(vendor);
    }
    const approvedVendors = vendors.filter((v) => v.vendorApprovalStatus === "APPROVED");

    // ── Department heads ─────────────────────────────────────────────────
    const facultyPool = isRayak ? [AVIATION_FACULTY, ...FACULTIES.slice(0, 2)] : FACULTIES;
    const deanName = nextName();
    const coordName = nextName();
    await prisma.departmentHead.create({
      data: {
        titleId: deanTitle.id,
        adminId: manager.id,
        campusId: campus.id,
        name: `Dr. ${deanName.firstName} ${deanName.lastName}`,
        photoUrl: nextAvatar(),
        description: `Dean overseeing ${facultyPool[0].faculty} at LIU ${campus.name.replace(" Campus", "")}.`,
      },
    });
    await prisma.departmentHead.create({
      data: {
        titleId: coordinatorTitle.id,
        adminId: manager.id,
        campusId: campus.id,
        name: `${coordName.firstName} ${coordName.lastName}`,
        photoUrl: nextAvatar(),
        description: `Coordinates graduation logistics and student affairs for the ${campus.name.replace(" Campus", "")} campus.`,
      },
    });

    // ── Ceremonies ────────────────────────────────────────────────────────
    const upcomingDate = daysFrom(today, 110 + ci * 4);
    const upcomingCapacitySeats = seatGrid(180 + ci * 25);
    const upcomingCeremony = await prisma.ceremony.create({
      data: {
        title: `LIU ${campus.name.replace(" Campus", "")} Bachelor's Graduation Ceremony — Fall 2026`,
        description: `Celebrating the graduating Bachelor's class of LIU ${campus.name.replace(" Campus", "")} for the Fall 2026 semester.`,
        ceremonyDate: upcomingDate,
        startTime: atTime(upcomingDate, 17, 0),
        endTime: atTime(upcomingDate, 20, 0),
        venue: CEREMONY_VENUES[campus.name],
        capacity: upcomingCapacitySeats.length,
        ceremonyType: "BACHELOR",
        semester: "FALL",
        status: "UPCOMING",
        ticketPrice: randomInt(15, 35),
        bannerUrl: randomChoice(CEREMONY_BANNERS),
        campusId: campus.id,
      },
    });

    const completedDate = daysFrom(today, -(70 + ci * 3));
    const completedSeatsGrid = seatGrid(140 + ci * 15);
    const completedCeremony = await prisma.ceremony.create({
      data: {
        title: `LIU ${campus.name.replace(" Campus", "")} Master's Graduation Ceremony — Spring 2026`,
        description: `LIU ${campus.name.replace(" Campus", "")} honored its graduating Master's class for the Spring 2026 semester.`,
        ceremonyDate: completedDate,
        startTime: atTime(completedDate, 17, 0),
        endTime: atTime(completedDate, 19, 30),
        venue: CEREMONY_VENUES[campus.name],
        capacity: completedSeatsGrid.length,
        ceremonyType: "MASTER",
        semester: "SPRING",
        status: "COMPLETED",
        ticketPrice: randomInt(15, 30),
        bannerUrl: randomChoice(CEREMONY_BANNERS),
        campusId: campus.id,
      },
    });

    if (isAkkar) {
      const cancelledDate = daysFrom(today, -260);
      await prisma.ceremony.create({
        data: {
          title: "LIU Akkar Bachelor's Graduation Ceremony — Fall 2025",
          description:
            "This ceremony was cancelled due to venue renovation works at the Akkar Central Auditorium. Affected students were transferred to the Spring 2026 ceremony.",
          ceremonyDate: cancelledDate,
          venue: CEREMONY_VENUES[campus.name],
          capacity: 200,
          ceremonyType: "BACHELOR",
          semester: "FALL",
          status: "CANCELLED",
          campusId: campus.id,
        },
      });
    }

    // ── Instructions ──────────────────────────────────────────────────────
    const instructionSets: [number, "STUDENT" | "PARENT" | "GUEST", string, string][] = [
      [
        upcomingCeremony.id,
        "STUDENT",
        "Arrival & Check-In",
        "Arrive at least 90 minutes before the ceremony in your rented gown and cap. Check in at the registration desk with your university ID to receive your seating assignment.",
      ],
      [
        upcomingCeremony.id,
        "PARENT",
        "Guest Seating",
        "Parents and family members should arrive at least 60 minutes early. Present your printed or digital ticket QR code at the main entrance for scanning.",
      ],
      [
        upcomingCeremony.id,
        "GUEST",
        "Venue Access & Parking",
        `Parking is available on-site at the ${CEREMONY_VENUES[campus.name]} lot. Doors open one hour before the ceremony start time.`,
      ],
      [
        completedCeremony.id,
        "STUDENT",
        "Arrival & Check-In",
        "Graduates checked in at the registration desk 90 minutes before the ceremony to collect their seating assignment and confirm attendance.",
      ],
      [
        completedCeremony.id,
        "GUEST",
        "Venue Access & Parking",
        `Guests entered through the main gate of ${CEREMONY_VENUES[campus.name]} with their scanned QR tickets.`,
      ],
    ];
    for (let idx = 0; idx < instructionSets.length; idx++) {
      const [ceremonyId, target, title, content] = instructionSets[idx];
      await prisma.ceremonyInstruction.create({
        data: { ceremonyId, target, title, content, order: idx },
      });
    }

    // ── Service offerings (upcoming ceremony only) ──────────────────────
    const serviceOfferings = [];
    for (const tmpl of SERVICE_OFFERINGS_TEMPLATE) {
      const price = randomInt(tmpl.priceRange[0], tmpl.priceRange[1]);
      const offering = await prisma.ceremonyServiceOffering.create({
        data: {
          ceremonyId: upcomingCeremony.id,
          title: tmpl.title,
          description: tmpl.description,
          price,
          quantity: 1,
          quality: randomChoice(["Standard", "Premium", "Deluxe"]),
          imageUrl: randomChoice(CEREMONY_BANNERS),
          isActive: true,
        },
      });
      serviceOfferings.push(offering);
    }

    // ── Outfits ───────────────────────────────────────────────────────────
    const outfitDefs: {
      outfitType: "GOWN" | "CAP" | "HOOD";
      ceremonyType: "BACHELOR" | "MASTER";
      color: string;
      size: string;
      price: number;
    }[] = [
      { outfitType: "GOWN", ceremonyType: "BACHELOR", color: "Navy Blue", size: "M", price: randomInt(20, 35) },
      { outfitType: "CAP", ceremonyType: "BACHELOR", color: "Navy Blue", size: "One Size", price: randomInt(8, 15) },
      { outfitType: "GOWN", ceremonyType: "MASTER", color: "Burgundy", size: "L", price: randomInt(25, 40) },
      { outfitType: "HOOD", ceremonyType: "MASTER", color: "Burgundy & Gold", size: "One Size", price: randomInt(10, 18) },
    ];
    const outfits = [];
    for (const def of outfitDefs) {
      const outfit = await prisma.outfit.create({
        data: {
          campusId: campus.id,
          outfitType: def.outfitType,
          size: def.size,
          color: def.color,
          ceremonyType: def.ceremonyType,
          quantityAvailable: randomInt(40, 120),
          rentalPrice: def.price,
          status: "AVAILABLE",
          imageUrl: OUTFIT_IMAGES[def.outfitType],
        },
      });
      outfits.push(outfit);
    }
    const bachelorGown = outfits.find((o) => o.outfitType === "GOWN" && o.ceremonyType === "BACHELOR")!;
    const bachelorCap = outfits.find((o) => o.outfitType === "CAP")!;
    const masterGown = outfits.find((o) => o.outfitType === "GOWN" && o.ceremonyType === "MASTER")!;
    const masterHood = outfits.find((o) => o.outfitType === "HOOD")!;

    // ── Students: upcoming (bachelor) track ─────────────────────────────
    const upcomingStudents = [];
    for (let i = 0; i < 9; i++) {
      const n = nextName();
      const useAviation = isRayak && i < 3;
      const facultySeed = useAviation ? AVIATION_FACULTY : randomChoice(facultyPool);
      const eligibility = randomChoice(["ELIGIBLE", "ELIGIBLE", "ELIGIBLE", "PENDING", "NOT_ELIGIBLE"]);
      const student = await prisma.user.create({
        data: {
          fullName: `${n.firstName} ${n.lastName}`,
          email: `${slugify(n.firstName)}.${slugify(n.lastName)}@std.liu.edu.lb`,
          passwordHash,
          phone: `+9617${randomInt(100000, 999999)}`,
          role: "STUDENT",
          status: randomInt(1, 40) === 1 ? "INACTIVE" : "ACTIVE",
          avatarUrl: nextAvatar(),
          universityId: nextUniversityId(),
          faculty: facultySeed.faculty,
          department: randomChoice(facultySeed.departments),
          graduationYear: 2026,
          graduationSemester: "FALL",
          eligibilityStatus: eligibility as "ELIGIBLE" | "PENDING" | "NOT_ELIGIBLE",
          campusId: campus.id,
        },
      });
      upcomingStudents.push(student);
      studentCount += 1;
    }

    // ── Students: graduated (master, completed ceremony) track ─────────
    const graduatedStudents = [];
    for (let i = 0; i < 3; i++) {
      const n = nextName();
      const facultySeed = randomChoice(facultyPool);
      const student = await prisma.user.create({
        data: {
          fullName: `${n.firstName} ${n.lastName}`,
          email: `${slugify(n.firstName)}.${slugify(n.lastName)}@std.liu.edu.lb`,
          passwordHash,
          phone: `+9617${randomInt(100000, 999999)}`,
          role: "STUDENT",
          status: "ACTIVE",
          avatarUrl: nextAvatar(),
          universityId: nextUniversityId(),
          faculty: facultySeed.faculty,
          department: `Master of Science in ${randomChoice(facultySeed.departments)}`,
          graduationYear: 2026,
          graduationSemester: "SPRING",
          eligibilityStatus: "ELIGIBLE",
          campusId: campus.id,
        },
      });
      graduatedStudents.push(student);
      studentCount += 1;
    }

    // ── Registrations, tickets, seats, rentals: upcoming students ──────
    const upcomingSeatPool = shuffle(upcomingCapacitySeats);
    const createdUpcomingSeats = [];
    for (const s of upcomingSeatPool) {
      createdUpcomingSeats.push(s);
    }
    await prisma.seat.createMany({
      data: createdUpcomingSeats.map((s) => ({ ...s, ceremonyId: upcomingCeremony.id })),
    });
    const upcomingSeatRows = await prisma.seat.findMany({ where: { ceremonyId: upcomingCeremony.id } });
    let upcomingSeatCursor = 0;

    for (const student of upcomingStudents) {
      const eligible = student.eligibilityStatus === "ELIGIBLE";
      const notif = [];

      notif.push(NOTIFICATION_TEMPLATES.welcome(student.fullName.split(" ")[0]));
      if (eligible) notif.push(NOTIFICATION_TEMPLATES.eligible());
      else if (student.eligibilityStatus === "PENDING") notif.push(NOTIFICATION_TEMPLATES.pending());
      else notif.push(NOTIFICATION_TEMPLATES.notEligible());

      if (eligible) {
        await prisma.studentCeremonyRegistration.create({
          data: {
            userId: student.id,
            ceremonyId: upcomingCeremony.id,
            registrationStatus: "REGISTERED",
          },
        });
        notif.push(NOTIFICATION_TEMPLATES.registration(upcomingCeremony.title));

        await prisma.emailLog.create({
          data: {
            sentById: manager.id,
            recipientId: student.id,
            campusId: campus.id,
            toEmail: student.email,
            subject: "LIU Graduation Eligibility Confirmed",
            body: `Dear ${student.fullName},\n\nWe are pleased to confirm your graduation eligibility for ${upcomingCeremony.title}. Please log in to GCMS to reserve guest tickets and rent your graduation outfit.\n\nLIU Office of the Registrar`,
            status: "SENT",
          },
        });

        // Ticket reservation (~70% of eligible students)
        if (randomInt(1, 10) <= 7) {
          const numberOfTickets = randomInt(1, 4);
          const status = randomInt(1, 10) <= 7 ? "CONFIRMED" : "PENDING";
          const pricePerTicket = Number(upcomingCeremony.ticketPrice);
          const guestTickets = Array.from({ length: numberOfTickets }, () => {
            const g = nextName();
            const ticketCode = nextTicketCode();
            return {
              ticketCode,
              qrCode: qrForTicket(ticketCode),
              guestName: `${g.firstName} ${student.fullName.split(" ").slice(1).join(" ") || g.lastName}`,
            };
          });
          const reservation = await prisma.ticketReservation.create({
            data: {
              userId: student.id,
              ceremonyId: upcomingCeremony.id,
              numberOfTickets,
              pricePerTicket,
              totalPrice: pricePerTicket * numberOfTickets,
              reservationStatus: status as "CONFIRMED" | "PENDING",
              tickets: { create: guestTickets },
            },
            include: { tickets: true },
          });

          if (status === "CONFIRMED") {
            notif.push(NOTIFICATION_TEMPLATES.ticketConfirmed(numberOfTickets, upcomingCeremony.title));
            await prisma.emailLog.create({
              data: {
                sentById: manager.id,
                recipientId: student.id,
                campusId: campus.id,
                toEmail: student.email,
                subject: "Guest Ticket Reservation Confirmed",
                body: `Dear ${student.fullName},\n\nYour reservation for ${numberOfTickets} guest ticket(s) to ${upcomingCeremony.title} has been confirmed. QR codes are available in your GCMS account under My Tickets.\n\nLIU Graduation Office`,
                status: "SENT",
              },
            });

            // Assign seats to roughly 70% of confirmed reservers
            if (randomInt(1, 10) <= 7) {
              const seatsToAssign = Math.min(numberOfTickets, 2, upcomingSeatRows.length - upcomingSeatCursor);
              for (let s = 0; s < seatsToAssign; s++) {
                const seat = upcomingSeatRows[upcomingSeatCursor];
                upcomingSeatCursor += 1;
                const ticket = reservation.tickets[s];
                await prisma.seatAssignment.create({
                  data: {
                    userId: student.id,
                    ceremonyId: upcomingCeremony.id,
                    seatId: seat.id,
                    guestName: s === 0 ? null : ticket.guestName,
                    semesterGroup: "FALL",
                  },
                });
                await prisma.seat.update({ where: { id: seat.id }, data: { seatStatus: "RESERVED" } });
                await prisma.ticket.update({ where: { id: ticket.id }, data: { seatNumber: seat.seatNumber } });
              }
              if (seatsToAssign > 0) {
                notif.push(NOTIFICATION_TEMPLATES.seatAssigned(upcomingSeatRows[upcomingSeatCursor - 1].seatNumber, upcomingSeatRows[upcomingSeatCursor - 1].sectionName!));
              }
            }
          } else {
            notif.push(NOTIFICATION_TEMPLATES.ticketPending(upcomingCeremony.title));
          }
        }

        // Outfit rental (~60% of eligible students)
        if (randomInt(1, 10) <= 6) {
          const rentalStatus = randomChoice(["PENDING", "APPROVED", "APPROVED"]) as "PENDING" | "APPROVED";
          await prisma.outfitRental.create({
            data: {
              userId: student.id,
              ceremonyId: upcomingCeremony.id,
              outfitId: bachelorGown.id,
              selectedSize: randomChoice(["S", "M", "L", "XL"]),
              rentalStatus,
              pickupDate: rentalStatus === "APPROVED" ? daysFrom(upcomingDate, -3) : null,
            },
          });
          await prisma.outfitRental.create({
            data: {
              userId: student.id,
              ceremonyId: upcomingCeremony.id,
              outfitId: bachelorCap.id,
              selectedSize: "One Size",
              rentalStatus,
              pickupDate: rentalStatus === "APPROVED" ? daysFrom(upcomingDate, -3) : null,
            },
          });
          if (rentalStatus === "APPROVED") notif.push(NOTIFICATION_TEMPLATES.outfitApproved("Gown & Cap"));
        }

        notif.push(NOTIFICATION_TEMPLATES.reminder(upcomingCeremony.title, upcomingCeremony.venue));
      }

      await prisma.notification.createMany({
        data: notif.map((n, idx) => ({
          userId: student.id,
          title: n.title,
          message: n.message,
          isRead: idx < notif.length - 1 ? Math.random() > 0.3 : Math.random() > 0.7,
        })),
      });
    }

    // ── Completed ceremony: graduated students (fully finalized records) ─
    const completedSeatPool = shuffle(completedSeatsGrid);
    await prisma.seat.createMany({
      data: completedSeatPool.map((s) => ({ ...s, ceremonyId: completedCeremony.id, seatStatus: "AVAILABLE" as const })),
    });
    const completedSeatRows = await prisma.seat.findMany({ where: { ceremonyId: completedCeremony.id } });
    let completedSeatCursor = 0;

    for (const student of graduatedStudents) {
      await prisma.studentCeremonyRegistration.create({
        data: { userId: student.id, ceremonyId: completedCeremony.id, registrationStatus: "ATTENDED" },
      });

      const numberOfTickets = randomInt(2, 3);
      const pricePerTicket = Number(completedCeremony.ticketPrice);
      const guestTickets = Array.from({ length: numberOfTickets }, () => {
        const g = nextName();
        const ticketCode = nextTicketCode();
        return {
          ticketCode,
          qrCode: qrForTicket(ticketCode),
          guestName: `${g.firstName} ${student.fullName.split(" ").slice(1).join(" ")}`,
          ticketStatus: "USED" as const,
        };
      });
      const reservation = await prisma.ticketReservation.create({
        data: {
          userId: student.id,
          ceremonyId: completedCeremony.id,
          numberOfTickets,
          pricePerTicket,
          totalPrice: pricePerTicket * numberOfTickets,
          reservationStatus: "CONFIRMED",
          tickets: { create: guestTickets },
        },
        include: { tickets: true },
      });

      for (const ticket of reservation.tickets) {
        if (completedSeatCursor >= completedSeatRows.length) break;
        const seat = completedSeatRows[completedSeatCursor];
        completedSeatCursor += 1;
        await prisma.seatAssignment.create({
          data: {
            userId: student.id,
            ceremonyId: completedCeremony.id,
            seatId: seat.id,
            semesterGroup: "SPRING",
          },
        });
        await prisma.seat.update({ where: { id: seat.id }, data: { seatStatus: "OCCUPIED" } });
        await prisma.ticket.update({ where: { id: ticket.id }, data: { seatNumber: seat.seatNumber } });
        await prisma.qrScan.create({
          data: {
            ticketId: ticket.id,
            scannedById: manager.id,
            scanStatus: "VALID",
            scannedAt: atTime(completedDate, 16, randomInt(30, 55)),
          },
        });
      }

      await prisma.outfitRental.create({
        data: {
          userId: student.id,
          ceremonyId: completedCeremony.id,
          outfitId: masterGown.id,
          selectedSize: randomChoice(["M", "L", "XL"]),
          rentalStatus: "RETURNED",
          pickupDate: daysFrom(completedDate, -3),
          returnDate: daysFrom(completedDate, 4),
        },
      });
      await prisma.outfitRental.create({
        data: {
          userId: student.id,
          ceremonyId: completedCeremony.id,
          outfitId: masterHood.id,
          selectedSize: "One Size",
          rentalStatus: "RETURNED",
          pickupDate: daysFrom(completedDate, -3),
          returnDate: daysFrom(completedDate, 4),
        },
      });

      await prisma.notification.createMany({
        data: [
          NOTIFICATION_TEMPLATES.welcome(student.fullName.split(" ")[0]),
          NOTIFICATION_TEMPLATES.eligible(),
          NOTIFICATION_TEMPLATES.registration(completedCeremony.title),
          NOTIFICATION_TEMPLATES.ticketConfirmed(numberOfTickets, completedCeremony.title),
        ].map((n) => ({ userId: student.id, title: n.title, message: n.message, isRead: true })),
      });
    }

    // ── Vendor selected service + vendor requests + chat ─────────────────
    for (const vendor of approvedVendors) {
      const matchTitle = SERVICE_CATEGORY_MATCH[vendor.serviceType ?? ""];
      const matchedOffering = matchTitle
        ? serviceOfferings.find((o) => o.title === matchTitle)
        : undefined;

      if (matchedOffering) {
        await prisma.user.update({ where: { id: vendor.id }, data: { selectedServiceId: matchedOffering.id } });
      }

      const requestStatus = randomChoice(["PENDING", "IN_PROGRESS", "COMPLETED"]) as
        | "PENDING"
        | "IN_PROGRESS"
        | "COMPLETED";
      await prisma.vendorRequest.create({
        data: {
          vendorId: vendor.id,
          ceremonyId: upcomingCeremony.id,
          assignedById: manager.id,
          serviceOfferingId: matchedOffering?.id,
          requestTitle: `${matchTitle ?? vendor.serviceType} — ${upcomingCeremony.title}`,
          requestDescription: `Coordinate ${vendor.serviceType?.toLowerCase()} services for the ceremony on ${upcomingDate.toDateString()} at ${upcomingCeremony.venue}.`,
          requestStatus,
        },
      });

      const room = await prisma.chatRoom.create({
        data: { campusId: campus.id, adminId: manager.id, vendorId: vendor.id },
      });
      const conversation: { senderId: number; content: string }[] = [
        { senderId: manager.id, content: `Hi ${vendor.fullName}, thanks for confirming your services for ${upcomingCeremony.title}. Can you share your setup timeline?` },
        { senderId: vendor.id, content: `Hello! Yes, our team can be on-site by 2 PM to begin setup, well ahead of the ${upcomingCeremony.venue} doors opening.` },
        { senderId: manager.id, content: "Perfect. We'll have campus security grant you access from 1:30 PM. Please bring your vendor badge." },
        { senderId: vendor.id, content: "Noted, thank you! We'll also send over the final proposal breakdown by end of week." },
      ];
      for (let mIdx = 0; mIdx < conversation.length; mIdx++) {
        await prisma.chatMessage.create({
          data: {
            roomId: room.id,
            senderId: conversation[mIdx].senderId,
            content: conversation[mIdx].content,
            isRead: mIdx < conversation.length - 1,
          },
        });
      }
    }

    console.log(`✅ ${campus.name}: 2 admins, ${vendors.length} vendors, ${upcomingStudents.length + graduatedStudents.length} students, 2 ceremonies`);
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`🎓 Seed complete — ${campuses.length} campuses, ${studentCount} students`);
  console.log(`🔑 Superadmin login: ${superEmail} / ${superPassword}`);
  console.log(`🔑 All other seeded accounts (admins, students, vendors) use password: ${DEMO_PASSWORD}`);
  console.log("──────────────────────────────────────────\n");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
