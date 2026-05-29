const NodeCache = require('node-cache');
require('dotenv').config();

const ttl = parseInt(process.env.CACHE_TTL || '3600');

const cache = new NodeCache({
  stdTTL: ttl,
  checkperiod: ttl * 0.2,
  useClones: false,
});

const CACHE_KEYS = {
  ALL_IMAGES: 'all_images',
  IMAGE_BY_ID: (id) => `image_${id}`,
};

module.exports = { cache, CACHE_KEYS };
