const { Router } = require("express");
const express = require("express");
const mediaController = require("./mediaController");
const Constants = require('../../config/constant');
const middleware = require('../../middleware');
const mediaMiddleware = require('../media/mediaMiddleware');

const router = express.Router();

router.post(Constants.ADDMEDIA, middleware.authenticateUser, mediaController.addMedia);

router.post(Constants.GETMEDIA, mediaMiddleware.ImageList, mediaController.getImageList);

exports.mediaRoute = router;