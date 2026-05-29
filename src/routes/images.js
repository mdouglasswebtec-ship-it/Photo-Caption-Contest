const { Router } = require('express');
const { getAllImages, getImageById } = require('../controllers/imageController');
const { addCaption } = require('../controllers/captionController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Photo contest images
 */

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: List of all images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 source:
 *                   type: string
 *                   enum: [cache, database]
 *                   description: Whether data came from cache or the database
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllImages);

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     summary: Get an image by ID, including its captions
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image with captions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 source:
 *                   type: string
 *                   enum: [cache, database]
 *                 data:
 *                   $ref: '#/components/schemas/ImageWithCaptions'
 *       400:
 *         description: Invalid image ID
 *       404:
 *         description: Image not found
 */
router.get('/:id', getImageById);

/**
 * @swagger
 * /api/images/{id}/captions:
 *   post:
 *     summary: Add a caption to an image (requires authentication)
 *     tags: [Images]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 500
 *                 example: When life gives you mountains, take pictures.
 *     responses:
 *       201:
 *         description: Caption added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Caption'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Image not found
 */
router.post('/:id/captions', requireAuth, addCaption);

module.exports = router;
