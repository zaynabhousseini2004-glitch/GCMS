/**
 * @swagger
 * tags:
 *   - name: Admin - Students
 *     description: Student management (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     tags: [Admin - Students]
 *     summary: List students on admin's campus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not an admin
 */

/**
 * @swagger
 * /api/admin/students/{id}:
 *   get:
 *     tags: [Admin - Students]
 *     summary: Get student detail with registrations, tickets, and rentals
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
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid student id
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /api/admin/students/{id}/eligibility:
 *   patch:
 *     tags: [Admin - Students]
 *     summary: Update student eligibility status
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
 *             required: [eligibilityStatus]
 *             properties:
 *               eligibilityStatus:
 *                 type: string
 *                 enum: [PENDING, ELIGIBLE, NOT_ELIGIBLE]
 *     responses:
 *       200:
 *         description: Student eligibility updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Student not found
 */
