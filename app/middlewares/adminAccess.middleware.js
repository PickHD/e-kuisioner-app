const { users } = require("../models");

const adminAccess = async (req, res, next) => {
  let errors;
  try {
    const getUser = await users.findOne({
      where: {
        id: req.user.id
      }
    });
    if (getUser.isAdmin===false) {
      res.statusCode = 403;
      errors = new Error("Maaf, Hanya Admin Yang Bisa Mengakses Rute Ini");
      return next(errors);
    }
    next();
  } catch (error) {
    errors = new Error(error);
    next(errors);
  }
};

module.exports = { adminAccess };