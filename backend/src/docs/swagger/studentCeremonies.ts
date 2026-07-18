/**
 * @swagger
 * tags:
 *   - name: Student - Ceremonies
 *     description: View campus ceremonies and details
 */

/**
 * @swagger
 * /api/student/ceremonies:
 *   get:
 *     tags: [Student - Ceremonies]
 *     summary: List ceremonies on student's campus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of ceremonies (excludes CANCELLED)
 */

/**
 * @swagger
 * /api/student/ceremonies/{id}:
 *   get:
 *     tags: [Student - Ceremonies]
 *     summary: View ceremony detail with instructions and service offerings
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
 *         description: Ceremony detail with student-targeted instructions
 *       404:
 *         description: Ceremony not found
 */
