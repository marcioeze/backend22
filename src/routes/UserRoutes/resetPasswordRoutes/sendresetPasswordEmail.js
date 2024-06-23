const Users = require('../../../DataBase/models/User.js')
const { sendresetPasswordEmailValidator } = require('../../../validators/resetPassword/sendresetPasswordEmail.validator.js')

const generateToken =  require('../../../utils/generateToken.js')
const sendEmail = require('../../../utils/sendEmail.js')


const express = require('express');
const router = express.Router()

router.post('/recoverPassword', sendresetPasswordEmailValidator, async (req, res, next) => {

    try {

        const { userEmail, userName } = req.body

        if (userEmail && !userName) {

            const emailOwner = await User.findOne({ email: userEmail })
            
            if (!emailOwner) {

                return res.status(401).json({ sent: false, errorMessage: 'No hay ningun usuario registrado con ese correo electronico'})
            }

            const tokenPayload = {
                userEmail: userEmail
            }

            const token = generateToken(tokenPayload)

            emailOwner.resetPasswordToken = token
            await emailOwner.save()

            const confirmationLink = `https://backend-production-4cc11.up.railway.app/confirmEmailResetPassword/${token}`

            const html = `<p>Por favor, haz clic en el siguiente enlace para reestablecer tu contraseña:</p>
            <a href="${confirmationLink}">${confirmationLink}</a>`

            sendEmail(userEmail, confirmationLink, html)


            return res.status(200).json({ sent: true, message: 'Se ha enviado un email a tu correo electronico, sigue los pasos alli mostrados.' })
            
            
        }

        // Hacer la logica de que si es userName que recupere atravez del nombre
        // y quiza despues por ultimo hacer que salga en el front el correo electronico al que se envio el correo electronico de confirmacion

    } catch (error) {
        next(error)
    }

})

module.exports = router