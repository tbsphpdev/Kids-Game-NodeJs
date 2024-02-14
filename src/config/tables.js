const User = {
    "tablename" : "users",
    "ID" : "_id",
    "NAME" : "firstName",
    "LASTNAME" : "lastName",
    "ROLE" : "role",
    "EMAIL" : "email",
    "PASSWORD" : "password",
    "LANGUAGE" : "language",
    "DELETE_FLAG" : "delete_flag",
    "VERIFY_TOKEN" : "verify_token",
    "JOIN_DATE" : "created_at",
    "LAST_UPDATE" : "updated_at"
}
const Attatchments = {
    "tablename" : "attachments",
    "ID" : "_id",
    "USERID" : "userId",
    "NAME" : "name",
    "TYPE" : "type",
    "JOIN_DATE" : "createdAt",
    "LAST_UPDATE" : "updatedAt"
}
const Game = {
    "tablename" : "game",
    "ID" : "_id",
    "USERID" : "userId",
    "MEDIAID" : "media_id",
    "TITLE" : "title",
    "SHORTDESC" : "short_desc",
    "STARTTIME" : "startTime",
    "DESCRIPTION" : "description",
    "GAMECODE" : "gameCode",
    "TIMELIMIT" : "timeLimit",
    "MUSIC" : "backgroundMusic",
    "IMAGE" : "coverImage",
    "VIDEO" : "lobbyVideo",
    "STATUS" : "status",
    "PUBLIC" : "public",
    "DELETEFLAG" : "delete_flag",
    "JOIN_DATE" : "createdAt",
    "LAST_UPDATE" : "updatedAt"
}
const Question = {
    "tablename" : "question",
    "ID" : "_id",
    "GAMEID" : "gameId",
    "WIDTH" : "x",
    "HEIGHT" : "y",
    "QHEIGHT" : "qHeight",
    "QWIDTH" : "qWidth",
    "FLIPVERTICAL" : "flipVertical",
    "FLIPHORIZONTAL": "flipHorizontal",
    "TYPE" : "type",
    "QUESTION" : "question",
    "MEDIAFILE" : "mediaFile",
    "MEDIATYPE" : "mediaType",
    "MEDIAICON" : "mediaIcon",
    "ANSWER" : "answer",
    "JOIN_DATE" : "createdAt",
    "LAST_UPDATE" : "updatedAt"
}
const Answer = {
    "tablename" : "answer",
    "ID" : "_id",
    "QUESTIONID" : "questionId",
    "ORDER" : "`order`",
    "ANSWER" : "answer",
    "JOIN_DATE" : "createdAt",
    "LAST_UPDATE" : "updatedAt"
}
const GameMember = {
    "tablename" : "gamemember",
    "ID" : "_id",
    "USERID" : "userId",
    "GAMEID" : "gameId",
    "USERNAME" : "username",
    "WINNINGPOINT" : "winningPoint",
    "TIMESPENT" : "timeSpent",
    "JOIN_DATE" : "createdAt",
    "LAST_UPDATE" : "updatedAt"  
}
const gamememberanswer = {
    "tablename" : "gamememberanswer",
    "ID" : "_id",
    "MEMBERID" : "memberId",
    "QUESTIONID" : "questionId",
    "ANSWERID" : "answer",
    "RESULT" : "result",
    "JOIN_DATE" : "createdAt",
    "LAST_UPDATE" : "updatedAt" 
}
module.exports = {
    User, 
    Attatchments,
    Game,
    Question,
    Answer,
    GameMember,
    gamememberanswer
}