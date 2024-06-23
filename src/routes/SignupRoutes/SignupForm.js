const express = require('express');
const router = express.Router()
const verifyIsLoggedIn = require('../../middlewares/verifyIsLoggedIn.js')


router.get('/signup', verifyIsLoggedIn, (req, res) => {

    res.send(`
  <form action="/signup" method="POST">

    <label for="nombre">NOMBRE</label>
    <input type="text" id="ueserName" name="userName" required>

    
    <label for="email">EMAIL</label>
    <input type="text" id="email" name="email" required>
    
    <label for="password">CONTRASEÑA:</label>
    <input type="text" id="password" name="password" required>

    
    <label for="confirmPassword">REPETIR CONTRASEÑA:</label>
    <input type="text" id="confirmPassword" name="confirmPassword" required>

    <button type="submit">SIGNUP</button>
  </form>
`);
})

module.exports = router