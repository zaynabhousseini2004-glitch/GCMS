/**
 * @swagger
 * tags:
 *   - name: Admin - Tickets
 *     description: Ticket/reservation management (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/tickets:
 *   get:
 *     tags: [Admin - Tickets]
 *     summary: List all ticket reservations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TicketReservation'
 */

/**
 * @swagger
 * /api/admin/tickets/{id}:
 *   get:
 *     tags: [Admin - Tickets]
 *     summary: Get reservation detail with tickets
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
 *         description: Reservation details
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /api/admin/tickets/{id}/confirm:
 *   patch:
 *     tags: [Admin - Tickets]
 *     summary: Confirm a reservation
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
 *         description: Reservation confirmed
 *       404:
 *         description: Reservation not found
 *       409:
 *         description: Not in PENDING status
 */

/**
 * @swagger
 * /api/admin/tickets/{id}/cancel:
 *   patch:
 *     tags: [Admin - Tickets]
 *     summary: Cancel a reservation (and all its tickets)
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
 *         description: Already cancelled
 */

/**
 * @swagger
 * /api/admin/ceremonies/{ceremonyId}/ticket-price:
 *   patch:
 *     tags: [Admin - Tickets]
 *     summary: Set ticket price for a ceremony (updates pending reservations)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ceremonyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pricePerTicket]
 *             properties:
 *               pricePerTicket:
 *                 type: number
 *                 minimum: 0
 *                 example: 25.00
 *     responses:
 *       200:
 *         description: Price updated
 *       404:
 *         description: Ceremony not found
 */
