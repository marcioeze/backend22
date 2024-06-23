const {param, validationResult} = require('express-validator')


const confirmEmailResetPasswordValidator = [
    param('token')
    .exists().withMessage('El token es requerido y no ha sido proporcionado')
    .isJWT().withMessage('Debe ser un token JWT')
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


module.exports = { confirmEmailResetPasswordValidator }
