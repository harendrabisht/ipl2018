const config = require('./../../config');
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const fs = require('fs');
sgMail.setApiKey(config.SENDGRID_API_KEY);

const readHTMLFile = (path, callback) =>{
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
exports.sendMail = (template, replacements, useremail, subject)=>{
    readHTMLFile(global.__base+ 'app/template/'+template, (err, html)=> {
        const template = handlebars.compile(html);
        const htmlToSend = template(replacements);
        const msg = {
            to: useremail,
            from: 'vivoipl@ipl2018.us-east-2.elasticbeanstalk.com',
            subject: subject,
            text: 'IPL 2018',
            html : htmlToSend
          };
        sgMail.send(msg);
    });
}