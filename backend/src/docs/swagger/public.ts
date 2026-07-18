/**
 * @swagger
 * tags:
 *   - name: Public
 *     description: Public endpoints — no authentication required. Used for the landing page and campus selection.
 */

/**
 * @swagger
 * /api/public/campuses:
 *   get:
 *     tags: [Public]
 *     summary: List all campuses (for campus selection page)
 *     responses:
 *       200:
 *         description: List of campuses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campuses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       location:
 *                         type: string
 *                         nullable: true
 */

/**
 * @swagger
 * /api/public/campuses/{campusId}/ceremonies:
 *   get:
 *     tags: [Public]
 *     summary: List ceremonies for a campus
 *     parameters:
 *       - in: path
 *         name: campusId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of upcoming/completed ceremonies
 *       404:
 *         description: Campus not found
 */

/**
 * @swagger
 * /api/public/campuses/{campusId}/ceremonies/{id}:
 *   get:
 *     tags: [Public]
 *     summary: Get ceremony detail with instructions
 *     parameters:
 *       - in: path
 *         name: campusId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ceremony detail with all instructions (STUDENT, PARENT, GUEST)
 *       404:
 *         description: Ceremony not found
 */

/**
 * @swagger
 * /api/public/campuses/{campusId}/outfits:
 *   get:
 *     tags: [Public]
 *     summary: Browse available outfits for a campus
 *     parameters:
 *       - in: path
 *         name: campusId
 *         required: true
 *         schema:
 *           type: integer
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
 * /api/public/campuses/{campusId}/department-heads:
 *   get:
 *     tags: [Public]
 *     summary: List department heads for a campus
 *     parameters:
 *       - in: path
 *         name: campusId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of department heads with titles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 departmentHeads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       photoUrl:
 *                         type: string
 *                         nullable: true
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       title:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 */
