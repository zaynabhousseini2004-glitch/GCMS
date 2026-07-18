/**
 * @swagger
 * tags:
 *   - name: Admin - Outfits
 *     description: Outfit inventory and rental management (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/outfits:
 *   post:
 *     tags: [Admin - Outfits]
 *     summary: Add outfit to campus inventory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOutfitRequest'
 *     responses:
 *       201:
 *         description: Outfit created
 *       400:
 *         description: Validation error
 *   get:
 *     tags: [Admin - Outfits]
 *     summary: List outfits on admin's campus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of outfits
 */

/**
 * @swagger
 * /api/admin/outfits/{id}:
 *   patch:
 *     tags: [Admin - Outfits]
 *     summary: Update outfit (price, quantity, status)
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
 *             $ref: '#/components/schemas/UpdateOutfitRequest'
 *     responses:
 *       200:
 *         description: Outfit updated
 *       404:
 *         description: Outfit not found
 */

/**
 * @swagger
 * /api/admin/outfits/rentals:
 *   get:
 *     tags: [Admin - Outfits]
 *     summary: List all outfit rental requests (campus-scoped)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of rentals
 */

/**
 * @swagger
 * /api/admin/outfits/rentals/{id}/approve:
 *   patch:
 *     tags: [Admin - Outfits]
 *     summary: Approve a rental request
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
 *         description: Rental approved
 *       404:
 *         description: Rental not found
 *       409:
 *         description: Not in PENDING status
 */

/**
 * @swagger
 * /api/admin/outfits/rentals/{id}/reject:
 *   patch:
 *     tags: [Admin - Outfits]
 *     summary: Reject a rental request
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
 *         description: Rental rejected
 *       404:
 *         description: Rental not found
 *       409:
 *         description: Not in PENDING status
 */
