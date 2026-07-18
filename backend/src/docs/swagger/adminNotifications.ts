/**
 * @swagger
 * tags:
 *   - name: Admin - Notifications
 *     description: Notification management (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/notifications:
 *   post:
 *     tags: [Admin - Notifications]
 *     summary: Send notification to a student or broadcast to all campus students
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, message]
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: Target student ID (omit for broadcast to all campus students)
 *               title:
 *                 type: string
 *                 example: "Ceremony Reminder"
 *               message:
 *                 type: string
 *                 example: "Your graduation ceremony is tomorrow at 10am."
 *               type:
 *                 type: string
 *                 enum: [INFO, WARNING, ALERT, REMINDER]
 *                 default: INFO
 *     responses:
 *       201:
 *         description: Notification(s) sent
 *       404:
 *         description: Target user not found
 *   get:
 *     tags: [Admin - Notifications]
 *     summary: List sent notifications (campus-scoped)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
