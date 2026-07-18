/**
 * @swagger
 * tags:
 *   - name: Student - Reservations
 *     description: Unified view of all student reservations and rentals
 */

/**
 * @swagger
 * /api/student/reservations:
 *   get:
 *     tags: [Student - Reservations]
 *     summary: Get all reservations (tickets, outfit rentals, seat assignments)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Combined view of all student reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketReservations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       numberOfTickets:
 *                         type: integer
 *                       reservationStatus:
 *                         type: string
 *                         enum: [PENDING, CONFIRMED, CANCELLED]
 *                       ceremony:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           ceremonyDate:
 *                             type: string
 *                             format: date-time
 *                 outfitRentals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       selectedSize:
 *                         type: string
 *                       rentalStatus:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED, RETURNED]
 *                       outfit:
 *                         type: object
 *                         properties:
 *                           outfitType:
 *                             type: string
 *                           rentalPrice:
 *                             type: number
 *                 seatAssignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ceremony:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                       seat:
 *                         type: object
 *                         properties:
 *                           seatNumber:
 *                             type: string
 *                           sectionName:
 *                             type: string
 */
