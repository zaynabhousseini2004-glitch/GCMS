/**
 * @swagger
 * tags:
 *   - name: Student - Outfits
 *     description: Browse outfits, rent, and cancel rentals
 */

/**
 * @swagger
 * /api/student/outfits:
 *   get:
 *     tags: [Student - Outfits]
 *     summary: Browse available outfits on campus
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [GOWN, CAP, HOOD]
 *         description: Filter by outfit type
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Filter by size
 *     responses:
 *       200:
 *         description: List of available outfits
 */

/**
 * @swagger
 * /api/student/outfits/rent:
 *   post:
 *     tags: [Student - Outfits]
 *     summary: Submit an outfit rental request
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ceremonyId, outfitId, selectedSize]
 *             properties:
 *               ceremonyId:
 *                 type: integer
 *               outfitId:
 *                 type: integer
 *               selectedSize:
 *                 type: string
 *                 example: "L"
 *     responses:
 *       201:
 *         description: Rental request submitted (status PENDING)
 *       404:
 *         description: Ceremony or outfit not found
 *       409:
 *         description: Outfit unavailable or duplicate rental
 */

/**
 * @swagger
 * /api/student/outfits/rentals/{id}/cancel:
 *   patch:
 *     tags: [Student - Outfits]
 *     summary: Cancel a pending rental request
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
 *         description: Rental cancelled
 *       404:
 *         description: Rental not found
 *       409:
 *         description: Cannot cancel (not PENDING)
 */
