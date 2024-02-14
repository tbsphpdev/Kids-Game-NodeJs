const Constants = require('../config/constant');
const nodemailer = require("nodemailer");
const path = require("path");
const lodash = require("lodash");
const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();

class SendEmail {
    static generateFpCode() {
        return Constants.JWTCODE;
    }

}
exports.SendEmail = SendEmail;

SendEmail.sendRawMail = (template = null, replaceData = null, email, subject, text = '') => {
        let html = "";
        if (template) {
            // send email for verification
            const templatesDir = path.resolve(`${__dirname}/../`, "templates");
            const content = `${templatesDir}/${template}.html`;
            html = SendEmail.getHtmlContent(content, replaceData);
        }
        const mailOptions = {
            from: process.env.DEFAULT_FROM,
            html,
            replyTo: process.env.DEFAULT_REPLY_TO,
            subject,
            to: email,
            text,
        };

        let transportObj = {};

        transportObj = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER_NAME,
                pass: process.env.SMTP_PASSWORD,
            },
        };
        const transporter = nodemailer.createTransport(transportObj);
        console.log(mailOptions);

        transporter.sendMail(mailOptions, (mailSendErr, info) => {
            if (!mailSendErr) {
               console.log(`Message sent: ${info.response}`);
            }
            else {
                console.log(`Error in sending email: ${mailSendErr} and info ${info}`);
            }
        });

};

SendEmail.getHtmlContent= (filePath, replaceData) => {
    const data = fs.readFileSync(filePath);
    let html = data.toString();
    lodash.keys(replaceData).forEach((key) => {
        html = html.replace(key, replaceData[key]);
    });
    return html;
}