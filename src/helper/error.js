const l10n = require('jm-ez-l10n');
const Constants = require('../config/constant');

class Failure extends Error{
    //type Error
    constructor(title, description, isError, data){
        super(title);
        this.title = title;
        this.type = isError ? Constants.CODE : Constants.BAD_DATA;
        this.description = description;
        if (errStack) {
            this.errorStack = errStack;
        }
        if (data) {
            this.data = data;
        }
    }
    static error(err, data) {
        if (err instanceof SpFailure) {
            err.data = err.data === undefined ? data : err.data;
            return err;
        }
        if (err instanceof Failure) {
            err.type = err.type ? err.type : Constants.BAD_DATA;
            err.data = err.data === undefined ? data : err.data;
            return err;
        }
        const error = new Failure(l10n.t("ERR_INTERNAL_SERVER"), "Error is thrown by code", err, false, data);
        error.type = Constants.CODE;
        error.errorStack = err;
        error.data = data;
        return error;
    }

}
exports.Failure = Failure;
class SpFailure extends Error {
    constructor(title, description, isSpError, data) {
        super(title, description);
        super.type = isSpError ? Constants.CODE : Constants.BAD_DATA;
        super.data = data;
    }
}
exports.SpFailure = SpFailure;