/**
 * @swagger
 * tags:
 *   - name: Vendor - Requests
 *     description: View and update vendor service requests assigned by admin
 */

/**
 * @swagger
 * /api/vendor/requests:
 *   get:
 *     tags: [Vendor - Requests]
 *     summary: List requests assigned to this vendor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       requestTitle:
 *                         type: string
 *                       requestDescription:
 *                         type: string
 *                         nullable: true
 *                       requestStatus:
 *                         type: string
 *                         enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *                       ceremony:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date-time
 *                           location:
 *                             type: string
 *                       serviceOffering:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           price:
 *                             type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/vendor/requests/{id}:
 *   get:
 *     tags: [Vendor - Requests]
 *     summary: Get a specific request detail
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
 *         description: Request detail
 *       404:
 *         description: Request not found
 *   patch:
 *     tags: [Vendor - Requests]
 *     summary: Update request status (In Progress / Completed)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [requestStatus]
 *             properties:
 *               requestStatus:
 *                 type: string
 *                 enum: [IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Request not found
 *       409:
 *         description: Request already completed or cancelled
 */
