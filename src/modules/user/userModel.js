const Constants = require('../../config/constant');
const ResponseBuilder = require('../../helper/responseBuilder');
const Validator = require('validatorjs');

const signup = (req, res, next) => {
    const validationRule = {
        "firstName": "required|string",
        "email": "required|email",
        "password": "required|string|min:6"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('firstName') || v.errors.first('email') || v.errors.first('password')));
    } else {
        v.passes();
        next();
    }
}

const login = (req, res, next) => {
    const validationRule = {
        "email": "required",
        "password": "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('email') || v.errors.first('password')));
    } else {
        v.passes();
        next();
    }
}

const forgotPasswordModel = (req, res, next) => {
    const validationRule = {
        "email": "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('email')));
    } else {
        v.passes();
        next();
    }
}

const resetPasswordModel = (req, res, next) => {
    const validationRule = {
        "password": "required"
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('password')));
    } else {
        v.passes();
        next();
    }
}

const passwordModel = (req, res, next) => {
    const validationRule = {
        "password": "required",
        "old_password" : "required",
    }
    const v = new Validator(req.body, validationRule);
    if (v.fails()) {
        return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(v.errors.first('password') || v.errors.first('old_password')));
    } else {
        v.passes();
        next();
    }
}

module.exports = { 
  signup,
  login,
  forgotPasswordModel,
  resetPasswordModel,
  passwordModel
}