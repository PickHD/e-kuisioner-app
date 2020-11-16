"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Input_types extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     
    }
  }
  Input_types.init({
    input_type_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Input_types",
  });
  return Input_types;
};