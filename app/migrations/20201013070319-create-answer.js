"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Answers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      QuestionOptionId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addConstraint("Answers", {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Users_fkey_Answers_constraint',
      references: { //!Required field
        table: 'Users',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
    await queryInterface.addConstraint("Answers", {
      fields: ['QuestionOptionId'],
      type: 'foreign key',
      name: 'QuestionOptions_fkey_Answers_constraint',
      references: { //!Required field
        table: 'Question_options',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Answers");
  }
};