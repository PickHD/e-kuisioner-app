const { users } = require("../models");

const suspendedUser = async (req, res, next) => {
  let errors;
  try {
    const getUser = await users.findOne({
      where: {
        id: req.user.id
      }
    });
    if (getUser.isActive === false) {
      req.session.destroy();
      return res.render("error_handling/suspendedUserPage", {
        msg: "",
        reqFooter: true,
        errorAlert: false,
        getTitle: "E-Kuisioner || Akun Tidak Aktif"
      });
    }
    next();
  } catch (error) {
    errors = new Error(error);
    next(errors);
  }
};

module.exports = { suspendedUser };