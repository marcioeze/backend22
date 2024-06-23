const UploadImg = require('../../models/UploadImg');
const imagekit = require('imagekit');


const dotenv = require('dotenv');
const express = require('express')

dotenv.config();
const router = express.Router()



const imageKit = new imagekit({
    publicKey: 'public_1KaJvYpUJlOmncc2bo2ZaywGepE=',
    privateKey: 'private_Tvm4EVFZcUJhbWpOF2XkzYb3zV4=',
    urlEndpoint: 'https://ik.imagekit.io/marcioeze/'
});

router.post('/subirimagen', (req, res, next) => {
    try {
        const { filename, base64 } = req.body;

        imageKit.upload({
            file: base64,
            fileName: filename,
            tags: ['tag1', 'tag2']
        }, function (error, result) {
            if (error) {
                res.status(400).json({ errormensaje: 'Se ha producido un error', error: error.message } || error);
                console.error('Se ha producido un error inesperado', error);
            } else {
                console.log(result, 'Se ha subido correctamente la imagen');

                UploadImg.create({
                    filename: filename,
                    imageLink: result.url
                })
                
                res.status(200).json({ imageURL: result.url });
            }
        });
    } catch (error) {
        next(error);
    }
});



  module.exports = router;
