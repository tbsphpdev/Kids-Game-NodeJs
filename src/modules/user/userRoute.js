
// Import only what we need from express
const { Router } = require("express");
const express = require("express");
const userController = require("./userController");
const userMiddleware = require("./userMiddleware");
const userValidate = require('../user/userModel');
const middleware = require('../../middleware');
const Constants = require('../../config/constant');

const router = express.Router();

router.post(Constants.REGISTER, userValidate.signup , userMiddleware.checkForUniqueEmail, userController.register);

router.post(Constants.LOGIN, userValidate.login, userMiddleware.checkForValidEmail, userController.login);

router.post(Constants.FORGOTPASSWORD, userValidate.forgotPasswordModel, userMiddleware.checkForValidEmail, userController.forgotPassword);

router.post(Constants.RESETPASSWORD, middleware.authenticateUser, userValidate.resetPasswordModel, userController.resetPassword);

router.post(Constants.CHANGEPASSWORD, middleware.authenticateUser, userValidate.passwordModel, userMiddleware.checkPassword, userController.changePassword);

router.get(Constants.GETPROFILE, middleware.authenticateUser, userController.getProfile);

router.post(Constants.UPDATEPROFILE, middleware.authenticateUser, userController.updateProfile);

router.get(Constants.VERIFYTOKEN, middleware.authenticateUser, userController.updateTokenStatus);

router.post(Constants.ADMINLOGIN, userValidate.login, userMiddleware.checkForValidAdminEmail, userController.adminLogin);

router.get(Constants.COUNTDETAILS, userController.totalDetail);

exports.UserRoute = router;
