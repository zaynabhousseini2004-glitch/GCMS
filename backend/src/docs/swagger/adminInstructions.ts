/**
 * @swagger
 * tags:
 *   - name: Admin - Instructions
 *     description: Ceremony instructions management
 */

/**
 * @swagger
 * /api/admin/instructions:
 *   post:
 *     tags: [Admin - Instructions]
 *     summary: Create a ceremony instruction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ceremonyId, title, content]
 *             properties:
 *               ceremonyId:
 *                 type: integer
 *               title:
 *                 type: string
 *                 example: "Dress Code"
 *               content:
 *                 type: string
 *                 example: "All students must wear formal attire."
 *               sortOrder:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Instruction created
 *       404:
 *         description: Ceremony not found
 */

/**
 * @swagger
 * /api/admin/ceremonies/{ceremonyId}/instructions:
 *   get:
 *     tags: [Admin - Instructions]
 *     summary: List instructions for a ceremony
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
 *         description: List of instructions
 *       404:
 *         description: Ceremony not found
 */

/**
 * @swagger
 * /api/admin/instructions/{id}:
 *   patch:
 *     tags: [Admin - Instructions]
 *     summary: Update an instruction
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Instruction updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Admin - Instructions]
 *     summary: Delete an instruction
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
