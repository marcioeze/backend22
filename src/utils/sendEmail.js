const nodemailer = require('nodemailer')

function sendEmail (email, confirmationLink, html) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
        user: 'bentabrian5@gmail.com',
        pass: 'eiecnizilxvkyxwo'
        }
    })
  
    transporter.verify().then( () => {
        console.log('READY FOR SEND EMAILS')
    })

    try {
        transporter.sendMail({
            from: '"JAJAJAJA" <bentabrian5@gmail.com>',
            to: email,
            html: html
          })
        
    } catch (error) {
        console.log('Error al enviar el correo electronico ', error)
    }



}

module.exports = sendEmail