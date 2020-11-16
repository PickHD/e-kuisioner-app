const router = require("express").Router();

const auth = require("./auth.route");
const users = require("./user.route");
const admin = require("./admin.route");

//!BASE ROUTES
router.get("/", (req, res) => {
  res.render("index", {
    msg: "",
    reqFooter:false,
    errorAlert: false,
    getTitle:"E-Kuisioner || Selamat Datang !"
  });
});

//!NESTED ROUTES
router.use("/auth", auth);
router.use("/users", users);
router.use("/admin", admin);

module.exports = router;