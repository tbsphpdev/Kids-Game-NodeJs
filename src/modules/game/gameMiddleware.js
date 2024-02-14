const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require('../../config/tables');
const Constants = require('../../config/constant');

module.exports = {
    checkCode : async (req, res, next) => {
        const gameCode = req.body.gameCode;
        const result = await sql.first(`${Table.Game.tablename}`,[Table.Game.ID,Table.Game.GAMECODE, Table.Game.STARTTIME, Table.Game.STATUS], `gameCode='${gameCode}'`);
        if (result) {
            req.game = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAMECODE_NOT_EXIST")));
        } 
    },
    checkUser : async (req, res, next) => {
        const userId = req.body.userId;
        const result = await sql.first(`${Table.User.tablename}`,[Table.User.ID], `_id='${userId}'`);
        if (result) {
            req.user = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_USER_NOT_FOUND")));
        } 

    },
    getAllGame : async (req, res, next) => {
        const userId = req.body.user_id;
        let result = '';
        if(userId)
          result = await sql.findAll(`${Table.Game.tablename}`, [Table.Game.ID, Table.Game.MEDIAID, Table.Game.USERID, Table.Game.TITLE, Table.Game.SHORTDESC, Table.Game.STARTTIME, Table.Game.DESCRIPTION, Table.Game.GAMECODE, Table.Game.TIMELIMIT, Table.Game.DELETEFLAG, Table.Game.MUSIC, Table.Game.IMAGE, Table.Game.VIDEO, Table.Game.PUBLIC, Table.Game.STATUS], `userId = ${userId} AND delete_flag = 0  order by _id desc`);
        else
            result = await sql.findAll(`${Table.Game.tablename}`, [Table.Game.ID, Table.Game.MEDIAID, Table.Game.USERID, Table.Game.TITLE, Table.Game.SHORTDESC, Table.Game.STARTTIME, Table.Game.DESCRIPTION, Table.Game.GAMECODE, Table.Game.TIMELIMIT, Table.Game.DELETEFLAG, Table.Game.MUSIC, Table.Game.IMAGE, Table.Game.VIDEO, Table.Game.PUBLIC, Table.Game.STATUS], `public = 0 AND delete_flag = 0  order by _id desc`);
            if (result.length > 0) {
            req.game = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    },
    getAllGameById : async (req, res, next) => {
        const gameId = req.body.gameId;
        const result = await sql.first(`${Table.Game.tablename}`, [Table.Game.ID, Table.Game.MEDIAID, Table.Game.USERID, Table.Game.TITLE, Table.Game.SHORTDESC, Table.Game.STARTTIME, Table.Game.DESCRIPTION, Table.Game.GAMECODE, Table.Game.TIMELIMIT, Table.Game.DELETEFLAG, Table.Game.MUSIC, Table.Game.IMAGE, Table.Game.VIDEO, Table.Game.PUBLIC], `_id = ? AND delete_flag = 0`, [gameId]);
        if (result._id) {
            req.gameData = result;
            next();      
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    },
    getMemberId : async (req, res, next) => {
        const username = req.body.username;
        const result = await sql.first(`${Table.GameMember.tablename}`, [Table.GameMember.ID], `username = ? `, [username]);
        if (result) {
            req.username = result;
            next();      
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    },
    getAllGameByIdStudent : async (req, res, next) => {
        const gameId = req.body.gameId;
        const result = await sql.first(`${Table.Game.tablename}`, [Table.Game.ID, Table.Game.MEDIAID, Table.Game.USERID, Table.Game.TITLE, Table.Game.SHORTDESC, Table.Game.STARTTIME, Table.Game.DESCRIPTION, Table.Game.GAMECODE, Table.Game.TIMELIMIT, Table.Game.DELETEFLAG, Table.Game.MUSIC, Table.Game.IMAGE, Table.Game.VIDEO, Table.Game.PUBLIC], `_id = ? AND delete_flag = 0 `, [gameId]); //add status = 0
        if (result._id) {
            req.gameData = result;
            if(result){
                const getImage = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.media_id]);
                const getImageMusic = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.backgroundMusic]);
                const getCoverImage = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.coverImage]);
                const getLobbyVideo = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.lobbyVideo]);
                result.media_id =  getImage.name.replace(" ","%20");
                result.backgroundMusic = getImageMusic ? getImageMusic.name.replace(" ","%20") : 0;
                result.coverImage = getCoverImage ? getCoverImage.name.replace(" ","%20") : 0;
                result.lobbyVideo = getLobbyVideo ? getLobbyVideo.name.replace(" ","%20") : 0;
                next(); 
            }  
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }  
    },
    checkGame : async (req, res, next) =>{
        const gameId = req.body.gameId;
        const result = await sql.findAll(`${Table.GameMember.tablename}`, [Table.GameMember.ID, Table.GameMember.USERID, Table.GameMember.GAMEID, Table.GameMember.USERNAME, Table.GameMember.WINNINGPOINT], `gameId = ?`, [gameId]);
        if(result.length > 0){
            req.user = result;
            next();
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }  
    }, 

    getGameStatus : async (req, res, next) => {
        const gameId = req.body.gameId;
        const result = await sql.first(`${Table.Game.tablename}`, [Table.Game.ID,  Table.Game.STATUS], `_id = ? AND delete_flag = 0`, [gameId]);
        if (result._id) {
            req.gameData = result;
            next();      
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    },

    checkJoinGameUser : async (req, res, next) => {
        const memberId = req.body.memberId;
        const result = await sql.first(`${Table.GameMember.tablename}`, [Table.GameMember.ID, Table.GameMember.USERNAME], "_id = ?", [memberId]);
        if(result._id){
            req.GameMember = result;
            next();
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_USER_NOT_FOUND")));
        }
    },

    checkUserGame : async (req, res, next) => {
        const memberId = req.body.memberId;
        const result = await sql.first(`${Table.gamememberanswer.tablename}`, [Table.gamememberanswer.ID, Table.gamememberanswer.MEMBERID, Table.gamememberanswer.ANSWERID, Table.gamememberanswer.RESULT], "memberId = ?", [memberId]);
        // const result = await sql.query("select * from gamememberanswer where memberId = ?", [memberId]);
        if(result){
            req.gameData = result;
            next();
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    },

    checkquestionGame : async (req, res, next) => {
        const questionId = req.body.questionId;
        const result = await sql.first(`${Table.gamememberanswer.tablename}`, [Table.gamememberanswer.ID, Table.gamememberanswer.QUESTIONID, Table.gamememberanswer.ANSWERID, Table.gamememberanswer.RESULT], "questionId = ?", [questionId]);
        // const result = await sql.query("select * from gamememberanswer where questionId = ? ", [questionId]);
        if(result){
            req.Gamequestion = result;
            next();
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    },

    checkgameResult : async (req, res, next) => {
        const gameId = req.body.gameId;
        const result = await sql.first(`${Table.Question.tablename}`, [Table.Question.ID, Table.Question.GAMEID, Table.Question.WIDTH, Table.Question.HEIGHT, Table.Question.TYPE, Table.Question.QUESTION, Table.Question.MEDIAFILE, Table.Question.MEDIAICON, Table.Question.MEDIATYPE, Table.Question.ANSWER], "gameId = ? and delete_flag = 0", [gameId]);
        if (result) {
            req.question = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_GAME_EMPTY")));
        }
    }
}