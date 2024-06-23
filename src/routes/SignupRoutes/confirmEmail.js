const User = require('../../DataBase/models/User.js')

const { confirmEmailValidator } = require('../../validators/Signup/confirmEmail.validator.js')
const verifyToken = require('../../utils/verifyToken.js')
const verifyTokenDB = require('../../utils/verifyTokenDB.js')
const generateLoginToken = require('../../utils/generateLoginToken.js')

const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router()

router.get('/confirmEmail/:token', confirmEmailValidator, async (req, res, next) => {

    try {

        const receivedToken = req.params.token

        const verifiedToken = verifyToken(receivedToken)
        const email = verifiedToken.email
        if (!email) {
            return res.status(401).json({ confirmed: false, errorMessage: 'El token recibido se vefifico correctamente pero este no contiene un email' })
        }

        const tokenOwner = await User.findOne({ email: email })

        if (!tokenOwner) {
            return res.status(404).json({ confirmed: false, errorMessage: 'El token recibido no le pertenece a ningun usuario registrado' })  // Ahi le ofreces un link o boton para que pueda reenviar email
        }

        const userId = tokenOwner._id.toString()

        const tokenDB = tokenOwner.verificationToken
        if (!tokenDB) {
            return res.status(400).json({ confirmed: false, errorMessage: 'El documento de este usuario no tiene ningun token en la DB' })
        }

        const tokenDBVerified = verifyTokenDB(tokenDB)


        if (receivedToken === tokenDB) {

            try {
                const confirmedUser = await User.findOneAndUpdate({ email: email }, { $set: { emailConfirmed: true } }, { new: true })

                const deleteTokenDB = await User.findOneAndUpdate({ email: email }, { $unset: { verificationToken: 1 } }, { new: true })

                const emailConfirmed = true
                const loginToken = generateLoginToken(userId, emailConfirmed)

                res.cookie('IL', loginToken, { maxAge: 24 * 60 * 60 * 1000 })
                
                res.status(200).json({ confirmed: true, message: 'Se ha confirmado el email correctamente' })

            } catch (error) {
                next(error)
            }
        }
        else {
            return res.status(400).json({ confirmed: false, errorMessage: 'El token recibido no es igual a el almacenado en la base de datos' })
        }


    } catch (error) {
        next(error)
    }

})

module.exports = router