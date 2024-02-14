const Constants = require('../../config/constant');
const ResponseBuilder = require('../../helper/responseBuilder');
const Validator = require('validatorjs');

const addMemberValidate = (req, res, next) => {
    const validationRule = {
        "gameCode": "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('gameCode')));
    } else {
        v.passes();
        next();
    }
}

const joinUserValidate = (req, res, next) => {
    const validationRule = {
        "gameId" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('gameId')));
    } else {
        v.passes();
        next();
    }
}

const addUserValidate = (req, res, next) => {
    const validationRule = {
        "userId" : "required",
        "mediaId" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('userId')||v.errors.first('mediaId')));
    } else {
        v.passes();
        next();
    }
}

const getGameValidate = (req, res, next) => {
    const validationRule = {
        "userId" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('userId')));
    } else {
        v.passes();
        next();
    }
}

const gameMemberValidate = (req, res, next) => {
    const validationRule = {
        "memberId" : "required",
        "winningPoint" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('memberId') || v.errors.first('winningPoint')));
    } else {
        v.passes();
        next();
    }
}

const gameQueAnsValidate = (req, res, next) => {
    const validationRule = {
        "memberId" : "required",
        "questionId" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('memberId') || v.errors.first('questionId')));
    } else {
        v.passes();
        next();
    }
}

const getResult = (req, res, next) => {
    const validationRule = {
        "gameId" : "required",
        "memberId" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('gameId') || v.errors.first('memberId')));
    } else {
        v.passes();
        next();
    }
}

const createDuplicateValidate = (req, res, next) => {
    const validationRule = {
        "gameId" : "required",
        "title" : "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('gameId')|| v.errors.first('title')));
    } else {
        v.passes();
        next();
    }
}

module.exports = {
    addMemberValidate,
    joinUserValidate,
    addUserValidate,
    getGameValidate,
    gameMemberValidate,
    gameQueAnsValidate,
    getResult,
    createDuplicateValidate
}