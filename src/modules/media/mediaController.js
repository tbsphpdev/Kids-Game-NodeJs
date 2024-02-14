const ResponseBuilder = require('../../helper/responseBuilder');
// const upload = require('../../helper/uploadImage');
const mediaModel = require('../media/mediaUtils');
const path = require("path");
const Constants = require('../../config/constant');
const { isEmpty } = require('lodash');
const upload = require('../../helper/aws');

module.exports = {
    addMedia : async (req, res) => {
     upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
            }     
            const MediaType  = ['1', '2', '3', '4', '5', '6', '7', '8'] //increase mediaType
            const fileFormat = req.file.mimetype.split("/")[0]
            const fileType = req.body.type;
            if(
                !((fileFormat=="video" && (fileType == 3 || fileType == 8))||
                (fileFormat=="image" && (fileType == 1||fileType == 2|| fileType == 5 || fileType == 6))||
                (fileFormat=="audio" && (fileType == 4 ||fileType == 7))
                )
            )
            {
               return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_MISMATCH_FORMAT_TYPE")));
            } 
            if(MediaType.includes(fileType))
            {
                const mediaDetail = {
                    name : req.file.location,
                    type : fileType,
                    userId : req.body.userId ? req.body.userId : 0
                }
                const result = await mediaModel.create(mediaDetail);  
                if(result && result.result && result.result.mediaId){
                    res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(result.result, req.t("SUCCESS")));
                }else{
                    return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
                } 
            }else{
                return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("ERR_MEDIATYPE")));
            }    
        }); 
    },
    getImageList : async (req, res) => {
        if (!isEmpty(req.media)) {
            return res.status(Constants.SUCCESS_CODE).json(ResponseBuilder.ResponseBuilder.data(req.media, req.t("SUCCESS")));
        } else {
            return res.status(Constants.ERROR_CODE).json(ResponseBuilder.ResponseBuilder.errorMessage(req.t("FAILED")));
        }    
    }
}