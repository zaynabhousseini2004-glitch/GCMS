/**
 * @swagger
 * tags:
 *   - name: Admin - Ceremonies
 *     description: Ceremony management (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/ceremonies:
 *   post:
 *     tags: [Admin - Ceremonies]
 *     summary: Create a new ceremony
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCeremonyRequest'
 *     responses:
 *       201:
 *         description: Ceremony created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ceremony:
 *                   $ref: '#/components/schemas/Ceremony'
 *       400:
 *         description: Validation error
 *   get:
 *     tags: [Admin - Ceremonies]
 *     summary: List ceremonies on admin's campus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of ceremonies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ceremonies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ceremony'
 */

/**
 * @swagger
 * /api/admin/ceremonies/{id}:
 *   get:
 *     tags: [Admin - Ceremonies]
 *     summary: Get ceremony detail
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
 *         description: Ceremony details
 *       404:
 *         description: Ceremony not found
 *   patch:
 *     tags: [Admin - Ceremonies]
 *     summary: Update a ceremony
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
 *             $ref: '#/components/schemas/UpdateCeremonyRequest'
 *     responses:
 *       200:
 *         description: Ceremony updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ceremony not found
 */

/**
 * @swagger
 * /api/admin/ceremonies/{id}/cancel:
 *   patch:
 *     tags: [Admin - Ceremonies]
 *     summary: Cancel a ceremony
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
 *         description: Ceremony cancelled
 *       404:
 *         description: Ceremony not found
 *       409:
 *         description: Already cancelled
 */
