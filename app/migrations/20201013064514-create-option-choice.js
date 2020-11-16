"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Option_choices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OptionGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      option_choice_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint("Option_choices", {
      fields: ['OptionGroupId'],
      type: 'foreign key',
      name: 'OptionGroups_fkey_Option_choices_constraint',
      references: { //!Required field
        table: 'Option_groups',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
    await queryInterface.addConstraint("Option_choices", {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Users_fkey_Option_choices_constraint',
      references: { //!Required field
        table: 'Users',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Option_choices");
  }
};