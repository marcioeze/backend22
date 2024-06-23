const jwt = require('jsonwebtoken')

function verifyTokenDB (token) {
    try {
        const secretKey = process.env.JWT_SECRET_KEY
        const verifiedToken = jwt.verify(token, secretKey); 
        return verifiedToken
    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('El token de la DB ha expirado')
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Token invalido y/o manipulado', error.message)
        }
        else {
            throw new Error('Error al decodificar el token', error.message)
        }
    }
}

module.exports = verifyTokenDB