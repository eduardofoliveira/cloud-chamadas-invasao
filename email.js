const nodemailer = require('nodemailer')

const enviar = mensagem => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eduardo@cloudcom.com.br',
            pass: '190790edu'
        }
    })

    let mailOptions = {
        from: 'eduardo@cloudcom.com.br',
        to: 'eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br',
        subject: 'Quantidade de simultaneas ASTPP',
        text: mensagem
    }

    return new Promise((reject, resolve) => {

        transporter.sendMail(mailOptions, function(error, info){
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