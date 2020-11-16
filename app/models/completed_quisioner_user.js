'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Completed_quisioner_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Completed_quisioner_users.init({
    UserId: DataTypes.INTEGER,
    QuisionerHeaderId: DataTypes.INTEGER,
    isDone: DataTypes.BOOLEAN,
    completedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Completed_quisioner_users',
  });
  return Completed_quisioner_users;
};