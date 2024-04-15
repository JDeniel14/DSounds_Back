const mongoose = require('mongoose');


var esquemaDisco = new mongoose.Schema(
    {
        Nombre:{type:String, required:true},
        Artista:{type:String, required:true},
        FechaLanzamiento:{type:String},
        Resumen:{type:String},
        Canciones:{type:[String]},
        UrlImagen:{type:String},
        Precio:{type:Number}
    }
);



module.exports = mongoose.model('Disco', esquemaDisco, 'Discos')