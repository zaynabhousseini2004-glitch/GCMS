/**
 * @swagger
 * tags:
 *   - name: Admin - Department Heads
 *     description: Department head management (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/department-heads:
 *   post:
 *     tags: [Admin - Department Heads]
 *     summary: Add a department head
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [departmentTitleId, fullName, email]
 *             properties:
 *               departmentTitleId:
 *                 type: integer
 *               fullName:
 *                 type: string
 *                 example: "Dr. Ahmed Yilmaz"
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department head created
 *       404:
 *         description: Department title not found
 *       409:
 *         description: Duplicate email
 *   get:
 *     tags: [Admin - Department Heads]
 *     summary: List department heads on admin's campus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of department heads
 */

/**
 * @swagger
 * /api/admin/department-heads/{id}:
 *   patch:
 *     tags: [Admin - Department Heads]
 *     summary: Update a department head
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
 *             properties:
 *               departmentTitleId:
 *                 type: integer
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department head updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Admin - Department Heads]
 *     summary: Delete a department head
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
 *         description: Deleted
 *       404:
 *         description: Not found
 */
