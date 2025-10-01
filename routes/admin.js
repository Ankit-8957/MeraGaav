const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, validateSchema, validateAdmin} = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { asyncWrap } = require("../middleware.js");
const {adminJoiSchema } = require("../schema.js");
const adminController = require("../controllers/admin.js");

router.get("/signup", adminController.adminSignup);
router.post("/signup", upload.single("image"),validateAdmin, asyncWrap(adminController.adminSignupPost));
router.get("/login", adminController.login);
router.post("/login", passport.authenticate('admin-local', { failureRedirect: '/Admin/login', failureFlash: true }), adminController.loginPost);
router.get("/loggedOut", adminController.loggedOut);
router.get("/dashboard", isLoggedIn, asyncWrap(adminController.dashboard));
router.get("/manageUser", isLoggedIn, asyncWrap(adminController.manageUser));
router.get("/complaints", isLoggedIn, asyncWrap(adminController.complaint));
router.get("/project", isLoggedIn, asyncWrap(adminController.project));
router.get("/project/new", isLoggedIn, asyncWrap(adminController.newProject));

router.post("/project/new", upload.array('project[image]'), asyncWrap(adminController.newProjectPost));
router.get("/budget", isLoggedIn, asyncWrap(adminController.budget));
router.get("/schema", isLoggedIn, asyncWrap(adminController.schema));
router.get("/schema/new", adminController.newSchema)
router.post("/schema/new", isLoggedIn,validateSchema, asyncWrap(adminController.newSchemaPost));
router.get("/schema/:id/edit", isLoggedIn, asyncWrap(adminController.editSchema));
router.put("/schema/:id/edit", isLoggedIn, asyncWrap(adminController.editSchemaPut));
router.delete("/schema/:id/delete", isLoggedIn, asyncWrap(adminController.deleteSchema));
router.get("/budget/:id/budgetDetail", isLoggedIn, asyncWrap(adminController.budgetDetails));
router.get("/project/:id/projectDetail", isLoggedIn, asyncWrap(adminController.projectDetails));
router.post("/project/:proId/milestone/:mileId/toggle", isLoggedIn, asyncWrap(adminController.milestone));
router.patch("/complaints/:id/update", isLoggedIn, asyncWrap(adminController.updateComplaint));
router.patch("/users/:id/approve", isLoggedIn, asyncWrap(adminController.approveUser));
router.delete("/users/:id/delete", isLoggedIn, asyncWrap(adminController.deleteUser));
router.get("/users/:id/details", isLoggedIn, asyncWrap(adminController.userDetails));

module.exports = router;