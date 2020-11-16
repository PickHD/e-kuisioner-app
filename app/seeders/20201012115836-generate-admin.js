"use strict";
const bCrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [{
      first_name: "E-Kuisioner",
      last_name: "Admin",
      email: "noreply.ekuisionerteam@gmail.com",
      address: "Komp Rancamas Blok E no 5 RT/RW 001/019, Rancamanyar Baleendah 40375",
      religion: "Islam",
      gender: "L",
      password_hashed: await bCrypt.hash("Adminekuisioner40252", 10),
      phone: "085314329936",
      district: "Baleendah",
      location: Sequelize.fn("ST_GeomFromText", "POINT(-7.0183774 107.6305706)"),
      zipCode: "40375",
      isActive: true,
      isVerified: true,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
