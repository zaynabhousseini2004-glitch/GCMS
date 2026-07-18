/**
 * @swagger
 * tags:
 *   - name: Vendor - Chat
 *     description: >
 *       Chat with campus admin (REST + WebSocket).
 *       Real-time messaging uses the same WebSocket events documented under Admin - Chat.
 *       Connect to <code>ws://host/socket.io</code> with <code>{ auth: { token: "JWT_TOKEN" } }</code>.
 */

/**
 * @swagger
 * /api/vendor/chat/rooms:
 *   get:
 *     tags: [Vendor - Chat]
 *     summary: List chat rooms the vendor participates in
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat rooms with last message and unread count
 *   post:
 *     tags: [Vendor - Chat]
 *     summary: Create or get chat room with the campus admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Existing room returned
 *       201:
 *         description: New room created
 *       404:
 *         description: No admin found for campus
 */

/**
 * @swagger
 * /api/vendor/chat/rooms/{id}/messages:
 *   get:
 *     tags: [Vendor - Chat]
 *     summary: Get messages in a chat room (marks unread as read)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat room ID
 *     responses:
 *       200:
 *         description: List of messages
 *       404:
 *         description: Room not found
 *   post:
 *     tags: [Vendor - Chat]
 *     summary: Send a message (also broadcasts via WebSocket)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chat room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: "I'll have the setup ready by Friday."
 *     responses:
 *       201:
 *         description: Message sent
 *       404:
 *         description: Room not found
 */
