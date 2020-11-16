const serverError = ((err, req, res, next) => {
  const sCode = res.statusCode;
  if (sCode > 500) {
    return res.status(sCode).render("./error_handling/serverErrorPage", {
      msg: "",
      reqFooter: false,
      errorAlert: false,
      getTitle: "E-Kuisioner || Kesalahan Server"
    });
  } else {
    return next(err)
  }
})

module.exports = serverError;