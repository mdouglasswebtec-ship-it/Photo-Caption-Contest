const { Image, Caption, User } = require('../models');
const { cache, CACHE_KEYS } = require('../cache');

/**
 * GET /api/images
 * Retrieve all images (cached).
 */
async function getAllImages(req, res) {
  try {
    const cacheKey = CACHE_KEYS.ALL_IMAGES;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: cached,
      });
    }

    const images = await Image.findAll({
      order: [['createdAt', 'DESC']],
    });

    cache.set(cacheKey, images);

    return res.status(200).json({
      success: true,
      source: 'database',
      data: images,
    });
  } catch (error) {
    console.error('Get all images error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * GET /api/images/:id
 * Retrieve a single image by ID, including its captions (cached).
 */
async function getImageById(req, res) {
  try {
    const { id } = req.params;
    const imageId = parseInt(id, 10);

    if (isNaN(imageId) || imageId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid image ID.' });
    }

    const cacheKey = CACHE_KEYS.IMAGE_BY_ID(imageId);
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: cached,
      });
    }

    const image = await Image.findByPk(imageId, {
      include: [
        {
          model: Caption,
          as: 'captions',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username'],
            },
          ],
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    cache.set(cacheKey, image);

    return res.status(200).json({
      success: true,
      source: 'database',
      data: image,
    });
  } catch (error) {
    console.error('Get image by id error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { getAllImages, getImageById };
