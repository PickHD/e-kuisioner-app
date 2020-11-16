"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quisioner_headers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Quisioner_headers.init({
    quisioner_title: DataTypes.STRING,
    quisioner_info: DataTypes.STRING,
  }, {
    sequelize,
    modelName: "Quisioner_headers",
  });
  return Quisioner_headers;
};