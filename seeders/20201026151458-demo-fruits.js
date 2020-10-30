"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Fruits', [
      {
	  name:'apple',
	  color: 'red',
	  readyToEat: true,
	  userId: 1,
      },
      {
	  name:'pear',
	  color: 'green',
	  readyToEat: false,
	  userId: 2,
      },
      {
	  name:'banana',
	  color: 'yellow',
	  readyToEat: true,
	  userId: 3,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Fruits', null, {});
    */
	}
};