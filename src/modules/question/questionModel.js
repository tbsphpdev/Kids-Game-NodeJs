const Validator = require('validatorjs');
const Constants = require('../../config/constant');
const ResponseBuilder = require('../../helper/responseBuilder');

const addGameValidate = (req, res, next) => {
    const validationRule = {
        "gameId": "required",
        "x" : "required",
        "y" : "required",
        "type" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('gameId')||v.errors.first('x')||v.errors.first('y')||v.errors.first('type')));
    } else {
        v.passes();
        next();
    }
}
const deleteQuestion = (req, res, next) => {
    const validationRule = {
        "questionId": "required",
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('questionId')));
    } else {
        v.passes();
        next();
    }
}

const getQuestionById = (req, res, next) => {
    const validationRule = {
        "gameId": "required",
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('gameId')));
    } else {
        v.passes();
        next();
    }
}

module.exports = {
    addGameValidate,
    deleteQuestion,
    getQuestionById
}