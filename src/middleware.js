const Table = require('./config/tables');
const Jwt = require('./helper/jwt');
const ResponseBuilder  = require('./helper/responseBuilder');
const sql = require('jm-ez-mysql');
const lodash = require('lodash');
const jwt = require('./helper/jwt');

module.exports = {
    authenticateUser : async (req, res, next) => {
        if(req.headers.authorization && !lodash.isEmpty(req.headers.authorization)){
            const tokenInfo = Jwt.decodeAuthToken(req.headers.authorization.toString());
            if(tokenInfo){
                const user = await sql.first(`${Table.User.tablename}`, ["_id", "email", "firstName", "lastName", "language"], `_id='${tokenInfo.id}'`);
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    return res.status(401).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
                }
            }
            else {
                return res.status(401).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
            }
        }
        else {
            return res.status(401).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
        }
    }
}