"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question_option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question_option.init({
    QuestionId: DataTypes.INTEGER,
    OptionChoiceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: "Question_option",
  });
  return Question_option;
};