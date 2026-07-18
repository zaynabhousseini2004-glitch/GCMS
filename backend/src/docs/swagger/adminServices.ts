/**
 * @swagger
 * tags:
 *   - name: Admin - Services
 *     description: Ceremony service offerings management
 */

/**
 * @swagger
 * /api/admin/ceremonies/{id}/services:
 *   post:
 *     tags: [Admin - Services]
 *     summary: Add a service offering to a ceremony
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ceremony ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Photography"
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 150.00
 *               quantity:
 *                 type: integer
 *                 default: 1
 *               quality:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service offering created
 *       404:
 *         description: Ceremony not found
 *   get:
 *     tags: [Admin - Services]
 *     summary: List service offerings for a ceremony
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ceremony ID
 *     responses:
 *       200:
 *         description: List of service offerings
 *       404:
 *         description: Ceremony not found
 */

/**
 * @swagger
 * /api/admin/services/{serviceId}:
 *   patch:
 *     tags: [Admin - Services]
 *     summary: Update a service offering
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               quality:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service offering updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Admin - Services]
 *     summary: Delete a service offering
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
