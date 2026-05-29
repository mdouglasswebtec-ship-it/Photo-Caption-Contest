const { Router } = require('express');
const { deleteCaption } = require('../controllers/captionController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Captions
 *   description: Caption management
 */

/**
 * @swagger
 * /api/captions/{id}:
 *   delete:
 *     summary: Delete a caption (only the author may delete their own caption)
 *     tags: [Captions]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Caption ID
 *     responses:
 *       200:
 *         description: Caption deleted
 *       400:
 *         description: Invalid caption ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to delete this caption
 *       404:
 *         description: Caption not found
 */
router.delete('/:id', requireAuth, deleteCaption);

module.exports = router;
