const CONSTANTS = require('../config/constants');
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: CONSTANTS.MAIL.SERVICE,
    auth: {
        user: CONSTANTS.MAIL.EMAIL,
        pass: CONSTANTS.MAIL.PASSWORD
    }
});
exports.send = (to, subject, message, isHtml, next) => {

    var mailOptions = {
        from: CONSTANTS.MAIL.FROM,
        to: to,
        subject: subject
    };

    if (isHtml) {
        mailOptions.html = message;
    } else {
        mailOptions.text = message;
    }

    transporter.sendMail(mailOptions, function (err, data) {
        next(err, data);
    });
};
