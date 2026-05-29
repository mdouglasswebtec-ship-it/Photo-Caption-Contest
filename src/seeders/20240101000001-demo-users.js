'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const hashedPasswords = await Promise.all([
      bcrypt.hash('Password123!', 12),
      bcrypt.hash('Password123!', 12),
      bcrypt.hash('Password123!', 12),
    ]);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'alice',
        email: 'alice@example.com',
        password: hashedPasswords[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: hashedPasswords[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        password: hashedPasswords[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
