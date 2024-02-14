const { Router } = require("express");
const express = require("express");
const gameController = require("./gameController");
const Constants = require('../../config/constant');
const middleware = require('../../middleware');
const gameMiddleware = require('../game/gameMiddleware');
const gameValidate = require('../game/gameModel');
const questionMiddleware = require('../question/questionMiddleware');

const router = express.Router();

router.post(Constants.ADDGAME, middleware.authenticateUser, gameValidate.addUserValidate,  gameMiddleware.checkUser ,gameController.addGame);

router.post(Constants.JOINGAME, gameValidate.addMemberValidate ,gameMiddleware.checkCode, gameController.joinGame);

router.post(Constants.LOBBYDETAIL, gameValidate.joinUserValidate, gameController.getLobbyDetail);

router.post(Constants.STARTGAME, middleware.authenticateUser, gameValidate.joinUserValidate, gameMiddleware.getAllGameById, gameController.startGame);

router.post(Constants.FINISHPROJECT, middleware.authenticateUser, gameValidate.joinUserValidate, gameMiddleware.getAllGameById, gameController.finishProject);

router.post(Constants.GETALLGAMES, middleware.authenticateUser, gameMiddleware.getAllGame, gameController.getAllGameDetails);

router.post(Constants.UPDATEGAME, middleware.authenticateUser, gameValidate.joinUserValidate, gameMiddleware.getAllGameById ,gameController.updateGame );

router.delete(Constants.DELETEGAME, middleware.authenticateUser, gameValidate.joinUserValidate, gameController.deleteGame);

router.post(Constants.GETGAMEBYID, middleware.authenticateUser, gameValidate.joinUserValidate, gameMiddleware.getAllGameById, gameController.getGameDetailById);

router.post(Constants.GETGAMESTUDENT, gameValidate.joinUserValidate, gameMiddleware.getAllGameByIdStudent, gameController.getGameDetailStudent);

router.post(Constants.SAVE_QUE_ANS, gameMiddleware.checkJoinGameUser, gameController.saveQuestionAnswer);

router.post(Constants.CREATEDUPLICATE, middleware.authenticateUser, gameValidate.createDuplicateValidate, gameMiddleware.getAllGameById,  gameController.createDuplicate);

router.post(Constants.GETGAMERESULT, middleware.authenticateUser, gameValidate.joinUserValidate, gameMiddleware.getAllGameById, gameController.getgameResult);

router.post(Constants.GETSTUDENTRESULT, gameValidate.getResult, gameMiddleware.getAllGameById, gameController.getStudentResult);

router.post(Constants.GETGAMESTATUS, gameValidate.joinUserValidate, gameMiddleware.getGameStatus, gameController.getGameStatus);

router.post(Constants.ADDWINPOINT, gameValidate.gameMemberValidate, gameMiddleware.checkJoinGameUser, gameController.addWinPoint);

router.post(Constants.GETSAVEQUEANS, gameValidate.gameQueAnsValidate, gameMiddleware.checkUserGame, gameMiddleware.checkquestionGame, gameController.getSaveQueAns);

router.post(Constants.UPDATESAVEQUQANS, gameValidate.gameQueAnsValidate , gameMiddleware.checkUserGame, gameMiddleware.checkquestionGame, gameController.updateQueAns);

router.post(Constants.GETRESULT, gameValidate.getResult, gameMiddleware.checkgameResult , gameMiddleware.checkUserGame, gameController.getResult);

router.post(Constants.FINISHGAME, gameValidate.joinUserValidate, gameMiddleware.getAllGameById, gameController.finishGame);

router.get(Constants.TOTALGAMEMEMBER, gameController.totalGameMember);

exports.gameRoute = router;