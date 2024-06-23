const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

const {ConectarDB} = require('./src/DataBase/ConectarDB.js')


const app = express();
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ConectarDB()


app.use('/', require('./src/routes/SignupRoutes/SignupForm.js'))
app.use('/', require('./src/routes/SignupRoutes/Signup.js')) 
app.use('/', require('./src/routes/SignupRoutes/confirmEmail.js'))

app.use('/', require('./src/routes/LoginRoutes/loginform.js'))
app.use('/', require('./src/routes/LoginRoutes/login.js'))
app.use('/', require('./src/routes/LoginRoutes/verifyIsLoggedIn.js'))

app.use('/', require('./src/routes/UserRoutes/resetPasswordRoutes/sendresetPasswordEmail.js'))
app.use('/', require('./src/routes/UserRoutes/resetPasswordRoutes/confirmEmailResetPassword.js'))
app.use('/', require('./src/routes/UserRoutes/resetPasswordRoutes/resetPassword.js'))



// MIDDLEWARE PARA DETECTAR SI EXISTE LA RUTA

app.use((req, res, next) => {
    res.status(404).json({ error: `La Ruta: ${req.url} no ha sido encontrada. Metodo de la peticion: ${req.method}` });
});
  
// MIDDLEWARE PARA MANEJAR ERRORES EN GENERAL

app.use((err, req, res, next) => {
console.log(err); 
res.status(500).json({ error: `${err.name}: ${err.message}` });
});


app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
});