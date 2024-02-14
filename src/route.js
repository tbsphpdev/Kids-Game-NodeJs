const express = require('express');
const l10n = require('jm-ez-l10n');
const userRoute_1 = require('./modules/user/userRoute');
const mediaRoute = require('./modules/media/mediaRoute');
const gameRoute = require('./modules/game/gameRoute');
const questionRoute = require('./modules/question/questionRoute');

class Routes {
    constructor(NODE_ENV) {
        switch (NODE_ENV) {
            case "development":
                this.basePath = "/app/public";
                break;
        }
    }
    defaultRoute(req, res) {
        res.json({
            message: "Hello !",
        });
    }
    path() {
        const router = express.Router();
        router.use("/users", userRoute_1.UserRoute);
        router.use("/media", mediaRoute.mediaRoute);
        router.use("/game", gameRoute.gameRoute);
        router.use("/question", questionRoute.questionRoute);
        // router.use("/other-module", OtherModule);
        router.all("/*", (req, res) => {
            return res.status(404).json({
                error: l10n.t("ERR_URL_NOT_FOUND"),
            });
        });
        return router;
    }

}
exports.Routes = Routes;