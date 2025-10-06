const express = require("express");
const router = express.Router();
const passport = require("passport");

const { isLoggedIn } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { route } = require("./admin.js");

const {asyncWrap,validateUser,validateComplaint} = require("../middleware.js");

const userController = require("../controllers/user.js");


router.get("/signup", asyncWrap(userController.signup));

router.post("/signup",upload.single("image"),validateUser, asyncWrap(userController.signupPost));

router.get("/login", userController.login);

router.post("/login", passport.authenticate("user-local", { failureRedirect: '/user/login', failureFlash: true }), userController.loginPost);

router.get("/loggedOut", userController.loggedOut);

router.get("/forgot-password", userController.forgetPass);

router.post("/forgot-password", userController.forgetPassPost);

router.get("/dashboard", isLoggedIn, asyncWrap(userController.dashboard));

router.get("/project", isLoggedIn,asyncWrap(userController.project));

router.get("/budget", isLoggedIn, asyncWrap(userController.budget));

router.get("/complaint",isLoggedIn,asyncWrap(userController.complaint));

router.post("/complaint",validateComplaint,asyncWrap(userController.complaintPost));

router.get("/schema",isLoggedIn,asyncWrap(userController.schema));

router.get("/reset-password/:token", userController.resetPass);

router.post("/reset-password/:token", userController.resetPassPost);

router.get("/budget/:id/budgetDetail",isLoggedIn,asyncWrap(userController.budgetDetail));

router.get("/project/:id/projectDetail",isLoggedIn,asyncWrap( userController.projectDetail));

router.post("/project/:id/comment", isLoggedIn, asyncWrap(userController.comment));

module.exports = router;