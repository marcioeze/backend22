const User = require('../../DataBase/models/User.js')
const generateLoginToken = require('../../utils/generateLoginToken.js')
const verifyIsLoggedIn = require('../../middlewares/verifyIsLoggedIn.js')

const express = require('express');
const router = express.Router()


router.post('/login', verifyIsLoggedIn, async (req, res, next) => {
    try {
        const { userName, password } = req.body
        
        const userFound =  await User.findOne({ userName: userName })

        if (!userFound) {
           return res.status(404).json({ userFound: false, errorMessage: 'Nombre de Usuario no Registrado' })
        }

        //TEXTO ANTERIOR
        /*No se ha encontrado un usuario con ese nombre en la DB*/

        const userId = userFound._id.toString()

        const isPasswordValid = await userFound.isValidPassword(password);



        if (!isPasswordValid) {
            return res.status(401).json({ isPasswordValid: false, errorMessage: 'La contraseña no es correcta' })
        }

        else {

            const emailConfirmed = userFound.emailConfirmed
            
            const loginToken = generateLoginToken(userId, emailConfirmed)
            
            res.cookie('IL', loginToken, {
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'None',
                secure: true, // Asegúrate de usar HTTPS
            });
            res.status(200).json({ isLoggedIn: true, emailConfirmed: emailConfirmed, message: 'Has Iniciado Sesión Correctamente' })

            //Texto Anterior
            /*El usuario se ha logeado correctamente*/
        }

        
    } catch (error) {
        next(error)   
    }
})




module.exports = router