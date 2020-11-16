const router = require("express").Router();

//!DEFINE CONTROLLER & MIDDLEWARE
const { dashboardPage, quisionerPage, finishQuisionerHandler, profilePage, profileHandler, suspendPage, suspendHandler } = require("../controllers/user.controller");

const { isLogged } = require("../middlewares/isLogged.middleware");
const { suspendedUser } = require("../middlewares/suspendedUser.middleware");

router.get("/dashboard", [isLogged, suspendedUser], dashboardPage);

router.get("/profile/:first_name/:id", [isLogged, suspendedUser], profilePage);
router.post("/profile/:first_name/:id", [isLogged, suspendedUser], profileHandler);

router.get("/:first_name/:id/suspend-account", [isLogged, suspendedUser], suspendPage);
router.post("/:first_name/:id/suspend-account", [isLogged, suspendedUser], suspendHandler);

router.get("/quisioner/:getQuisionerTitle", [isLogged, suspendedUser], quisionerPage);
router.post("/quisioner/:getQuisionerTitle/finish", [isLogged, suspendedUser], finishQuisionerHandler);

module.exports = router;
