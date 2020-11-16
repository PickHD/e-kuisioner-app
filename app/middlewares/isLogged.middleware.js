const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.render("auth/loginPage", {
    msg: "Maaf, Anda Harus Login Terlebih Dahulu",
    errorAlert: false,
    reqFooter: false,
    warningAlert: true,
    successAlert: false,
    getTitle: "E-Kuisioner || Masuk"
  });
};

module.exports = { isLogged };