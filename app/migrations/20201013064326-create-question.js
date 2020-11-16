/* eslint-disable no-unused-vars */
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      QuisionerHeaderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      InputTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      question_name: {
        type: Sequelize.STRING
      },
      OptionGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
    await queryInterface.addConstraint("Questions", {
      fields: ['QuisionerHeaderId'],
      type: 'foreign key',
      name: 'QuisionerHeaders_fkey_Question_constraint',
      references: { //!Required field
        table: 'Quisioner_headers',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
    await queryInterface.addConstraint("Questions", {
      fields: ['InputTypeId'],
      type: 'foreign key',
      name: 'InputTypes_fkey_Question_constraint',
      references: { //!Required field
        table: 'Input_types',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
    await queryInterface.addConstraint("Questions", {
      fields: ['OptionGroupId'],
      type: 'foreign key',
      name: 'OptionGroups_fkey_Question_constraint',
      references: { //!Required field
        table: 'Option_groups',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Questions");
  }
};