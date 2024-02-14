const ResponseBuilder = require('../../helper/responseBuilder');
const Constants = require('../../config/constant');
const questionModel = require('../question/questionUtils');
const { isEmpty } = require('lodash');
const moment = require('moment');

module.exports = {
    //Add question
    addQuestion : async (req, res) => {
        const questionDetail = {
            gameId : req.body.gameId,
            x : req.body.x,
            y : req.body.y,
            qHeight : req.body.qHeight ? req.body.qHeight : 52,
            qWidth : req.body.qWidth ? req.body.qWidth : 52,
            flipVertical : req.body.flipVertical ? req.body.flipVertical : 0,
            flipHorizontal : req.body.flipHorizontal ? req.body.flipHorizontal : 0,
            type : req.body.type,
            question : req.body.question ? req.body.question : '',
            mediaFile : req.body.mediaFile ? req.body.mediaFile : 0 ,
            mediaType : req.body.mediaType ? req.body.mediaType : '',
            mediaIcon : req.body.mediaIcon ? req.body.mediaIcon : 0,
            answer : req.body.answer ? req.body.answer : '',
            createdAt : Constants.CURRENT_DATE
        }
        const result = await questionModel.create(questionDetail);
        if(result && result.result && result.result.questionId){
            const option = req.body.option ? req.body.option : '';
            for(var i = 0; i<option.length; i++){
                const answerDetail = {
                    questionId : result.result.questionId,
                    order : option[i].order,
                    answer : option[i].answer,
                    createdAt : Constants.CURRENT_DATE
                }
                const data = await questionModel.createAnswer(answerDetail);
            }
            res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...questionDetail, ...result.result}, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        } 
    },
    //Get question List
    getQuestion : async (req, res) => {
        if (!isEmpty(req.question)) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(req.question, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Update Question
    updateQuestion : async (req, res) => {
        const questionDetail = {
            gameId : req.body.gameId ? req.body.gameId : req.question.gameId,
            x : req.body.x ? req.body.x : req.question.x,
            y : req.body.y ? req.body.y : req.question.y,
            qHeight : req.body.qHeight ? req.body.qHeight : req.question.qHeight,
            qWidth : req.body.qWidth ? req.body.qWidth : req.question.qWidth,
            flipVertical : req.body.flipVertical!==undefined ? req.body.flipVertical : req.question.flipVertical,
            flipHorizontal : req.body.flipHorizontal!==undefined ? req.body.flipHorizontal : req.question.flipHorizontal,
            type : req.body.type ? req.body.type : req.question.type,
            question : req.body.question ? req.body.question : req.question.question,
            mediaFile : req.body.mediaFile ?req.body.mediaFile : req.question.mediaFile,
            mediaType : req.body.mediaType ? req.body.mediaType : req.question.mediaType,
            mediaIcon : req.body.mediaIcon ? req.body.mediaIcon : req.question.mediaIcon,
            answer : req.body.answer ? JSON.stringify(req.body.answer) : req.question.answer,
            _id : req.body.questionId,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        
        // flipVertical: req.question.flipVertical,
        // flipHorizontal: req.question.flipHorizontal,
        // console.log("3:", questionDetail.flipVertical, questionDetail.flipHorizontal);

        // if(req.body.flipVertical!==undefined)
        // {
        //     // console.log("1:",req.body.flipVertical);
        //     questionDetail.flipVertical = req.body.flipVertical
        // }
        // if(req.body.flipHorizontal!==undefined)
        // {
        //     // console.log("2:",req.body.flipHorizontal);
        //     questionDetail.flipHorizontal= req.body.flipHorizontal
        // }

        const result = await questionModel.updateQuestion(questionDetail, questionDetail._id);
        if(result && result.result){
            const que = await questionModel.getQuestion(questionDetail._id);
            const option = req.body.option ? req.body.option : ''; 
            if(option)
            {
                const deleteData = await questionModel.deleteAnswer(questionDetail._id);
                for(var i = 0; i<option.length; i++){
                    const answerDetail = {
                        questionId : result.result._id,
                        order : option[i].order,
                        answer : option[i].answer,  ///TODO: Field change to string, remove parseInt
                        createdAt : Constants.CURRENT_DATE
                    }
                    const data = await questionModel.createAnswer(answerDetail);
                }
            }
            // console.log(questionDetail);
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(questionDetail, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },
    //Delete question
    deleteQuestion : async (req, res) => {
        const questionData = {
            _id : req.body.questionId,
            delete_flag : 1,
            updatedAt : moment().format(Constants.LAST_UPDATE)
        }
        const result = await questionModel.updateQuestion(questionData, questionData._id);
        if (result && result.result ) {
            const data = await questionModel.deleteAnswer(questionData._id);
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Get Question Detail by gameId
    getQuestionByGameId : async (req, res) => {
        if (!isEmpty(req.question)) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(req.question, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    }
}