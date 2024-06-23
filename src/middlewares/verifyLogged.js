const verifyToken = require('../utils/verifyToken')
const User = require('../DataBase/models/User.js')

async function verifyLogged (req, res, next) {

    try {
        const savedCookie = req.cookies.IL
        
        if (!savedCookie) {
            return res.status(404).json({ islogged: false, errorMessage: 'No existe la cookie IL en las cookies del navegador' })
        } 

        const verifiedToken = verifyToken(savedCookie)
        const userID = verifiedToken._id
        
        if (!userID) {
            return res.status(404).json({ isLogged: false, errorMessage: 'Se verifico el token correctamente pero este no contiene un id' })
        }

        const existsUser = await User.exists({ _id: userID })
        if (!existsUser) {
            return res.status(404).json({ isLogged: false, errorMessage: 'No se encontro un usuario en la DB con el mismo id guardado en la cookie' })
        }

        if (!verifiedToken.emailConfirmed) {
            return res.status(401).json({ emailConfirmed: false, errorMessage: 'El email no ha sido confirmado' })
        }

        next()

    } catch (error) {
        next(error)
    }

}
  module.exports = verifyLogged;
  