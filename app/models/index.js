"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

//!CREATE OBJECT DB 
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;

  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

//! BIND MODEL HERE =====================
db.users = require("./user")(sequelize, Sequelize);
db.tokens = require("./token")(sequelize, Sequelize);
db.option_groups = require("./option_groups")(sequelize, Sequelize);
db.answers = require("./answer")(sequelize, Sequelize);
db.input_types = require("./input_types")(sequelize, Sequelize);
db.option_choices = require("./option_choice")(sequelize, Sequelize);
db.question_options = require("./question_option")(sequelize, Sequelize);
db.questions = require("./question")(sequelize, Sequelize);
db.quisioner_headers = require("./quisioner_headers")(sequelize, Sequelize);
db.completed_quisioner_users = require("./completed_quisioner_user")(sequelize, Sequelize);

//! ASSOCIATION HERE =====================
db.users.hasMany(db.tokens, {
  onDelete: "CASCADE",
});
db.tokens.belongsTo(db.users);

db.quisioner_headers.hasMany(db.questions, {
  onDelete: "CASCADE",
});
db.questions.belongsTo(db.quisioner_headers);

db.input_types.hasMany(db.questions, {
  onDelete: "CASCADE",
});
db.questions.belongsTo(db.input_types);

db.option_groups.hasMany(db.questions, {
  onDelete: "CASCADE",
});
db.questions.belongsTo(db.option_groups);

db.questions.hasMany(db.question_options, {
  onDelete: "CASCADE",
});
db.question_options.belongsTo(db.questions);

db.option_choices.hasMany(db.question_options, {
  onDelete: "CASCADE",
});
db.question_options.belongsTo(db.option_choices);

db.users.hasMany(db.option_choices, {
  onDelete: "CASCADE",
});
db.option_choices.belongsTo(db.users);

db.option_groups.hasMany(db.option_choices, {
  onDelete: "CASCADE",
});
db.option_choices.belongsTo(db.option_groups);

db.question_options.hasMany(db.answers, {
  onDelete: "CASCADE",
});
db.answers.belongsTo(db.question_options);

db.users.hasMany(db.answers, {
  onDelete: "CASCADE",
});
db.answers.belongsTo(db.users);

db.users.hasMany(db.completed_quisioner_users, {
  onDelete: "CASCADE"
})
db.completed_quisioner_users.belongsTo(db.users);

db.quisioner_headers.hasMany(db.completed_quisioner_users, {
  onDelete: "CASCADE"
})
db.completed_quisioner_users.belongsTo(db.quisioner_headers);


module.exports = db;
