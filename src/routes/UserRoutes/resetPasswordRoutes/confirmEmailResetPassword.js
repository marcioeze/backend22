const User = require('../../../DataBase/models/User.js')
const { confirmEmailResetPasswordValidator } = require('../../../validators/resetPassword/confirmEmailResetPassword.validator.js')

const verifyToken = require('../../../utils/verifyToken.js')


const express = require('express');
const router = express.Router()

router.get('/confirmEmailResetPassword/:token', confirmEmailResetPasswordValidator, async (req, res, next) => {

    try {

        const token = req.params.token
        
        if (!token) {
            res.status(401).json({ tokenConfirmed: false, errorMessage: 'No se ha proporcionado un token' })
        }
        

        const verifiedToken = verifyToken(token)

        if (verifiedToken.userEmail) {
            const emailOwner = await User.findOne({ email: verifiedToken.userEmail })

            if (!emailOwner) {

                return res.status(401).json({ tokenConfirmed: false, errorMessage: 'No hay ningun usuario registrado con ese correo electronico'})
            }

            if (emailOwner.resetPasswordToken != token) {
                res.status(401).status({ emailConfirmed: false, errorMessage: 'El token recibido no coincide con el almacenado en la base de datos' })
            }

            res.redirect(`http://localhost:3000/setNewPassword/?token=${token}`);

        }

        

    } catch (error) {
        next(error)
    }

})

module.exports = router