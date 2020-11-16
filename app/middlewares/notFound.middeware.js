const notFound = (req, res, next) => {
  if (!req.route) {
    res.statusCode = 404;
    return res.render("./error_handling/routeNotFoundPage", {
      msg: "",
      errorAlert: false,
      reqFooter: true,
      getTitle: "E-Kuisioner || Halaman Tidak Ditemukan"
    });
  }
};

module.exports = notFound;