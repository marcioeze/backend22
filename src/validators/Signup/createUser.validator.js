const {body, validationResult} = require('express-validator')


const createUserValidator = [
    body('userName')
    .exists().withMessage('El campo userName es requerido y no ha sido proporcionado')
    .isString().withMessage('El campo userName debe ser un String')
    .custom((value, { req }) => {
        // Elimina los espacios en blanco de los extremos del valor de entrada
        const trimmedValue = value.trim();
        // Verifica si el valor resultante está vacío después de eliminar los espacios en blanco
        if (trimmedValue === '') {
            throw new Error('El campo userName no puede estar vacío y/o ser una cadena de texto vacía');
        }
        // Devuelve verdadero si la validación pasa
        return true;
    })
    ,
    body('email')
    .exists().withMessage('El campo email es requerido y no ha sido proporcionado')
    .isString().withMessage('El campo email debe ser un String')
    .isEmail().withMessage('El email debe ser del tipo email')
    .notEmpty().withMessage('El campo email no puede estar vacio y/o ser cadena de texto vacia')    

    ,
    body('password')
    .exists().withMessage('El campo password es requerido y no ha sido proporcionado')
    .isString().withMessage('El campo password debe ser un String')
    .notEmpty().withMessage('El campo password no puede estar vacio y/o ser cadena de texto vacia')    

    ,
    body('confirmPassword')
    .exists().withMessage('El campo confirmPassword es requerido y no ha sido proporcionado')
    .isString().withMessage('El campo confirmPassword debe ser un String')
    .notEmpty().withMessage('El campo confirmPassword no puede estar vacio y/o ser cadena de texto vacia')   

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


module.exports = { createUserValidator }
