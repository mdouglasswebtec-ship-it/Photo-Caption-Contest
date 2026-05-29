const { Caption, Image, User } = require('../models');
const { cache, CACHE_KEYS } = require('../cache');

/**
 * POST /api/images/:id/captions
 * Add a caption to an image. Requires authentication.
 */
async function addCaption(req, res) {
  try {
    const { id } = req.params;
    const imageId = parseInt(id, 10);

    if (isNaN(imageId) || imageId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid image ID.' });
    }

    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Caption text is required.' });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Caption must be 500 characters or fewer.',
      });
    }

    const image = await Image.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    const caption = await Caption.create({
      text: text.trim(),
      userId: req.session.userId,
      imageId,
    });

    // Invalidate cache for this image so next request fetches fresh data
    cache.del(CACHE_KEYS.IMAGE_BY_ID(imageId));
    cache.del(CACHE_KEYS.ALL_IMAGES);

    const captionWithUser = await Caption.findByPk(caption.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
    });

    return res.status(201).json({
      success: true,
      message: 'Caption added successfully.',
      data: captionWithUser,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }
    console.error('Add caption error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * DELETE /api/captions/:id
 * Delete a caption. Only the caption's author may delete it.
 */
async function deleteCaption(req, res) {
  try {
    const { id } = req.params;
    const captionId = parseInt(id, 10);

    if (isNaN(captionId) || captionId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid caption ID.' });
    }

    const caption = await Caption.findByPk(captionId);
    if (!caption) {
      return res.status(404).json({ success: false, message: 'Caption not found.' });
    }

    if (caption.userId !== req.session.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this caption.',
      });
    }

    const imageId = caption.imageId;
    await caption.destroy();

    // Invalidate cache
    cache.del(CACHE_KEYS.IMAGE_BY_ID(imageId));
    cache.del(CACHE_KEYS.ALL_IMAGES);

    return res.status(200).json({ success: true, message: 'Caption deleted successfully.' });
  } catch (error) {
    console.error('Delete caption error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { addCaption, deleteCaption };
