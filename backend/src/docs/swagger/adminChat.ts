/**
 * @swagger
 * tags:
 *   - name: Admin - Chat
 *     description: >
 *       Chat room management (REST) and real-time messaging (WebSocket).
 *
 *
 *       <b>REST endpoints</b> — create/list rooms, get message history.<br/>
 *       <b>WebSocket</b> — connect to <code>ws://host/socket.io</code> for real-time messaging.
 *
 *
 *       <h3>WebSocket Authentication</h3>
 *       Connect with <code>{ auth: { token: "JWT_TOKEN" } }</code> in handshake options.
 *
 *
 *       <h3>WebSocket Events (Client → Server)</h3>
 *       <table>
 *         <thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
 *         <tbody>
 *           <tr><td><code>chat:join</code></td><td><code>roomId: number</code></td><td>Join a chat room</td></tr>
 *           <tr><td><code>chat:leave</code></td><td><code>roomId: number</code></td><td>Leave a chat room</td></tr>
 *           <tr><td><code>chat:message</code></td><td><code>{ roomId, content }</code></td><td>Send a message</td></tr>
 *           <tr><td><code>chat:read</code></td><td><code>roomId: number</code></td><td>Mark messages as read</td></tr>
 *           <tr><td><code>chat:typing</code></td><td><code>roomId: number</code></td><td>Typing indicator</td></tr>
 *           <tr><td><code>chat:stopTyping</code></td><td><code>roomId: number</code></td><td>Stop typing indicator</td></tr>
 *         </tbody>
 *       </table>
 *
 *
 *       <h3>WebSocket Events (Server → Client)</h3>
 *       <table>
 *         <thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
 *         <tbody>
 *           <tr><td><code>chat:joined</code></td><td><code>{ roomId }</code></td><td>Confirmation of room join</td></tr>
 *           <tr><td><code>chat:message</code></td><td><code>{ roomId, message }</code></td><td>New message in room</td></tr>
 *           <tr><td><code>chat:notification</code></td><td><code>{ roomId, message }</code></td><td>Message notification (sent to user room)</td></tr>
 *           <tr><td><code>chat:read</code></td><td><code>{ roomId }</code></td><td>Messages marked as read by other party</td></tr>
 *           <tr><td><code>chat:typing</code></td><td><code>{ roomId, userId }</code></td><td>Other user is typing</td></tr>
 *           <tr><td><code>chat:stopTyping</code></td><td><code>{ roomId, userId }</code></td><td>Other user stopped typing</td></tr>
 *         </tbody>
 *       </table>
 */

/**
 * @swagger
 * /api/admin/chat/rooms:
 *   get:
 *     tags: [Admin - Chat]
 *     summary: List chat rooms the admin participates in
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat rooms with last message
 *   post:
 *     tags: [Admin - Chat]
 *     summary: Create or get existing chat room with a user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [participantId]
 *             properties:
 *               participantId:
 *                 type: integer
 *                 description: User ID of the other participant
 *     responses:
 *       200:
 *         description: Existing room returned
 *       201:
 *         description: New room created
 */

/**
 * @swagger
 * /api/admin/chat/rooms/{id}/messages:
 *   get:
 *     tags: [Admin - Chat]
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
 *         description: Room not found or not a participant
 *   post:
 *     tags: [Admin - Chat]
 *     summary: Send a message in a chat room
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
 *                 example: "Your vendor request has been approved."
 *     responses:
 *       201:
 *         description: Message sent
 *       404:
 *         description: Room not found or not a participant
 */
