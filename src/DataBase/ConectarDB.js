const mongoose = require('mongoose');

function ConectarDB() {

    const dbURL = 'URI';



    mongoose.connect(dbURL)

    mongoose.connection.on('connected', () => {
        console.error('Conexion a la base de datos exitosa!!');
    });
    mongoose.connection.on('error', (err) => {
        console.log(`Ha ocurrido un error:${err}`);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('La conexion a la base de datos se ha cerrado');
    });

}

module.exports = { ConectarDB };
