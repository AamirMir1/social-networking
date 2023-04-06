const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
    var transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "d07113346a7818",
            pass: "9c803ffb4a09b4"
        }
    });

    const mailOptions = {
        from: "Node Mailer",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail