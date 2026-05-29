# Photo Caption Contest API

A backend REST API for a photo caption contest platform built with **Node.js**, **Express**, **PostgreSQL**, and **Sequelize**.

## Features

- User registration, login, and session-based authentication
- Browse contest images (with local cache via `node-cache`)
- Submit captions for images (authentication required)
- Delete your own captions
- Full Swagger/OpenAPI 3.0 documentation
- Ready to deploy on Render

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Sequelize 6 |
| Authentication | bcrypt + express-session |
| Caching | node-cache |
| Docs | swagger-jsdoc + swagger-ui-express |
| Deployment | Render |

## Project Structure

```
photo-caption-contest/
├── public/
│   └── images/          # Contest images (served statically)
├── src/
│   ├── cache/           # node-cache setup
│   ├── config/
│   │   ├── config.js    # Sequelize DB config
│   │   └── swagger.js   # Swagger/OpenAPI spec
│   ├── controllers/     # Business logic
│   ├── middleware/
│   │   └── auth.js      # requireAuth middleware
│   ├── migrations/      # Sequelize migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routers with JSDoc
│   ├── seeders/         # Demo data
│   ├── app.js           # Express app setup
│   └── server.js        # DB connect + listen
├── .env.example
├── .sequelizerc
├── package.json
└── render.yaml
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a strong SESSION_SECRET
```

### 3. Create the database

```bash
createdb photo_caption_contest
# or: psql -c "CREATE DATABASE photo_caption_contest;"
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. (Optional) Seed demo data

```bash
npm run db:seed
```

### 6. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at **http://localhost:3000**  
Swagger docs at **http://localhost:3000/api-docs**

---

## API Endpoints

### Authentication

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in | No |
| POST | `/api/auth/logout` | Log out | No |
| GET | `/api/auth/me` | Get current user | No |

### Images

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/images` | Get all images | No |
| GET | `/api/images/:id` | Get image + captions | No |
| POST | `/api/images/:id/captions` | Add a caption | **Yes** |

### Captions

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| DELETE | `/api/captions/:id` | Delete your caption | **Yes** |

---

## Database Schema

```
Users
  id          SERIAL PK
  username    VARCHAR(50) UNIQUE NOT NULL
  email       VARCHAR(255) UNIQUE NOT NULL
  password    VARCHAR(255) NOT NULL  (bcrypt hashed)
  createdAt   TIMESTAMP
  updatedAt   TIMESTAMP

Images
  id          SERIAL PK
  title       VARCHAR(255) NOT NULL
  description TEXT
  filename    VARCHAR(255) UNIQUE NOT NULL
  url         VARCHAR(500) NOT NULL
  createdAt   TIMESTAMP
  updatedAt   TIMESTAMP

Captions
  id          SERIAL PK
  text        TEXT NOT NULL
  userId      INTEGER FK → Users.id
  imageId     INTEGER FK → Images.id
  createdAt   TIMESTAMP
  updatedAt   TIMESTAMP
```

---

## Caching

Image responses (`GET /api/images` and `GET /api/images/:id`) are cached in memory using `node-cache`. The cache is automatically **invalidated** when a caption is added or deleted. TTL is configurable via `CACHE_TTL` in `.env` (default: 3600 seconds / 1 hour).

---

## Deploying to Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New → Blueprint**.
3. Connect your repository — Render will read `render.yaml` and provision both the web service and the PostgreSQL database automatically.
4. Set `SESSION_SECRET` as a secret environment variable in the Render dashboard.

---

## Postman Testing Examples

**Register**
```json
POST /api/auth/register
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

**Add a caption** *(must be logged in — session cookie is handled automatically by Postman)*
```json
POST /api/images/1/captions
{
  "text": "When life gives you mountains, take pictures."
}
```