const router = require("express").Router();

//!DEFINE CONTROLLER & MIDDLEWARE
const { getRegisterPage, registerHandler, waitingEmailPage, getVerifySuccessPage, reqTokenPage, reqTokenHandler, getLoginPage, loginHandler, forgotPassPage, forgotPassHandler, confirmForgotPass, resetPassHandler, verifyAccountHandler, logout } = require("../controllers/auth.controller");

//!REGISTER ROUTE
router.get("/register", getRegisterPage);
router.post("/register", registerHandler);
router.get("/verification-account", verifyAccountHandler);
router.get("/verification-success", getVerifySuccessPage);

//!WAIT EMAIL ROUTE 
router.get("/waiting-email", waitingEmailPage);

//!REQUEST TOKEN ROUTE
router.get("/request-token", reqTokenPage);
router.post("/request-token", reqTokenHandler);

//!LOGIN ROUTE
router.get("/login", getLoginPage);
router.post("/login", loginHandler);
router.get("/forgot-password", forgotPassPage);
router.post("/forgot-password", forgotPassHandler);
router.get("/confirm-forgot-password", confirmForgotPass);
router.post("/reset-password", resetPassHandler);

//!LOGOUT ROUTE 
router.get("/logout", logout);

module.exports = router;