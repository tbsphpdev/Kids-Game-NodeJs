const l10n = require('jm-ez-l10n');
const sql = require('jm-ez-mysql');
const Table = require('../config/tables');
const ResponseBuilder = require('../helper/responseBuilder');

module.exports = {
    getUserDetails : async (userId) => {
        try{
            const params = ["_id", "name", "email"];
            const condition = `_id = ?`;

            //User verfifcation code
            const result = await sql.first(Table.User.tablename, params, condition, userId);
            if (result && result.id) {
                return result;
            }
            throw new Failure(l10n.t("ERR_NO_USER_FOUND"), "No user found.");
        } catch (error) {
            throw ResponseBuilder.ResponseBuilder.errorMessage(error);
        }  
    }
}