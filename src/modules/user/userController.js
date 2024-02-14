const ResponseBuilder = require('../../helper/responseBuilder');
const userModel = require('../user/userUtils');
const bcryptjs = require('bcryptjs');
const Jwt = require('../../helper/jwt');
const Constants = require('../../config/constant');
const SendEmail =  require('../../helper/sendEmail');
const { isEmpty } = require('lodash');
const moment = require('moment');

module.exports = {

    //User Registration
    register : async (req, res) => {
        const userDetail = {
            firstName : req.body.firstName,
            lastName : req.body.lastName ? req.body.lastName : '',
            email : req.body.email,
            password : bcryptjs.hashSync(req.body.password, Constants.HASH_STRING_LIMIT),
            language : req.body.language ? req.body.language : 'en',
            role : Constants.USERROLE
        }
        const result = await userModel.create(userDetail);
        const token = Jwt.getAuthToken({id : result.result.userId});
        const language = req.body.language;
        if(language == 'sw'){
            let html = "register-email-swedish";
            const data = {
                '{USERNAME}': `${userDetail.firstName}`,
                '{authToken}': `${Constants.APPURL + 'verify-user'}?auth_token=` + token,
            }
            SendEmail.SendEmail.sendRawMail(
                html, 
                data,
                [userDetail.email],
                'registrera-e-post'         
            ); 
        }else{
            let html = "register-email";
            const data = {
                '{USERNAME}': `${userDetail.firstName}`,
                '{authToken}': `${Constants.APPURL + 'verify-user'}?auth_token=` + token,
            }
            SendEmail.SendEmail.sendRawMail(
                html, 
                data,
                [userDetail.email],
                'register-email'         
            );
        }
        if(result && result.result && result.result.userId){
            res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(userDetail, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        } 
    },

    //User Login
    login : async (req, res) => {
        const user = req.user;
        if(user.verify_token == 1){
            if (bcryptjs.compareSync(req.body.password, user.password)) {
                const userDetail = {
                    id : user._id,
                    email: user.email,
                    language : user.language,
                    token: Jwt.getAuthToken({id: user._id}),
                };
                res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(userDetail, req.t("SUCCESS")));
            } else {
                return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_INVALID_CRIDENTIAL")));
            }
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_ACCOUNT_NOT_ACTIVE")));
        }  
    },

    //Forgot Password
    forgotPassword : async (req, res) => {
        const { email } = req.body;
        if(req.user.verify_token == 1){
            const recoverCode = Jwt.getAuthToken({id: req.user._id});
            const language = req.body.language;
            if(language == 'sw'){  
                let html = "forgot-password-swedish";
                const data = {
                    '{USERNAME}': `${req.user.firstName}`,
                    '{resetLink}': `${Constants.APPURL + 'reset-password'}?fp_code=` + recoverCode,
                }
                SendEmail.SendEmail.sendRawMail(
                    html,
                    data,
                    [email],
                    'glömt lösenord'         
                );
            }else{
                let html = "forgot-password";
                const data = {
                    '{USERNAME}': `${req.user.firstName}`,
                    '{resetLink}': `${Constants.APPURL + 'reset-password'}?fp_code=` + recoverCode,
                }
                SendEmail.SendEmail.sendRawMail(
                    html,
                    data,
                    [email],
                    'forgot-password'         
                );
            }
            res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.successMessage(req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_ACCOUNT_NOT_ACTIVE")));
        }
    },

    //Reset Password
    resetPassword : async (req, res) => {
        const userData ={
            password : bcryptjs.hashSync(req.body.password, Constants.HASH_STRING_LIMIT),
            updated_at : moment().format(Constants.LAST_UPDATE)
        }
        const result = await userModel.update(userData, req.user._id);
        if(result && result.result){
            res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.successMessage(req.t("PASSWORD_RESET")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }  
    },

    //Change Password
    changePassword : async (req, res) => {
        const userData = {
            password : bcryptjs.hashSync(req.body.password, Constants.HASH_STRING_LIMIT),
            updated_at : moment().format(Constants.LAST_UPDATE)
        }
        const result = await userModel.update(userData, req.user._id);
        if(result && result.result){
            res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.successMessage(req.t('PASSWORD_UPDATED')));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        } 
    },

    //Get Profile
    getProfile : async (req, res) => {
        if(!isEmpty(req.user)){
           const userData = req.user;
           return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(userData, req.t("SUCCESS")));
        } else {
          return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_TOKEN_EXP")));
        }
    },

    //Update Profile
    updateProfile : async (req, res) => {
        const userdata = {
            firstName :  req.body.firstName ? req.body.firstName : req.user.firstName,
            lastName : req.body.lastName ?  req.body.lastName : req.user.lastName,
            language : req.body.language ?  req.body.language : req.user.language,
            updated_at : moment().format(Constants.LAST_UPDATE)
        } 
        const result = await userModel.update(userdata, req.user._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Verify Token Status
    updateTokenStatus : async (req, res) => {
        const userData = {
            verify_token : 1,
            updated_at : moment().format(Constants.LAST_UPDATE)
        }
        const result = await userModel.update(userData, req.user._id);
        if (result && result.result ) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
        }  else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },

    //Admin Login
    adminLogin : async (req, res) => {
        const user = req.user;
        if (bcryptjs.compareSync(req.body.password, user.password)) {
            const userDetail = {
                id : user._id,
                email: user.email,
                token: Jwt.getAuthToken({id: user._id}),
            };
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(userDetail, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_INVALID_CRIDENTIAL")));
        } 
    },

    //Count User Quest playedQuest
    totalDetail : async (req, res) => {
        const user = await userModel.getTotalUser();
        const quest = await userModel.getTotalQuest();
        const playedQuest = await userModel.getTotalQuestPlayed();
        const gameUser = await userModel.getGameUser();
        if(user && user.result && quest && quest.result && playedQuest && playedQuest.result && gameUser && gameUser.result ){
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data({...user.result, ...quest.result, ...playedQuest.result, ...gameUser.result}, req.t("SUCCESS")));
        }else{
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    },
}