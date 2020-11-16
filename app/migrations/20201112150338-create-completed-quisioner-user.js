'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Completed_quisioner_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      QuisionerHeaderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isDone: {
        type: Sequelize.BOOLEAN
      },
      completedAt: {
        type: Sequelize.DATE,
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
    }),
      await queryInterface.addConstraint("Completed_quisioner_users", {
        fields: ['UserId'],
        type: 'foreign key',
        name: 'Users_fkey_Cqu_constraint',
        references: { //!Required field
          table: 'Users',
          field: 'id',
          schema: 'public'
        },
        onDelete: 'cascade'
      });
    await queryInterface.addConstraint("Completed_quisioner_users", {
      fields: ['QuisionerHeaderId'],
      type: 'foreign key',
      name: 'Quisioner_headers_fkey_Cqu_constraint',
      references: { //!Required field
        table: 'Quisioner_headers',
        field: 'id',
        schema: 'public'
      },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Completed_quisioner_users');
  }
};