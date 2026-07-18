import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Graduation Ceremony API",
      version: "1.0.0",
      description:
        "API documentation for Graduation Ceremony Management System",
    },
    servers: [
      {
        url: "http://localhost:{port}",
        variables: {
          port: { default: process.env.PORT || "3001" },
        },
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // ─── Shared Error Responses ───────────────────────────────────
        ValidationError: {
          type: "object",
          properties: {
            message: { type: "string", example: "Validation error" },
            errors: { type: "object" },
          },
        },
        ErrorMessage: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },

        // ─── Auth ─────────────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["fullName", "email", "password", "role"],
          properties: {
            fullName: { type: "string", minLength: 2, example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: { type: "string", minLength: 8, example: "secret123" },
            phone: { type: "string", example: "+1234567890" },
            role: {
              type: "string",
              enum: ["STUDENT", "VENDOR"],
              example: "STUDENT",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: { type: "string", example: "secret123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                fullName: { type: "string" },
                email: { type: "string" },
                role: { type: "string" },
                status: { type: "string" },
              },
            },
          },
        },

        // ─── Admin User ──────────────────────────────────────────────
        AdminUser: {
          type: "object",
          properties: {
            id: { type: "integer" },
            fullName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string", nullable: true },
            role: { type: "string", example: "ADMIN" },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            campusId: { type: "integer", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateAdminRequest: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", minLength: 2, example: "Admin User" },
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            password: { type: "string", minLength: 8, example: "password123" },
            phone: { type: "string", example: "+1234567890" },
            campusId: { type: "integer", example: 1 },
          },
        },
        UpdateAdminRequest: {
          type: "object",
          properties: {
            fullName: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            campusId: { type: "integer", nullable: true },
          },
        },

        // ─── Campus ──────────────────────────────────────────────────
        Campus: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            location: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            _count: {
              type: "object",
              properties: {
                users: { type: "integer" },
                ceremonies: { type: "integer" },
              },
            },
          },
        },
        CreateCampusRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Main Campus" },
            location: { type: "string", example: "123 University Ave" },
          },
        },
        UpdateCampusRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            location: { type: "string" },
          },
        },
        AssignAdminRequest: {
          type: "object",
          required: ["adminId"],
          properties: {
            adminId: { type: "integer", example: 2 },
          },
        },
        CampusAdmin: {
          type: "object",
          properties: {
            id: { type: "integer" },
            fullName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string", nullable: true },
            status: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Department Title ────────────────────────────────────────
        DepartmentTitle: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            _count: {
              type: "object",
              properties: {
                heads: { type: "integer" },
              },
            },
          },
        },
        CreateDepartmentTitleRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Computer Science" },
          },
        },

        // ─── Admin – Student ─────────────────────────────────────────
        Student: {
          type: "object",
          properties: {
            id: { type: "integer" },
            fullName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string", nullable: true },
            status: { type: "string" },
            eligibilityStatus: { type: "string", enum: ["PENDING", "ELIGIBLE", "NOT_ELIGIBLE"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Admin – Ceremony ────────────────────────────────────────
        Ceremony: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            date: { type: "string", format: "date-time" },
            location: { type: "string", nullable: true },
            status: { type: "string", enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"] },
            ticketPrice: { type: "number", nullable: true },
            maxGuests: { type: "integer", nullable: true },
            campusId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateCeremonyRequest: {
          type: "object",
          required: ["title", "date"],
          properties: {
            title: { type: "string", example: "Spring 2025 Graduation" },
            date: { type: "string", format: "date-time" },
            location: { type: "string", example: "Main Hall" },
            ticketPrice: { type: "number", example: 50.0 },
            maxGuests: { type: "integer", example: 500 },
          },
        },
        UpdateCeremonyRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            date: { type: "string", format: "date-time" },
            location: { type: "string" },
            ticketPrice: { type: "number" },
            maxGuests: { type: "integer" },
          },
        },

        // ─── Admin – Ticket ─────────────────────────────────────────
        TicketReservation: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            ceremonyId: { type: "integer" },
            status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] },
            numberOfGuests: { type: "integer" },
            totalPrice: { type: "number", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Admin – Outfit ─────────────────────────────────────────
        CreateOutfitRequest: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: { type: "string", example: "Graduation Gown - Large" },
            description: { type: "string" },
            size: { type: "string", example: "L" },
            price: { type: "number", example: 75.0 },
            quantityAvailable: { type: "integer", example: 100 },
          },
        },
        UpdateOutfitRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            size: { type: "string" },
            price: { type: "number" },
            quantityAvailable: { type: "integer" },
            isActive: { type: "boolean" },
          },
        },
      },
    },
  },
  // Scan all route files for JSDoc swagger annotations
  apis: ["./src/docs/swagger/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
