/**
 * @swagger
 * tags:
 *   - name: Student - Notifications
 *     description: View and manage student notifications
 */

/**
 * @swagger
 * /api/student/notifications:
 *   get:
 *     tags: [Student - Notifications]
 *     summary: List all notifications
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */

/**
 * @swagger
 * /api/student/notifications/{id}/read:
 *   patch:
 *     tags: [Student - Notifications]
 *     summary: Mark a notification as read
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
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/student/notifications/read-all:
 *   patch:
 *     tags: [Student - Notifications]
 *     summary: Mark all notifications as read
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
