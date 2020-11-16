"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option_groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Option_groups.init({
    option_group_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Option_groups",
  });
  return Option_groups;
};