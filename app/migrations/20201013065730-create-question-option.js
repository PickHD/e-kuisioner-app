"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Question_options", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      QuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      OptionChoiceId: {
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
    await queryInterface.addConstraint("Question_options", {
      fields: ['QuestionId'],
      type: 'foreign key',
      name: 'Questions_fkey_Question_options_constraint',
      references: { //!Required field
        table: 'Questions',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
    await queryInterface.addConstraint("Question_options", {
      fields: ['OptionChoiceId'],
      type: 'foreign key',
      name: 'OptionChoices_fkey_Question_options_constraint',
      references: { //!Required field
        table: 'Option_choices',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Question_options");
  }
};