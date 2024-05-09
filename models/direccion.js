var mongoose = require('mongoose');

var esquemaDireccion= new mongoose.Schema(
    {
        calle:{type:String , required:[true, '* Calle es requerida']},
        cp:{type:Number , required:[true, '* Código postal es requerido'], match:[/^\d{5}$/, '* Formato de código postal invalido cp. ej: (28850)']},
        pais:{type:String , required:[true, '* País es requerido']},
        provincia:{
                CPRO:{type:String,},
                CCOM:{type:String,},
                PRO:{type:String, }
         },
        municipio:{
                CPRO:{type:String, },
                CMUM:{type:String, },
                DMUN50:{type:String, },
                CUN:{type:String,}
         },
        esPrincipal:{type:Boolean , default:false},
        esFacturacion:{type:Boolean , default:false},
    }
);


module.exports=mongoose.model('Direccion',esquemaDireccion,'Direcciones');