const User = require('../../../DataBase/models/User.js')
const verifyToken = require('../../../utils/verifyToken.js')

const generateToken =  require('../../../utils/generateToken.js')
const sendEmail = require('../../../utils/sendEmail.js')
const { resetPasswordValidator } = require('../../../validators/resetPassword/resetPassword.validator.js')


const express = require('express');
const router = express.Router()

router.post('/resetPassword', resetPasswordValidator,  async (req, res, next) => {

    try {
        
        const { token, newPassword, confirmNewPassword } = req.body
        
        if (!token) {
            return res.status(401).json({ tokenConfirmed: false, errorMessage: 'No se ha proporcionado un token' })
        }
        
        if (newPassword != confirmNewPassword) {
            return res.status(401).json({ passwordsMatch: false, errorMessage: 'Las contraseñas no coinciden' })
        }
        

        const verifiedToken = verifyToken(token)

        if (!verifiedToken.userEmail) {
            return res.status(401).json({ tokenConfirmed: false, errorMessage: 'El token no contiene un email (userEmail' })
        }
        
        const emailOwner = await User.findOne({ email: verifiedToken.userEmail })

        if (!emailOwner) {

            return res.status(401).json({ tokenConfirmed: false, errorMessage: 'No hay ningun usuario registrado con ese correo electronico'})
        }

        if (emailOwner.resetPasswordToken != token) {
            return res.status(401).json({ tokenConfirmed: false, errorMessage: 'El token recibido no coincide con el almacenado en la base de datos' })
        }

        const isCurrentPassword = await emailOwner.isValidPassword(newPassword);

        if (isCurrentPassword === true) {
            return res.status(401).json({ passwordReset: false, errorMessage: 'La contraseña debe ser distinta a la actual' })
        }

        emailOwner.password = newPassword
        await emailOwner.save()


        // ENVIAMOS UN MAIL AL USUARIO AVISANDO EL CAMBIO DE CONTRASEÑA
        const tokenPayload = {
            userEmail: verifiedToken.userEmail
        }

        const newToken = generateToken(tokenPayload)

        emailOwner.resetPasswordToken = newToken
        await emailOwner.save()

        const confirmationLink = `https://backend-production-4cc11.up.railway.app/confirmEmailResetPassword/${newToken}`

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambio de Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Cambio de Contraseña</h2>
        <p>Hola,</p>
        <p>Te informamos que la contraseña de tu cuenta ha sido cambiada recientemente. Si fuiste tú, no es necesario que realices ninguna acción adicional.</p>
        <p>Sin embargo, si no realizaste este cambio, por favor restablece tu contraseña de inmediato haciendo clic en el siguiente enlace:</p>
        <a href="${confirmationLink}" class="button">Restablecer Contraseña</a>
        <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
        <p>Gracias,</p>
        <p>El equipo de [Nombre de la Empresa]</p>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
    </div>
</body>
</html>
`

    sendEmail(verifiedToken.userEmail, confirmationLink, html)

        res.status(200).json({ passwordReset: true, message: 'Has reestablecido la contraseña correctamente' })

    } catch (error) {
        next(error)
    }

})

module.exports = router