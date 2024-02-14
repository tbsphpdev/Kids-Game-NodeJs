const ResponseBuilder = require('../../helper/responseBuilder');
const Constants = require('../../config/constant');
const gameModel = require('../game/gameUtils');
const crypto = require('crypto');
const moment = require('moment');
const { isEmpty } = require('lodash');
const questionModel = require('../question/questionUtils');

const createDuplicate = async (req, res) => {
    if(!isEmpty(req.gameData)){
        var {_id, ...tempGame} = req.gameData;
        // tempGame.public = 1;
        tempGame.userId = req.user._id;
        // tempGame.gameCode = crypto.randomBytes(10).toString('hex')
        tempGame.gameCode =  Math.floor(Math.random() * 100000000);
        // tempGame.title = tempGame.title
        //Add Game
        const gameData = await gameModel.create(tempGame);
        const questions = await gameModel.getQuestion(_id);
        // ADD Game  gameId
        for(var i = 0; i <questions.result.length; i++ )
        {
            //Add Questions
            var {_id,  option, ...tempQuestion } = questions.result[i];
            tempQuestion.gameId = gameData.result.gameId;
            const question = await questionModel.create(tempQuestion);
            //  ADD Question quesId
            for(var j = 0; j <option.length; j++)
            {
                // Add Options
                option[j].questionId = question.result.questionId;
                const optionData = await questionModel.createAnswer(option[j]);        
            }
        }
        // return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(gameData.result, req.t("SUCCESS")));
    } else {
        // return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
    }
}

module.exports = {
    //Create Game
    addGame : async (req, res) => {
        const gameDetail = {
            userId : req.body.userId,
            media_id : req.body.mediaId,
            title: req.body.title,
            short_desc: req.body.shortDesc ? req.body.shortDesc : '',
            description: req.body.description,
            coverImage: 0,
            startTime : new Date().toISOString(),
            // gamecode : crypto.randomBytes(10).toString('hex'),
            gamecode : Math.floor(Math.random() * 100000000),
            createdAt : Constants.CURRENT_DATE,

        }
        
        const result = await gameModel.create(gameDetail);
        if(result && result.result && result.result.gameId){
            res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...gameDetail, ...result.result}, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }   
    },

    //Add Game member 
    joinGame : async (req, res) => {
        const memberDetail = {
            gameId : req.game._id,
            username : req.body.username,
            createdAt : Constants.CURRENT_DATE 
        } 
        var currTime = new Date();
        var InputTime = new Date(req.game.startTime)
        const diff =  currTime - InputTime;
        const min = parseInt(Math.floor(diff/1e3)/60);
        // return console.log(currTime, InputTime, diff, min );
        if(min<-10){
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_JOINING_CLOSED")));
        }
        else if (req.game.status == 2){
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_CLOSED")));
        }
        else 
        {
            const result = await gameModel.addGameMember(memberDetail);
            if(result && result.result && result.result.memberId){
                return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...memberDetail, ...result.result}, req.t("SUCCESS")));
            }else{
                return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
            }
        } 
    },

    //Get lobby details
    getLobbyDetail : async (req, res) => {
        const gameId = req.body.gameId; 
        const result = await gameModel.getGameDetails(gameId);
        const userData = await gameModel.getJoinUserDetails(gameId);
        if(result && userData){   
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({ 'gameData' : result, userData }, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Start Game
    startGame : async (req, res) => {
        const gameData = {
            status : 1,
            _id : req.body.gameId,
            startTime : new Date().toISOString(),
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        const result = await gameModel.updateGame(gameData, gameData._id);
        if (result && result.result ) {
            if(req.gameData.timeLimit != 0){
                gameData.status = 2;
                gameData.gameCode = '',
                gameData.updatedAt = moment().format(Constants.LAST_UPDATE)
                setTimeout(async () => {
                    const result = await gameModel.updateGame(gameData, gameData._id);
                    console.log("game ended", req.gameData.timeLimit*60*1000);
                }, (req.gameData.timeLimit*60*1000) + 30 );
            }
            createDuplicate(req, res)
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Finish Project
    finishProject : async (req, res) => {
         const gameData = {
            title :  req.body.title ? req.body.title : req.gameData.title,
            startTime : req.body.startTime ? req.body.startTime : req.gameData.startTime,
            short_desc: req.body.shortDesc ? req.body.shortDesc : req.gameData.short_desc,
            description : req.body.description ? req.body.description : req.gameData.description,
            timeLimit : req.gameData.timeLimit,
            backgroundMusic : req.body.backgroundMusic ? req.body.backgroundMusic : req.gameData.backgroundMusic,
            coverImage : req.body.coverImage ? req.body.coverImage : req.gameData.coverImage,
            lobbyVideo : req.body.lobbyVideo ? req.body.lobbyVideo : req.gameData.lobbyVideo,
            public : req.body.public ? req.body.public : 0,
            _id : req.body.gameId,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        if(!isNaN(req.body.timeLimit))
        {
            if(req.body.timeLimit!==null)
            {
                gameData.timeLimit=req.body.timeLimit;
            }
        }
        const result = await gameModel.finishProject(gameData, gameData._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Get All Game details
    getAllGameDetails : async (req, res) => {
        if (!isEmpty(req.game)) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(req.game, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Update Game Details 
    updateGame : async (req, res) => {
       const gameData = {
            media_id : req.body.mediaId ? req.body.mediaId : req.gameData.media_id,
            public : req.body.public ? req.body.public : 0,
            // gamecode : crypto.randomBytes(10).toString('hex'),
            gameCode :  Math.floor(Math.random() * 100000000),
            _id : req.body.gameId,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        } 
        const result = await gameModel.updateGame(gameData, gameData._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Delete game
    deleteGame : async (req, res) => {
        const gameData = {
            _id : req.body.gameId,
            delete_flag : 1,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        const result = await gameModel.updateGame(gameData, gameData._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    }, 

    //Get Game Detail by GameId
    getGameDetailById : async (req, res) => {
        if (!isEmpty(req.gameData)) {
            const question = await gameModel.getQuestion(req.gameData._id);
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...req.gameData, "question" : question.result}, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Save question answer
    saveQuestionAnswer : async (req, res) => {
        const saveQuesAns = {
            memberId : req.GameMember._id,
            questionId : req.body.questionId,
            answer : JSON.stringify(req.body.answer),
            result : req.body.result ? req.body.result : 0,
            createdAt : Constants.CURRENT_DATE
        }
        const result = await gameModel.saveQuesAns(saveQuesAns);
        if(result && result.result && result.result.questionanswerId){
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...saveQuesAns, ...result.result}, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }   
    },

    //Create Duplicate Data
    createDuplicate : async (req, res) => {
        if(!isEmpty(req.gameData)){
            var {_id, ...tempGame} = req.gameData;
            tempGame.public = 1;
            tempGame.userId = req.user._id;
            // tempGame.gameCode = crypto.randomBytes(10).toString('hex'),
            // tempGame.title = tempGame.title + '(copy)'
            tempGame.gameCode =  Math.floor(Math.random() * 100000000)
            tempGame.title = req.body.title

            //Add Game
            const gameData = await gameModel.create(tempGame);
            const questions = await gameModel.getQuestion(_id);
            // ADD Game  gameId
            for(var i = 0; i <questions.result.length; i++ )
            {
                //Add Questions
                var {_id,  option, ...tempQuestion } = questions.result[i];
                tempQuestion.gameId = gameData.result.gameId;
                const question = await questionModel.create(tempQuestion);
                //  ADD Question quesId
                for(var j = 0; j <option.length; j++)
                {
                    // Add Options
                    option[j].questionId = question.result.questionId;
                    const optionData = await questionModel.createAnswer(option[j]);        
                }
            }
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(gameData.result, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Get Game Detail for student
    getGameDetailStudent : async (req, res) => {
        if (!isEmpty(req.gameData)) {
            const question = await gameModel.getQuestionStudent(req.gameData._id);
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...req.gameData, "question" : question.result}, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //get Game Result
    getgameResult : async (req, res) => {
        if (!isEmpty(req.user)) {
            const count = await gameModel.getCountUser(req.gameData._id);

            const question = await gameModel.getQuestion(req.gameData._id);

            const questionArr = await question.result.filter((obj)=>{
                return  obj.type==3 ||((obj.type==1||obj.type==2) && obj.option.length==4);
            })    
            // console.log("QuestionDetail:", questionArr, questionArr.length)
            const gameData = {
                'userId' : req.gameData.userId,
                'title' : req.gameData.title,
                'short_desc' : req.gameData.short_desc,
                'description' : req.gameData.description,
                'startTime' : req.gameData.startTime,
                'timeLimit' : req.gameData.timeLimit,
                "totalQuestion" : questionArr.length,
                "question" : question.result
            }
            // console.log(gameData);
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...gameData, "user" : count.result}, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //get Game Status
    getGameStatus : async (req, res) => {
        if (!isEmpty(req.gameData)) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(req.gameData, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Add User Win Point
    addWinPoint : async (req, res) => {
        const gameData = {
            winningPoint : req.body.winningPoint ? req.body.winningPoint : 0,
            timeSpent : req.body.timeSpent ? req.body.timeSpent : '',
            _id : req.GameMember._id,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        const result = await gameModel.addWinPoint(gameData, gameData._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(gameData, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Get Save Question-Answer
    getSaveQueAns : async (req, res) => {
        const result = await gameModel.getQuestionAnswer(req.gameData.memberId, req.Gamequestion.questionId);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Update Save Question-Answer
    updateQueAns : async (req, res) => {
        const queAnsData = {
            answer : req.body.answer ? JSON.stringify(req.body.answer) : req.gameData.answer,
            result : req.body.result ? req.body.result : req.gameData.result,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        const result = await gameModel.updateQueAns(queAnsData, req.body.memberId, req.body.questionId);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }  
    },

    //get Result
    getResult : async (req, res) => {
        const result = await gameModel.getResult(req.question.gameId, req.gameData.memberId);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }  
    },

    //finish Game
    finishGame : async (req, res) => {
        const gameData = {
            status : 2,
            _id : req.body.gameId,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        const result = await gameModel.updateGame(gameData, gameData._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Total Join Game Member 
    totalGameMember : async (req, res) => {
        const result = await gameModel.totalGameMember();
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //get Game Result
    getStudentResult : async (req, res) => {
        if (!isEmpty(req.gameData)) {
            const tempStAnswer = await gameModel.getStudentAnswer(req.body.memberId);
            const question = await gameModel.getQuestionStudent(req.gameData._id);
            const tempStDetail = await gameModel.getStudentDetail(req.body.memberId);
            const gameData = {
                'userId' : req.gameData.userId,
                'title' : req.gameData.title,
                'short_desc' : req.gameData.short_desc,
                'description' : req.gameData.description,
                'startTime' : req.gameData.startTime,
                'timeLimit' : req.gameData.timeLimit,
                "question" : question.result,
                "playerDetails" : tempStDetail.result
            }
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...gameData, "userAttempts" : tempStAnswer.result}, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },
}