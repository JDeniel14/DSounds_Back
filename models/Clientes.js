
const mongoose = require('mongoose')


var esquemaCliente = new mongoose.Schema(
    {
        nombre : {type: String, require:[true,'*Nombre es obligatorio'],
                                minlength:[3,'* Nombre debe tener mínimo 3 caracteres'],
                                maxlength:[50,'* Nombre debe tener máximo 50 caracteres']},

        apellidos: {type: String,required:[true, '* Apellidos obligatorios'], 
                                maxlenght:[200,'* Minimo 200 caracteres para la contraseña'],
                                minlength:[3, "* Los apellidos deben tener mínimo 3 caracteres"]},

         cuenta:{
            email:{type:String, required:[true, '*Email obligatorio'], 
                                match:[new RegExp('^.*@.*\\.[a-z]{2,3}$'), '* Formato de email incorrecto']}
            
            ,password:{type: String, required:[true, "* Contraseña obligatoria"],
                                     match:[new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$'),'La contraseña debe contener mayúsculas, mínusculas, digitos y otros caracteres'], 
                                     minlength:[5,'La contraseña debe contener al menos 5 caracteres']},

            cuentaActiva:{type:Boolean, required:true, default:false},

            login:{ type: String, match:[new RegExp('^(?=.*\\d)?(?=.*[\u0021-\u002b\u003c-\u0040])?(?=.*[A-Z])?(?=.*[a-z])\\S{3,}$'), '* Formato de Usuario incorrecto'],
                                  minlength:[3, "* El usuario debe contener al menos 3 caracteres"],
                                  maxlenght:[25,'* Minimo 25 caracteres para la contraseña']},
            
            telefono:{type:String, match:[new RegExp('^\\d{3}\\s?(\\d{2}\\s?){2}\\d{2}$'),"* Formato de teléfono incorrecto, 111 22 33 44"] },

            imagenAvatarBASE64:{type:String}
        },
        direcciones:[
            {type: mongoose.Schema.Types.ObjectId, ref:"Direccion"} 
        ],
        pedidos:[
            {type: mongoose.Schema.Types.ObjectId, ref:"Pedido"}
        ]
    }
);


module.exports = mongoose.model('Cliente', esquemaCliente, 'Clientes')