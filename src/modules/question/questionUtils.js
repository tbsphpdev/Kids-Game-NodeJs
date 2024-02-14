const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require('../../config/tables');

module.exports = {
    create : async (questionDetail) => {
        const question = await sql.insert(`${Table.Question.tablename}`, questionDetail);
        if(question.insertId){
            return ResponseBuilder.ResponseBuilder.data({ questionId: question.insertId });
        }else{
            ResponseBuilder.ResponseBuilder.error(question.message);
        }
    },
    createAnswer : async (answerDetail) => {
        const answer = await sql.insert(`${Table.Answer.tablename}`, answerDetail);
        if(answer.insertId){
            return ResponseBuilder.ResponseBuilder.data({ answerId: answer.insertId });
        }else{
            ResponseBuilder.ResponseBuilder.error(answer.message);
        }
    },
    updateQuestion : async (questionData, questionId) => {
        const updateQuestion = await sql.update(`${Table.Question.tablename}`, questionData, "_id = ?", [questionId]);
        return ResponseBuilder.ResponseBuilder.data(questionData);
    },
    updateAnswer : async (answerData, questionId) => {
        const updateAnswer = await sql.update(`${Table.Answer.tablename}`, answerData, "questionId = ?", [questionId]);
        return ResponseBuilder.ResponseBuilder.data(answerData);
    },
    deleteAnswer : async (questionId) => {
        const deleteAnswer = await sql.delete(`${Table.Answer.tablename}`, "questionId = ?", [questionId]);
        return ResponseBuilder.ResponseBuilder.data({deleteAnswer});
    },
    getQuestion : async (questionId) => {
        const question = await sql.first(`${Table.Answer.tablename}`, [Table.Answer.QUESTIONID], "questionId = ?", [questionId]);
        return ResponseBuilder.ResponseBuilder.data(question);
    }
}