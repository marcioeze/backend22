const {body, validationResult} = require('express-validator')


const resetPasswordValidator = [
    body('token')
    .exists().withMessage('Token es requerido y no ha sido proporcionado')
    .notEmpty().withMessage('El token no puede estar vacio y/o ser cadena de texto vacia')
    .isJWT().withMessage('Debe ser un token JWT'),
    
    body('newPassword')
    .exists().withMessage('La nueva contraseña es requerida y no ha sido proporcionada')
    .isString().withMessage('La contraseña debe ser una cadena de texto (String)')
    .notEmpty().withMessage('La contraseña no puede estar vacio y/o ser cadena de texto vacia'),

    body('confirmNewPassword')
    .exists().withMessage('La confirmacion de contraseña es requerida y no ha sido proporcionada')
    .isString().withMessage('La confirmación de contraseña debe ser una cadena de texto (String)')
    .notEmpty().withMessage('La confirmación de contraseña no puede estar vacio y/o ser cadena de texto vacia')
    
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


module.exports = { resetPasswordValidator }
