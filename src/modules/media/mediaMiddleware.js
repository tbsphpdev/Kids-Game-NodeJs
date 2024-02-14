const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require('../../config/tables');
const Constants = require('../../config/constant');

module.exports = {
    ImageList : async (req, res, next) => {
        const mediaId = req.body._id ? req.body._id:null;
        const type = req.body.type ? req.body.type : null;
        const result = await sql.findAll(`${Table.Attatchments.tablename}`, [Table.Attatchments.ID, Table.Attatchments.USERID, Table.Attatchments.NAME, Table.Attatchments.TYPE, Table.Attatchments.JOIN_DATE, Table.Attatchments.LAST_UPDATE], `_id=IFNULL(${mediaId},_id) and type = IFNULL(${type},type) order by _id desc`);
        if (result) {
            req.media = result;
            next();
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }
    }
}