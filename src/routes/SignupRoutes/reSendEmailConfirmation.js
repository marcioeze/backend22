const User = require('../../DataBase/models/User.js')

const verifyToken = require('../../utils/verifyToken.js')
const generateToken =  require('../../utils/generateToken.js')
const sendEmail = require('../../utils/sendEmail.js')


const express = require('express');
const router = express.Router()

router.get('/resendEmail', async (req, res, next) => {

    try {
        const previousCookie = req.cookies.IL

        if (!previousCookie) {
            return res.send(404).json({ errorMessage: 'El usuario no ha iniciado sesion.' })
        }
        else {
            
            const verifiedToken = verifyToken(previousCookie)
            
            if (verifiedToken.emailConfirmed === true) {
                return res.status(401).json({sent: false, errorMessage: 'El email ya ha sido registrado'})
            }
            else {

            const userID = verifiedToken._id
            const userFound = await User.findById(userID)      

            if (!userFound) {
                return res.status(404).json({sent: false, errorMessage: 'El usuario almacenado en la cookie no esta registrado en la DB' })
            }
            else {
                
                const userEmail = userFound.email
                const payload = {
                    email : userEmail
                }
                const verificationToken = generateToken(payload)

                try {
                    userFound.verificationToken = verificationToken
                    await userFound.save()  

                    const confirmationLink = `http://localhost:2000/confirmEmail/${verificationToken}`
                    
                    const html = `<p>Por favor, haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>
                    <a href="${confirmationLink}">${confirmationLink}</a>`

                    sendEmail(userEmail, confirmationLink, html)
    
                    res.status(200).json({ sent: true, message: 'Se ha reenviado el email correctamente', userFound: userFound })
                } 
                catch (error) {
                    res.status(500).json({ sent: false, errorMessage: 'Ocurrio un error interno en el servidor', error: error.message })
                }
                    

            }

            }
        }

    } catch (error) {
        next(error)
    }

})

module.exports = router