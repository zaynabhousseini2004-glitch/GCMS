/**
 * @swagger
 * tags:
 *   - name: Admin - QR Scan
 *     description: QR code scanning for ticket validation
 */

/**
 * @swagger
 * /api/admin/qr-scan:
 *   post:
 *     tags: [Admin - QR Scan]
 *     summary: Scan a ticket QR code and validate entry
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ticketCode]
 *             properties:
 *               ticketCode:
 *                 type: string
 *                 example: "TICKET-ABC123"
 *     responses:
 *       200:
 *         description: Scan result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scanResult:
 *                   type: string
 *                   enum: [VALID, INVALID, ALREADY_USED]
 *                 accessDecision:
 *                   type: string
 *                   enum: [GRANTED, DENIED]
 *                 ticket:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ticketCode:
 *                       type: string
 *                     status:
 *                       type: string
 *                     guestFullName:
 *                       type: string
 *                     reservation:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                           properties:
 *                             fullName:
 *                               type: string
 *                         ceremony:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 */
