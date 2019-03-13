const nodemailer = require('nodemailer')

const enviar = ({ titulo, corpo, para }) => {
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_NODEMAILER_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: para,
    subject: titulo,
    text: corpo
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error)
      } else {
        resolve({
          message: 'Email enviado',
          info: info.response
        })
      }
    })
  })
}

module.exports = {
  enviar
}
