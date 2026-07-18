/**
 * @swagger
 * tags:
 *   - name: Admin - Seating
 *     description: Seat management and assignment (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/ceremonies/{ceremonyId}/seats:
 *   post:
 *     tags: [Admin - Seating]
 *     summary: Bulk-create seats for a ceremony
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
 *             required: [seats]
 *             properties:
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [seatNumber]
 *                   properties:
 *                     seatNumber:
 *                       type: string
 *                       example: "A1"
 *                     sectionName:
 *                       type: string
 *                       example: "Section A"
 *                     rowNumber:
 *                       type: string
 *                       example: "1"
 *     responses:
 *       201:
 *         description: Seats created
 *       404:
 *         description: Ceremony not found
 *   get:
 *     tags: [Admin - Seating]
 *     summary: List seats with assignment status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ceremonyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of seats
 *       404:
 *         description: Ceremony not found
 */

/**
 * @swagger
 * /api/admin/ceremonies/{ceremonyId}/seats/assign:
 *   post:
 *     tags: [Admin - Seating]
 *     summary: Assign a seat to a student
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
 *             required: [userId, seatId]
 *             properties:
 *               userId:
 *                 type: integer
 *               seatId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Seat assigned
 *       404:
 *         description: Ceremony, seat, or student not found
 *       409:
 *         description: Seat not available
 */

/**
 * @swagger
 * /api/admin/ceremonies/{ceremonyId}/seats/assign/{id}:
 *   delete:
 *     tags: [Admin - Seating]
 *     summary: Remove a seat assignment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ceremonyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seat assignment ID
 *     responses:
 *       200:
 *         description: Assignment removed
 *       404:
 *         description: Not found
 */
