const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require('../../config/tables');
const Constants = require('../../config/constant');
const bcryptjs = require('bcryptjs');

module.exports = {
    //Check Email account exist or not
    checkForUniqueEmail : async (req, res, next) => {
        const email = req.body.email;
        const result = await sql.first(`${Table.User.tablename}`, [Table.User.EMAIL], `email='${email}' and role = 1`);
        if (result) {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_EMAIL_ALREADY_USED"))); 
        } else {
            next();
        }    
    },
    checkForValidEmail : async (req, res, next) => {
        const email = req.body.email;
        const result = await sql.first(`${Table.User.tablename}`, [Table.User.ID, Table.User.NAME, Table.User.LASTNAME, Table.User.EMAIL, Table.User.PASSWORD, Table.User.NAME, Table.User.VERIFY_TOKEN, Table.User.LANGUAGE], `email='${email}' and role = 1 `);
        if (result) {
            req.user = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_EMAIL_NOT_EXIST")));
        }
    },
    checkPassword : async(req, res, next) => {
        const user = await sql.first(Table.User.tablename, [Table.User.PASSWORD, Table.User.ID], `${Table.User.ID} = ?`, [req.user._id]);
        if (user && (bcryptjs.compareSync(req.body.old_password, user.password))) {
            next();
        }
        else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t('ERR_INVALID_PASSWORD')));
        }
    },
    checkForValidAdminEmail : async (req, res, next) => {
        const email = req.body.email;
        const result = await sql.first(`${Table.User.tablename}`, [Table.User.ID, Table.User.NAME, Table.User.LASTNAME, Table.User.EMAIL, Table.User.PASSWORD, Table.User.NAME, Table.User.VERIFY_TOKEN], `email='${email}' and role = 2 `);
        if (result) {
            req.user = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_EMAIL_NOT_EXIST")));
        }
    },
}