/**
 * @swagger
 * tags:
 *   - name: Admin - Vendors
 *     description: Vendor management and request assignment (campus-scoped)
 */

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     tags: [Admin - Vendors]
 *     summary: List vendors on admin's campus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 */

/**
 * @swagger
 * /api/admin/vendors/{id}:
 *   get:
 *     tags: [Admin - Vendors]
 *     summary: Get vendor detail with assigned requests
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
 *         description: Vendor details
 *       404:
 *         description: Vendor not found
 */

/**
 * @swagger
 * /api/admin/vendors/{id}/approve:
 *   patch:
 *     tags: [Admin - Vendors]
 *     summary: Approve vendor access
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
 *         description: Vendor approved
 *       404:
 *         description: Vendor not found
 *       409:
 *         description: Already approved
 */

/**
 * @swagger
 * /api/admin/vendors/{id}/reject:
 *   patch:
 *     tags: [Admin - Vendors]
 *     summary: Reject vendor access
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
 *         description: Vendor rejected
 *       404:
 *         description: Vendor not found
 *       409:
 *         description: Already rejected
 */

/**
 * @swagger
 * /api/admin/vendors/requests:
 *   post:
 *     tags: [Admin - Vendors]
 *     summary: Assign vendor to ceremony (create request)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vendorId, ceremonyId, requestTitle]
 *             properties:
 *               vendorId:
 *                 type: integer
 *               ceremonyId:
 *                 type: integer
 *               serviceOfferingId:
 *                 type: integer
 *               requestTitle:
 *                 type: string
 *                 example: "Catering for graduation"
 *               requestDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vendor request created
 *       404:
 *         description: Vendor or ceremony not found
 *   get:
 *     tags: [Admin - Vendors]
 *     summary: List all vendor requests (campus-scoped)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor requests
 */
