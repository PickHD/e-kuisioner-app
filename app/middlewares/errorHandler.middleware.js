const errorHandler = (err, req, res, next) => {
  let errorsArray = [];
  errorsArray.push(err.message);

  return res.render("error_handling/alertErrorHandler", {
    msg: errorsArray,
    errorAlert: true,
    reqFooter: false,
    getTitle: "E-Kuisioner || Oops!"
  });

};

module.exports = errorHandler;