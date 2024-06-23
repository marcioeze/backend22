const mongoose = require('mongoose');
const { Schema } = mongoose;

const UploadImgSchema = new Schema({
    filename: {
        type:String,
        required: [true, 'El campo filename es requerido y no ha sido proporcionado']
    },
    imageLink: {
        type:String,
        required: [true, 'El campo imageLink es requerido y no ha sido proporcionado']
    }
},
{
    timestamps:true
})


const UploadImg = mongoose.model('Images', UploadImgSchema, 'Images')

module.exports = UploadImg;
