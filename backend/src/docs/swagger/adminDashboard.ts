/**
 * @swagger
 * tags:
 *   - name: Admin - Dashboard
 *     description: Admin dashboard statistics (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin - Dashboard]
 *     summary: Get campus dashboard statistics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     totalCeremonies:
 *                       type: integer
 *                     upcomingCeremonies:
 *                       type: integer
 *                     totalTicketsIssued:
 *                       type: integer
 *                     totalOutfitRentals:
 *                       type: integer
 *                     totalVendors:
 *                       type: integer
 *                 recentRegistrations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       registeredAt:
 *                         type: string
 *                         format: date-time
 *                       registrationStatus:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       ceremony:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not an admin or no campus assigned
 */
