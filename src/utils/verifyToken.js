const jwt = require('jsonwebtoken')

function verifyToken (token) {
    try {
        const secretKey = process.env.JWT_SECRET_KEY
        const verifiedToken = jwt.verify(token, secretKey); 
        return verifiedToken
    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('El token recibido ha expirado')
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Token invalido y/o manipulado', error.message)
        }
        else {
            throw new Error('Error al verificar el token', error.message)
        }
    }
}

module.exports = verifyToken