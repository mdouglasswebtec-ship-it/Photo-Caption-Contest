/**
 * Middleware to verify a user is authenticated.
 * Attaches req.user from the session.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
  }
  next();
}

module.exports = { requireAuth };
