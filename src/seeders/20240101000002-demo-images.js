'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Images', [
      {
        title: 'Mountain Sunrise',
        description: 'A breathtaking sunrise over a misty mountain range',
        filename: 'mountain-sunrise.jpg',
        url: '/images/mountain-sunrise.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'City Lights at Night',
        description: 'A vibrant city skyline illuminated at night',
        filename: 'city-lights.jpg',
        url: '/images/city-lights.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Ocean Sunset',
        description: 'Golden hour over a calm ocean horizon',
        filename: 'ocean-sunset.jpg',
        url: '/images/ocean-sunset.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Forest Path',
        description: 'A winding path disappearing into a dense forest',
        filename: 'forest-path.jpg',
        url: '/images/forest-path.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Desert Dunes',
        description: 'Sweeping sand dunes under a blazing afternoon sun',
        filename: 'desert-dunes.jpg',
        url: '/images/desert-dunes.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Snowy Village',
        description: 'A quaint village blanketed in fresh winter snow',
        filename: 'snowy-village.jpg',
        url: '/images/snowy-village.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Images', null, {});
  },
};
