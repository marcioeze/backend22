const {body, validationResult} = require('express-validator')


const loginUserValidator = [
    body('userName')
    .exists().withMessage('El campo userName es requerido y no ha sido proporcionado')
    .isString().withMessage('El campo userName debe ser del tipo String')
    .notEmpty().withMessage('El campo userName no puede estar vacio y/o ser cadena de texto vacia')
    
    ,
    body('password')
    .exists().withMessage('El campo password es requerido y no ha sido proporcionado')
    .isString().withMessage('El campo password debe ser del tipo String')
    .notEmpty().withMessage('El campo password no puede estar vacio y/o ser cadena de texto vacia')     

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


module.exports = { loginUserValidator }
