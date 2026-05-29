const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Photo Caption Contest API',
      version: '1.0.0',
      description:
        'REST API for a photo caption contest platform. Users can register, log in, browse images, and submit captions for each image. Authentication is required to submit captions.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Local development server',
        variables: {
          port: {
            default: '3000',
          },
        },
      },
      {
        url: 'https://your-app.onrender.com',
        description: 'Production server (Render)',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session cookie set after login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Image: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Mountain Sunrise' },
            description: {
              type: 'string',
              example: 'A breathtaking sunrise over a misty mountain range',
            },
            filename: { type: 'string', example: 'mountain-sunrise.jpg' },
            url: { type: 'string', example: '/images/mountain-sunrise.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Caption: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            text: { type: 'string', example: 'When life gives you mountains, take pictures.' },
            userId: { type: 'integer', example: 1 },
            imageId: { type: 'integer', example: 1 },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ImageWithCaptions: {
          allOf: [
            { $ref: '#/components/schemas/Image' },
            {
              type: 'object',
              properties: {
                captions: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Caption' },
                },
              },
            },
          ],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful.' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred.' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
