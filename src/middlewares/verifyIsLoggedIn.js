const verifyToken = require('../utils/verifyToken')
const User = require('../DataBase/models/User.js')

async function verifyIsLoggedIn (req, res, next) {

    try {
        
        const loginCookie =  req.cookies.IL
        
        if (loginCookie) {
            const verifiedToken = verifyToken(loginCookie)
            
            if (verifiedToken._id) {
                
                const userFound = await User.findById(verifiedToken._id)
                
                if (!userFound) {
                   return res.status(401).json({ userFound: false, errorMessage: 'El usuario no existe en La DB' })
                }

                if (!userFound.emailConfirmed) {
                    return res.status(401).json({ isLoggedIn: true, emailConfirmed: false, errorMessage: 'El email del usuario no ha sido confirmado' })
                }
                
                else {
                    return res.status(400).json({ isLoggedIn: true, emaiConfirmed: true})
                }

            }

        }
        else {
            return next()
        }
        
    } 
    catch (error) {
        next(error)
    }
        
    }
    

  module.exports = verifyIsLoggedIn;
  