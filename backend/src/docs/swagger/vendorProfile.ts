/**
 * @swagger
 * tags:
 *   - name: Vendor - Profile
 *     description: Vendor profile and company information
 */

/**
 * @swagger
 * /api/vendor/profile:
 *   get:
 *     tags: [Vendor - Profile]
 *     summary: Get own vendor profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                     companyName:
 *                       type: string
 *                       nullable: true
 *                     serviceType:
 *                       type: string
 *                       nullable: true
 *                     vendorApprovalStatus:
 *                       type: string
 *                       enum: [PENDING, APPROVED, REJECTED]
 *                     campus:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         location:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *   patch:
 *     tags: [Vendor - Profile]
 *     summary: Update company info and service type
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: "ABC Catering"
 *               serviceType:
 *                 type: string
 *                 example: "Catering"
 *               phone:
 *                 type: string
 *                 example: "+905551234567"
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Validation error
 */
