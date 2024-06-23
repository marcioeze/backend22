const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
function generateToken (payload) {
    const payloadRecived = payload
    
    const secretKey = process.env.JWT_SECRET_KEY

    return jwt.sign(payloadRecived, secretKey, { expiresIn: '1d' })
}

module.exports = generateToken