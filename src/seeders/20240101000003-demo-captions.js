'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Captions', [
      {
        text: 'Where the day begins its golden journey',
        userId: 1,
        imageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'Nature's alarm clock, no snooze button available',
        userId: 2,
        imageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'A million stories lit up for the night',
        userId: 1,
        imageId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'The city never sleeps, and neither do its lights',
        userId: 3,
        imageId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'The sky meets the sea in perfect harmony',
        userId: 2,
        imageId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'Every ending is just a beginning in disguise',
        userId: 3,
        imageId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Captions', null, {});
  },
};
