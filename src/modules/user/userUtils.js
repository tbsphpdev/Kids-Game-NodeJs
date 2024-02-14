const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require("../../config/tables");

module.exports = {
    create : async (userDetail) => {
        const user = await sql.insert(`${Table.User.tablename}`, userDetail);
        if (user.insertId) {
            return ResponseBuilder.ResponseBuilder.data({ userId: user.insertId });
        }
        else {
            ResponseBuilder.ResponseBuilder.error(user.message);
        } 
    },

    update : async (userData, userId) => {
        const updateRes = await sql.update(`${Table.User.tablename}`, userData, "_id = ?", [userId]);
        return ResponseBuilder.ResponseBuilder.data(userData);
    },

    //get total user
    getTotalUser : async (req, res) => {
        const total_User = await sql.first(`${Table.User.tablename}`, ["count(_id) as total_user"], `delete_flag = 0 and role = 1`);
        return ResponseBuilder.ResponseBuilder.data(total_User);
    },

    //get total quest
    getTotalQuest: async (req, res) => {
        const total_quest = await sql.first(`${Table.Game.tablename}`, ["count(_id) as total_quest"], `delete_flag = 0`);
        return ResponseBuilder.ResponseBuilder.data(total_quest);
    },

    //get total quest played
    getTotalQuestPlayed: async (req, res) => {
        const total_questPlayed = await sql.first(`${Table.Game.tablename}`, ["count(_id) as total_questPlayed"], `delete_flag = 0 and status = 2`);
        return ResponseBuilder.ResponseBuilder.data(total_questPlayed);
    },

    //count user who create game
    getGameUser: async (req, res) => {
        const total_GameUser = await sql.first(`${Table.Game.tablename}`, ["count(DISTINCT userId) as total_GameUser"], `delete_flag = 0`);
        return ResponseBuilder.ResponseBuilder.data(total_GameUser);
    },
}