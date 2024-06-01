const nodemailer = require('nodemailer');


async function sendnMail(req, res, next) {
    // Create a transporter object using the default SMTP transport
    const email = req.userData.data.username
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kumaraayush.user@gmail.com', // your email
            pass: 'bfre mnaz ylfe drjm' // your email password
        }
    });

    // Set up email data
    let mailOptions = {
        from: 'investorfrindly@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Hello from Todo Commit', // Subject line
        text: `Hey there!, ${email} Hello form Todo Commit, Thanks for signup.`, // plain text body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        next()
    });

}

module.exports = sendnMail