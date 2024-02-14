const ResponseBuilder = require('../../helper/responseBuilder');
const sql = require('jm-ez-mysql');
const Table = require('../../config/tables');

module.exports = {
    create : async (gameDetail) => { console.log(gameDetail);
        const tempCover = await sql.first(`${Table.Attatchments.tablename}`, [Table.Attatchments.ID, Table.Attatchments.USERID, Table.Attatchments.NAME, Table.Attatchments.TYPE], "_id = ?", [gameDetail.media_id]);
        const mediaDetail = {
            userId : tempCover.userId,
            name : tempCover.name,
            type : 6
        }
        const media = await sql.insert(`${Table.Attatchments.tablename}`, mediaDetail);
        const game = await sql.insert(`${Table.Game.tablename}`, {...gameDetail, coverImage:media.insertId});
        if(game.insertId){
            return ResponseBuilder.ResponseBuilder.data({ gameId: game.insertId, coverImage:media.insertId  });
        }else{
            ResponseBuilder.ResponseBuilder.error(game.message);
        }
    },
    addGameMember : async (memberDetail) => {
        const member = await sql.insert(`${Table.GameMember.tablename}`, memberDetail);
        if(member.insertId){
            return ResponseBuilder.ResponseBuilder.data({ memberId: member.insertId });
        }else{
            ResponseBuilder.ResponseBuilder.error(member.message);
        }
    },
    getGameDetails : async (gameId) => {
        const result = await sql.first(`${Table.Game.tablename}`, [Table.Game.ID, Table.Game.MEDIAID, Table.Game.USERID, Table.Game.TITLE, Table.Game.SHORTDESC, Table.Game.STARTTIME, Table.Game.DESCRIPTION, Table.Game.GAMECODE, Table.Game.TIMELIMIT, Table.Game.DELETEFLAG, Table.Game.MUSIC, Table.Game.IMAGE, Table.Game.VIDEO ,Table.Game.STATUS], `_id = ? AND delete_flag = 0  order by _id desc`, [gameId]);
        if(result){
            const getImage = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.media_id]);
            const getImageMusic = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.backgroundMusic]);
            const getCoverImage = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.coverImage]);
            const getLobbyVideo = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [result.lobbyVideo]);
            result.media_id =  getImage.name.replace(" ","%20");
            result.backgroundMusic = getImageMusic ? getImageMusic.name.replace(" ","%20") : 0;
            result.coverImage = getCoverImage ? getCoverImage.name.replace(" ","%20") : 0;
            result.lobbyVideo = getLobbyVideo ? getLobbyVideo.name.replace(" ","%20") : 0;
            return result;
        }     
    },
    getJoinUserDetails : async (gameId) => {
        const result = await sql.findAll(`${Table.GameMember.tablename}`, [Table.GameMember.ID, Table.GameMember.USERID, Table.GameMember.GAMEID, Table.GameMember.USERNAME], `gameId = ?`, [gameId]);
        return result;  
    }, 
    finishProject :async (gameData, gameId) => {
        const updateRes = await sql.update(`${Table.Game.tablename}`, gameData, "_id = ?", [gameId]);
        return ResponseBuilder.ResponseBuilder.data(gameData);
    },
    updateGame : async (gameData, gameId) => {
        const updateGame = await sql.update(`${Table.Game.tablename}`, gameData, "_id = ?", [gameId]);
        return ResponseBuilder.ResponseBuilder.data(gameData);
    }, 
    getQuestion : async (gameId) => {
        const question = await sql.findAll(`${Table.Question.tablename}`, [Table.Question.ID, Table.Question.GAMEID, Table.Question.WIDTH, Table.Question.HEIGHT, Table.Question.QHEIGHT, Table.Question.QWIDTH, Table.Question.FLIPHORIZONTAL, Table.Question.FLIPVERTICAL, Table.Question.TYPE, Table.Question.QUESTION, Table.Question.MEDIAFILE, Table.Question.MEDIAICON, Table.Question.MEDIATYPE, Table.Question.ANSWER], "gameId = ? and delete_flag = 0", [gameId]);
        for(var i = 0; i<question.length; i++){
            const option = await sql.findAll(`${Table.Answer.tablename}`, [Table.Answer.ORDER, Table.Answer.ANSWER], "questionId = ?", [question[i]._id]);
            question[i].option = option;
        }
        return ResponseBuilder.ResponseBuilder.data(question);
    },
    saveQuesAns : async (queAnsDetail) => {
        const queAns = await sql.insert(`${Table.gamememberanswer.tablename}`, queAnsDetail);
        if(queAns.insertId){
            return ResponseBuilder.ResponseBuilder.data({ questionanswerId: queAns.insertId });
        }else{
            ResponseBuilder.ResponseBuilder.error(queAns.message);
        }
    },
    getQuestionStudent : async (gameId) => {
        const question = await sql.findAll(`${Table.Question.tablename}`, [Table.Question.ID, Table.Question.GAMEID, Table.Question.WIDTH , Table.Question.HEIGHT, Table.Question.QHEIGHT, Table.Question.QWIDTH, Table.Question.FLIPHORIZONTAL, Table.Question.FLIPVERTICAL, Table.Question.TYPE, Table.Question.QUESTION, Table.Question.MEDIAFILE, Table.Question.MEDIAICON, Table.Question.MEDIATYPE, Table.Question.ANSWER], "gameId = ? and delete_flag = 0", [gameId]);
        const filteredQuestions = [];
        let tempQuestion = "";
        for(var i = 0; i<question.length; i++){
            const option = await sql.findAll(`${Table.Answer.tablename}`, [Table.Answer.ID,Table.Answer.ORDER, Table.Answer.ANSWER], "questionId = ?", [question[i]._id]);
            if((question[i].type == 1||question[i].type == 2) && option && option.length == 4)
            {
               tempQuestion = {...question[i], option : option}
            }
            else if(question[i].type == 3){
               tempQuestion = {...question[i], option:[]}
            }
            else{
                continue;
            }
            const mediaFile = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [question[i].mediaFile]);
            const mediaIcon = await sql.first(`${Table.Attatchments.tablename}`,[Table.Attatchments.NAME], "_id = ? ", [question[i].mediaIcon]);
            tempQuestion.mediaFile =  mediaFile ? mediaFile.name.replace(" ","%20") : 0;
            tempQuestion.mediaIcon = mediaIcon ? mediaIcon.name.replace(" ","%20") : 0;
            filteredQuestions.push(tempQuestion);
        }
        return ResponseBuilder.ResponseBuilder.data(filteredQuestions);
    },
    addWinPoint : async (gameData, memberId) => {
        const addWinPoint = await sql.update(`${Table.GameMember.tablename}`, gameData, "_id = ?", [memberId]);
        return ResponseBuilder.ResponseBuilder.data(gameData);
    },
    getQuestionAnswer : async (memberId, questionId) => {
        const result = await sql.first(`${Table.gamememberanswer.tablename}`, [Table.gamememberanswer.ID, Table.gamememberanswer.MEMBERID, Table.gamememberanswer.QUESTIONID ,Table.gamememberanswer.ANSWERID, Table.gamememberanswer.RESULT], "memberId = ? and questionId = ?", [memberId, questionId]);
        // const result = await sql.query("select * from gamememberanswer where memberId = ? and questionId = ?", [memberId, questionId]);
        return ResponseBuilder.ResponseBuilder.data(result);
    },
    updateQueAns : async (queAnsData, memberId, questionId) => {
        const updateQueAns = await sql.update(`${Table.gamememberanswer.tablename}`, queAnsData, "memberId = ? AND questionId = ?", [memberId, questionId]);
        return ResponseBuilder.ResponseBuilder.data(queAnsData);
    },
    getResult : async (gameId, memberId) => {
        const question = await sql.findAll(`${Table.Question.tablename}`, [Table.Question.ID], "gameId = ? and delete_flag = 0", [gameId]);
        const data =  await sql.query("select result from gamememberanswer where questionId in (select _id from question where gameId = ?) And memberId = ?", [gameId, memberId]);
        return ResponseBuilder.ResponseBuilder.data(data);
    },
    getCountUser : async (gameId) => {
        const totalPlayers =  await sql.query(`SELECT * from gamemember where gameId =?`,[gameId]);
        let totalUser2 = await sql.query(`SELECT Count(gamememberanswer._id)as totalAttampt, memberId, username, questionId, gamememberanswer.answer, winningPoint, timeSpent FROM gamememberanswer LEFT JOIN gamemember on gamemember._id = gamememberanswer.memberId WHERE memberId in (select gamemember._id from gamemember where gameId = ? )GROUP BY memberId`, [gameId]);
      
        let pArr = []
        let cArr = []
        let leftMembers = []

        if(totalPlayers.length>totalUser2.length)
        {
           pArr = totalPlayers.map((obj, i)=>{
            return obj._id
            })
            cArr = totalUser2.map((obj, i)=>{
                return obj.memberId
            })
            leftMembers = pArr.filter(obj=>{
                return cArr.indexOf(obj)==-1
            })    
        }
      
        let countUser = [...totalUser2]
        if(leftMembers.length > 0){
            const tempUser = await sql.query(`SELECT 0 as totalAttampt, _id as memberId, username, 0 as questionId, 0 as answer, winningPoint, timeSpent FROM gamemember WHERE _id in (${leftMembers.join()})`);
            countUser = [...tempUser]
        }
       return ResponseBuilder.ResponseBuilder.data(countUser);
    },

    totalGameMember : async() => {
        const playedUser = await sql.query("select count(_id) as totalGameMember, gameId from gamemember GROUP BY gameId");
        return ResponseBuilder.ResponseBuilder.data(playedUser);
    },

    getStudentAnswer : async (memberId) => {
        const result = await sql.findAll(`${Table.gamememberanswer.tablename}`, [Table.gamememberanswer.ID, Table.gamememberanswer.MEMBERID, Table.gamememberanswer.QUESTIONID ,Table.gamememberanswer.ANSWERID, Table.gamememberanswer.RESULT], "memberId = ?", [memberId]);
        return ResponseBuilder.ResponseBuilder.data(result); 
    },
    getStudentDetail : async (memberId) => {
        const result = await sql.first(`${Table.GameMember.tablename}`, [Table.GameMember.ID, Table.GameMember.USERNAME, Table.GameMember.WINNINGPOINT, Table.GameMember.TIMESPENT], "_id = ?", [memberId]);
        return ResponseBuilder.ResponseBuilder.data(result);  
    }
}