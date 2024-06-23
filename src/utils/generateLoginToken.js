const jwt = require('jsonwebtoken')

function generateLoginToken (id, emailConfirmed) {
    const payload = {
        _id: id,
        emailConfirmed: emailConfirmed
    }
    
    const secretKey = process.env.JWT_SECRET_KEY
    return jwt.sign(payload, secretKey, { expiresIn:'24h' })
}

module.exports = generateLoginToken