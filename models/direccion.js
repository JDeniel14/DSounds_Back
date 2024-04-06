var mongoose = require('mongoose');

var esquemaDireccion= new mongoose.Schema(
    {
        calle:{type:String , required:[true, '* Calle es requerida']},
        cp:{type:Number , required:[true, '* Código postal es requerido'], match:[/^\d{5}$/, '* Formato de código postal invalido cp. ej: (28850)']},
        pais:{type:String , required:[true, '* País es requerido']},
        provincia:{
                CPRO:{type:String, required:true},
                CCOM:{type:String, required:true},
                PRO:{type:String, required:true}
         },
        municipio:{
                CPRO:{type:String, required:true},
                CMUM:{type:String, required:true},
                DMUN50:{type:String, required:true},
                CUN:{type:String, required:true}
         },
        esPrincipal:{type:Boolean , default:false},
        esFacturacion:{type:Boolean , default:false},
    }
);


module.exports=mongoose.model('Direccion',esquemaDireccion,'Direcciones');