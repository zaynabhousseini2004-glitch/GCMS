// Static data pools used by demo.ts to generate a realistic, internally
// consistent Lebanese International University (LIU) dataset.

export const DEMO_PASSWORD = "Graduate@2026";

export interface CampusSeed {
  name: string;
  location: string;
  imageUrl: string;
}

export const CAMPUSES: CampusSeed[] = [
  {
    name: "Beirut Campus",
    location: "Mazraa, Beirut, Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Bekaa Campus",
    location: "Bar Elias, Bekaa, Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Saida Campus",
    location: "Saida, South Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Tripoli Campus",
    location: "Tripoli, North Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Nabatieh Campus",
    location: "Nabatieh, South Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Rayak Campus",
    location: "Rayak, Bekaa, Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Tyre Campus",
    location: "Tyre, South Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Akkar Campus",
    location: "Halba, Akkar, Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mount Lebanon Campus",
    location: "Aramoun, Mount Lebanon, Lebanon",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
  },
];

export const DEPARTMENT_TITLES = [
  "Dean",
  "Associate Dean",
  "Department Chair",
  "Program Coordinator",
  "Academic Advisor",
];

export interface FacultySeed {
  faculty: string;
  departments: string[];
}

export const FACULTIES: FacultySeed[] = [
  {
    faculty: "Faculty of Business Administration",
    departments: [
      "Business Management",
      "Accounting",
      "Marketing",
      "Finance",
      "Human Resources Management",
    ],
  },
  {
    faculty: "Faculty of Engineering",
    departments: [
      "Computer Engineering",
      "Civil Engineering",
      "Electrical & Electronics Engineering",
      "Mechanical Engineering",
      "Industrial Engineering",
    ],
  },
  {
    faculty: "Faculty of Arts and Sciences",
    departments: [
      "Computer Science",
      "Psychology",
      "English Language & Literature",
      "Mass Communication",
      "Graphic Design",
    ],
  },
  {
    faculty: "Faculty of Architecture, Design and Built Environment",
    departments: ["Architecture", "Interior Design"],
  },
  {
    faculty: "Faculty of Pharmacy",
    departments: ["Pharmacy"],
  },
  {
    faculty: "Faculty of Public Health",
    departments: ["Public Health", "Nutrition and Dietetics"],
  },
  {
    faculty: "Faculty of Nursing",
    departments: ["Nursing"],
  },
  {
    faculty: "Faculty of Law and Political Science",
    departments: ["Law", "Political Science"],
  },
];

// Rayak campus specialises in aviation — used only for that campus's students.
export const AVIATION_FACULTY: FacultySeed = {
  faculty: "Faculty of Aviation Sciences",
  departments: ["Aeronautics & Aviation Management", "Air Traffic Control"],
};

export const CEREMONY_VENUES: Record<string, string> = {
  "Beirut Campus": "Pierre Gemayel Grand Auditorium",
  "Bekaa Campus": "LIU Bekaa Multipurpose Hall",
  "Saida Campus": "Cedar Hall",
  "Tripoli Campus": "Tripoli Grand Auditorium",
  "Nabatieh Campus": "Nabatieh Main Hall",
  "Rayak Campus": "Rayak Aviation Hangar Hall",
  "Tyre Campus": "Tyre Seafront Hall",
  "Akkar Campus": "Akkar Central Auditorium",
  "Mount Lebanon Campus": "Mount Lebanon Amphitheater",
};

export const CEREMONY_BANNERS = [
  "https://images.unsplash.com/photo-1775623606576-3e049f72b8e7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633734973050-d6499a977c17?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496469888073-80de7e952517?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1706901786647-206a5cc89063?q=80&w=1600&auto=format&fit=crop",
];

export const OUTFIT_IMAGES: Record<string, string> = {
  GOWN: "https://images.unsplash.com/photo-1612214495858-4f32b96155a7?q=80&w=800&auto=format&fit=crop",
  CAP: "https://images.unsplash.com/photo-1758270703124-b65dce9a2bec?q=80&w=800&auto=format&fit=crop",
  HOOD: "https://images.unsplash.com/photo-1706901786647-206a5cc89063?q=80&w=800&auto=format&fit=crop",
};

export interface VendorCompanySeed {
  companyName: string;
  serviceType: string;
}

export const VENDOR_COMPANIES: VendorCompanySeed[] = [
  { companyName: "Cedar Lens Studio", serviceType: "Photography & Videography" },
  { companyName: "Beirut Frame Photography", serviceType: "Photography & Videography" },
  { companyName: "Golden Hour Photography Lebanon", serviceType: "Photography & Videography" },
  { companyName: "Le Mezze Catering", serviceType: "Catering" },
  { companyName: "Beirut Gourmet Catering", serviceType: "Catering" },
  { companyName: "Cedars Table Catering", serviceType: "Catering" },
  { companyName: "Blossom & Co. Events", serviceType: "Floral & Stage Decor" },
  { companyName: "Cedar Blooms Decor", serviceType: "Floral & Stage Decor" },
  { companyName: "Elegance Event Styling", serviceType: "Floral & Stage Decor" },
  { companyName: "SoundWave AV Productions", serviceType: "Audio-Visual & Lighting" },
  { companyName: "Beirut Stage & Sound", serviceType: "Audio-Visual & Lighting" },
  { companyName: "PrintCraft Lebanon", serviceType: "Printing & Stationery" },
  { companyName: "Cedar Press Printing", serviceType: "Printing & Stationery" },
  { companyName: "SafeRide Transport Services", serviceType: "Transportation" },
  { companyName: "Cedar Coach Transportation", serviceType: "Transportation" },
  { companyName: "Sweet Cedars Bakery & Desserts", serviceType: "Catering" },
  { companyName: "Skyline Event Rentals", serviceType: "Furniture & Equipment Rental" },
  { companyName: "Beirut Live Ushering Staff", serviceType: "Event Staffing & Ushering" },
];

export const SERVICE_OFFERINGS_TEMPLATE = [
  {
    title: "Graduation Photography Package",
    description:
      "Full-ceremony photo coverage including stage shots, family portraits, and a same-week digital gallery.",
    priceRange: [400, 900],
  },
  {
    title: "Guest Catering & Refreshments",
    description:
      "Catered refreshments and light bites for graduates' families served in the reception area after the ceremony.",
    priceRange: [1200, 3000],
  },
  {
    title: "Stage Floral & Backdrop Decor",
    description:
      "LIU-branded stage backdrop, floral arrangements, and aisle decor for the ceremony hall.",
    priceRange: [600, 1500],
  },
  {
    title: "Sound, Lighting & Live Streaming",
    description:
      "Professional sound system, stage lighting, and live-stream broadcast of the ceremony for remote family members.",
    priceRange: [800, 2000],
  },
  {
    title: "Printed Programs & Signage",
    description:
      "Printed ceremony programs, name cards, and directional signage across the venue.",
    priceRange: [150, 400],
  },
];

export const FIRST_NAMES_MALE = [
  "Ahmad", "Mohammad", "Ali", "Hassan", "Hussein", "Karim", "Omar", "Khaled",
  "Rami", "Fadi", "Elie", "Georges", "Jad", "Charbel", "Tarek", "Nabil",
  "Wissam", "Bilal", "Zein", "Youssef", "Bassel", "Marwan", "Samer", "Walid",
  "Hadi", "Mahdi", "Anthony", "Toufic", "Ziad", "Chady",
];

export const FIRST_NAMES_FEMALE = [
  "Zeina", "Layal", "Rania", "Nour", "Maya", "Sara", "Lea", "Yara", "Dana",
  "Farah", "Christelle", "Joanna", "Aya", "Reem", "Lina", "Maria", "Carla",
  "Tala", "Lynn", "Rita", "Cynthia", "Ghina", "Nada", "Hiba", "Diana",
  "Rawan", "Perla", "Nadine", "Mirna", "Batoul",
];

export const LAST_NAMES = [
  "Khoury", "Haddad", "Saad", "Fares", "Nassar", "Chamoun", "Aoun", "Sleiman",
  "Karam", "Rahal", "Hamdan", "Chehab", "Baydoun", "Kassem", "Mansour",
  "Freiha", "Daou", "Rizk", "Ghanem", "Berro", "Tabbara", "Halabi", "Sfeir",
  "Younes", "Mroue", "Osman", "Chalhoub", "Yazbek", "Abdallah", "Fakhoury",
  "Nakhle", "Housseini", "Sharafeldine", "Dirani", "Takesh", "Shoumen",
  "Dika", "Zaatari", "Abou Zeid", "Bou Malhab", "Awada", "Jaber", "Skaff",
  "Chidiac", "Merhi",
];

export const NOTIFICATION_TEMPLATES = {
  welcome: (name: string) => ({
    title: "Welcome to GCMS",
    message: `Hi ${name}, your LIU student account is now active. Track your graduation eligibility, ceremony details, and ticket reservations right here.`,
  }),
  eligible: () => ({
    title: "Graduation Eligibility Confirmed",
    message:
      "Congratulations! Your campus administration has confirmed your graduation eligibility. You can now reserve guest tickets and rent your graduation outfit.",
  }),
  pending: () => ({
    title: "Eligibility Review In Progress",
    message:
      "Your graduation eligibility is currently under review by your department. We'll notify you as soon as a decision is made.",
  }),
  notEligible: () => ({
    title: "Graduation Eligibility Update",
    message:
      "Your graduation eligibility could not be confirmed at this time. Please contact your department coordinator for outstanding requirements.",
  }),
  registration: (ceremonyTitle: string) => ({
    title: "Ceremony Registration Confirmed",
    message: `You are now registered for "${ceremonyTitle}". Keep an eye out for seating and guest ticket updates.`,
  }),
  ticketConfirmed: (count: number, ceremonyTitle: string) => ({
    title: "Guest Tickets Confirmed",
    message: `Your reservation for ${count} guest ticket(s) to "${ceremonyTitle}" has been confirmed. QR codes are available under My Tickets.`,
  }),
  ticketPending: (ceremonyTitle: string) => ({
    title: "Ticket Reservation Received",
    message: `Your guest ticket reservation for "${ceremonyTitle}" is pending confirmation from your campus administration.`,
  }),
  outfitApproved: (outfitType: string) => ({
    title: "Outfit Rental Approved",
    message: `Your ${outfitType.toLowerCase()} rental has been approved. Please check the pickup schedule under Outfit Rental.`,
  }),
  reminder: (ceremonyTitle: string, venue: string) => ({
    title: "Ceremony Reminder",
    message: `"${ceremonyTitle}" is coming up at ${venue}. Please arrive at least 90 minutes early for check-in and seating.`,
  }),
  seatAssigned: (seatNumber: string, sectionName: string) => ({
    title: "Seat Assignment Ready",
    message: `Your seat has been assigned: Section ${sectionName}, Seat ${seatNumber}. View the full seating map under your ceremony details.`,
  }),
};
