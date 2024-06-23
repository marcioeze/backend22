const {body, validationResult} = require('express-validator')


const sendresetPasswordEmailValidator = [
    body('userEmail')
    .exists().withMessage('El correo electronico del usuario es requerido y no ha sido proporcionado')
    .isEmail().withMessage('El correo electronico recibido no es del tipo Email')
    .notEmpty().withMessage('El token no puede estar vacio y/o ser cadena de texto vacia')    
    
    ,
    (req, res, next) => {
        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            const erroresInfo = {};

            errores.array().forEach(error => {
                const fieldName = error.path
                const errorMessage = error.msg

                if (!erroresInfo[fieldName]) {
                    erroresInfo[fieldName] = [];
                }

                erroresInfo[fieldName].push(errorMessage);

            })
        
            return res.status(400).json({ errores: erroresInfo })
        }
        // Si no hay errores ejecuta la siguiente ruta del middleware
        next();
    }
]


module.exports = { sendresetPasswordEmailValidator }
