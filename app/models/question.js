"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Question.init({
    QuisionerHeaderId: DataTypes.INTEGER,
    InputTypeId: DataTypes.INTEGER,
    question_name: DataTypes.STRING,
    OptionGroupId: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: "Question",
  });
  return Question;
};