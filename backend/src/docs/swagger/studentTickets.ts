/**
 * @swagger
 * tags:
 *   - name: Student - Tickets
 *     description: Reserve guest tickets, view QR codes, manage reservations
 */

/**
 * @swagger
 * /api/student/tickets:
 *   post:
 *     tags: [Student - Tickets]
 *     summary: Reserve guest tickets for a ceremony
 *     description: Creates a ticket reservation with QR codes generated per ticket. Student must have ELIGIBLE status.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ceremonyId, numberOfTickets]
 *             properties:
 *               ceremonyId:
 *                 type: integer
 *               numberOfTickets:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               guests:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [guestName]
 *                   properties:
 *                     guestName:
 *                       type: string
 *                       example: "John Doe"
 *     responses:
 *       201:
 *         description: Reservation created with tickets and QR codes
 *       403:
 *         description: Student not eligible
 *       404:
 *         description: Ceremony not found
 *       409:
 *         description: Ceremony not accepting reservations
 *   get:
 *     tags: [Student - Tickets]
 *     summary: List all my ticket reservations with QR codes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations with tickets
 */

/**
 * @swagger
 * /api/student/tickets/{id}:
 *   get:
 *     tags: [Student - Tickets]
 *     summary: Get single reservation detail with tickets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation detail
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /api/student/tickets/{id}/cancel:
 *   patch:
 *     tags: [Student - Tickets]
 *     summary: Cancel a pending reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       404:
 *         description: Reservation not found
 *       409:
 *         description: Cannot cancel (not PENDING)
 */
