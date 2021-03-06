const nodemailer = require('nodemailer')

let transporters = {}

async function SMTPClient () {}

SMTPClient.send = function (account, email) {
  // create reusable transporter object using the default SMTP transport
  if (typeof transporters[account.user] === 'undefined') {
    transporters[account.user] = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.tls,
      auth: {
        user: account.user,
        pass: account.password
      }
    })
  }

  // setup email data with unicode symbols
  let mailOptions = {
    from: mail.from, // sender address (Firstname Lastname <Email Address>)
    to: mail.to, // list of receivers
    subject: mail.subject, // Subject line
    text: mail.message, // plain text body
    html: mail.message // html body
  }

  // send mail with defined transport object
  transporters[account.user].sendMail(mailOptions, (error, info) => {
    if (error) {
      return logger.error(error)
    }
    logger.log(`Message ${info.messageId} sent: ${info.response}`)
  })
}

module.exports = { SMTPClient }
