const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require('../../config/tables');
const Constants = require('../../config/constant');

module.exports = {
    questionList : async (req, res, next) => {
        const questionId = req.body.questionId;
        const result = await sql.first(`${Table.Question.tablename}`, [Table.Question.ID, Table.Question.GAMEID, Table.Question.WIDTH, Table.Question.HEIGHT, Table.Question.QHEIGHT, Table.Question.QWIDTH, Table.Question.FLIPHORIZONTAL, Table.Question.FLIPVERTICAL, Table.Question.TYPE, Table.Question.QUESTION, Table.Question.MEDIAFILE, Table.Question.MEDIAICON, Table.Question.MEDIATYPE, Table.Question.ANSWER], "_id = ? and delete_flag = 0", [questionId]);
        if (result) {
            req.question = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_QUESTION_EMPTY")));
        } 
    },
    checkQuestion : async (req, res, next) => {
        const questionId = req.body.questionId;
        const result = await sql.first(`${Table.Question.tablename}`,[Table.Question.ID], `_id='${questionId}'`);
        if (result) {
            req.question = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_QUESTION_EMPTY")));
        } 
    },
    getQuestionByGameId : async (req, res, next) => {
        const gameId = req.body.gameId;
        const result = await sql.findAll(`${Table.Question.tablename}`, [Table.Question.ID, Table.Question.GAMEID, Table.Question.WIDTH, Table.Question.HEIGHT, Table.Question.QHEIGHT, Table.Question.QWIDTH, Table.Question.FLIPHORIZONTAL, Table.Question.FLIPVERTICAL, Table.Question.TYPE, Table.Question.QUESTION, Table.Question.MEDIAFILE, Table.Question.MEDIAICON, Table.Question.MEDIATYPE, Table.Question.ANSWER], "gameId = ? and delete_flag = 0", [gameId]);
        if (result) {
            req.question = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },
}