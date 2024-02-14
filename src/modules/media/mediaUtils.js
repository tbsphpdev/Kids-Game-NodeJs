const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require("../../config/tables");

module.exports = {
    create : async (mediaDetail) => {
        const media = await sql.insert(`${Table.Attatchments.tablename}`, mediaDetail);
        if (media.insertId) { 
            return ResponseBuilder.ResponseBuilder.data({ mediaId: media.insertId });
        }
        else {
            ResponseBuilder.ResponseBuilder.error(media.message);
        } 
    },

}