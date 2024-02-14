const express = require('express');
const bodyParser = require('body-parser');
const l10n = require('jm-ez-l10n');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Routes } = require('./route');
const jmEzMySql = require('jm-ez-mysql');
dotenv.config();
jmEzMySql.init({
    acquireTimeout: 100 * 60 * 1000,
    connectTimeout: 100 * 60 * 1000,
    connectionLimit: 10000,
    database: process.env.DATABASE,
    dateStrings: true,
    host: process.env.DBHOST,
    multipleStatements: true,
    password: process.env.DBPASSWORD,
    timeout: 100 * 60 * 1000,
    timezone: "utc",
    user: process.env.DBUSER,
});

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
app = express();
app.use(helmet());
app.all("/*", (req, res, next) => {
// res.setHeader("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Request-Headers", "*");
// tslint:disable-next-line: max-line-length
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization");
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
}
else {
    next();
}
});
l10n.setTranslationsFile("en", "src/language/translation.en.json");
app.use(l10n.enableL10NExpress);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json(), (error, req, res, next) => {
if (error) {
    return res.status(400).json({ error: req.t("ERR_GENRIC_SYNTAX") });
}
next();
});
const routes = new Routes(NODE_ENV);
app.use("/api", routes.path());
app.listen(PORT, () => {
console.log(`The server is running in port localhost: ${process.env.PORT}`);
});

