const router = require("express").Router();

//!DEFINE CONTROLLER & MIDDLEWARE
const { dashboardPage, listUsersPage, viewUserPage, updateUserHandler, deleteUserHandler, listQuisionerPage, createHeaderHandler, createQuestionHandler, viewQuisionerPage, updateQuisionerHandler, deleteQuisionerHandler } = require("../controllers/admin.controller");
const { isLogged } = require("../middlewares/isLogged.middleware");
const { adminAccess } = require("../middlewares/adminAccess.middleware");

router.get("/dashboard", [isLogged, adminAccess], dashboardPage);

//! MANAGE USER SECTION 
router.get("/manage/users", [isLogged, adminAccess], listUsersPage);
router.get("/manage/users/page-:page", [isLogged, adminAccess], listUsersPage);
router.get("/manage/user/:id", [isLogged, adminAccess], viewUserPage);
router.post("/manage/user/:id", [isLogged, adminAccess], updateUserHandler);
router.get("/manage/user/delete/:id", [isLogged, adminAccess], deleteUserHandler);
//! END MANAGE USER SECTION 

//! MANAGE QUISIONER SECTION
router.get("/manage/quisioners", [isLogged, adminAccess], listQuisionerPage);
router.get("/manage/quisioners/page-:page", [isLogged, adminAccess], listQuisionerPage);
router.post("/manage/quisioner/create-header", [isLogged, adminAccess], createHeaderHandler);
router.post("/manage/quisioner/create-question/:headerId", [isLogged, adminAccess], createQuestionHandler);
router.get("/manage/quisioner/:id", [isLogged, adminAccess], viewQuisionerPage);
router.post("/manage/quisioner/:id", [isLogged, adminAccess], updateQuisionerHandler);
router.get("/manage/quisioner/delete/:id", [isLogged, adminAccess], deleteQuisionerHandler);
//! END MANAGE QUISIONER SECTION

module.exports = router;