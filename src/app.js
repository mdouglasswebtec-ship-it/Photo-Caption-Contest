require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Routes
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const captionRoutes = require('./routes/captions');

const app = express();

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files (contest images) ──────────────────────────────────────────
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Session ─────────────────────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
      sameSite: 'lax',
    },
  })
);

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/captions', captionRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Root ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Photo Caption Contest API',
    version: '1.0.0',
    docs: '/api-docs',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
      },
      images: {
        all: 'GET /api/images',
        byId: 'GET /api/images/:id',
        addCaption: 'POST /api/images/:id/captions  [auth required]',
      },
      captions: {
        delete: 'DELETE /api/captions/:id  [auth required]',
      },
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;
