const checkSession = ((req, res, next) => {
  if (!req.session) {
    return res.render("auth/loginPage", {
      msg: "Maaf,Sesi Anda Sudah Berakhir,Dimohon Untuk Login Kembali",
      errorAlert: false,
      reqFooter: false,
      warningAlert: true,
      successAlert: false,
      getTitle: "E-Kuisioner || Masuk"
    });
  }
  next();
});

module.exports = checkSession;