"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Input_types", [
      {
        input_type_name: "Radio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
      await queryInterface.bulkInsert("Option_groups", [
        {
          option_group_name: "Setuju - Tidak Setuju",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Input_types", null, {});
    await queryInterface.bulkDelete("Option_groups", null, {});
  }
};
