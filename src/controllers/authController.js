const { User } = require('../models');

/**
 * POST /api/auth/register
 * Register a new user account.
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'username, email, and password are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists.',
      });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'That username is already taken.',
      });
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
    });

    req.session.userId = user.id;
    req.session.username = user.username;

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: user.toJSON(),
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/login
 * Authenticate a user and create a session.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required.',
      });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/logout
 * Destroy the current session.
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  });
}

/**
 * GET /api/auth/me
 * Return the currently logged-in user's profile.
 */
async function me(req, res) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const user = await User.findByPk(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user: user.toJSON() });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { register, login, logout, me };
