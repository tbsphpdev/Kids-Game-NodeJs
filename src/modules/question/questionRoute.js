const { Router } = require("express");
const express = require("express");
const questionController = require("./questionController");
const Constants = require('../../config/constant');
const middleware = require('../../middleware');
const questionValidate = require('../question/questionModel');
const questionMiddleware = require('../question/questionMiddleware');

const router = express.Router();

router.post(Constants.ADDQUESTION, middleware.authenticateUser, questionValidate.addGameValidate, questionController.addQuestion);

router.post(Constants.GETQUESTION, middleware.authenticateUser, questionValidate.deleteQuestion, questionMiddleware.questionList, questionController.getQuestion);

router.post(Constants.UPDATEQUESTION, middleware.authenticateUser, questionValidate.deleteQuestion, questionMiddleware.questionList, questionController.updateQuestion);

router.delete(Constants.DELETEQUESTION, middleware.authenticateUser, questionMiddleware.checkQuestion, questionValidate.deleteQuestion, questionController.deleteQuestion);

router.post(Constants.GETQUESTIONBYGAMEID, middleware.authenticateUser, questionValidate.getQuestionById,  questionMiddleware.getQuestionByGameId , questionController.getQuestionByGameId);

exports.questionRoute = router;