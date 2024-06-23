const express = require('express');


const router = express.Router()


const verifyIsLoggedIn = require('../../middlewares/verifyIsLoggedIn.js')

router.get('/login', verifyIsLoggedIn, (req, res) => {
    const loginForm = `
        <form action="/login" method="post">
            <label for="userName">Usuario:</label>
            <input type="text" id="userName" name="userName"><br><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password"><br><br>
            <input type="submit" value="Iniciar sesión">
        </form>
    `;

    res.send(loginForm);
});

    
    




module.exports = router