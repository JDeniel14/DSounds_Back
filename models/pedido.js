var mongoose = require('mongoose');

var esquemaPedido= new mongoose.Schema(
    {
        fechaPedido:{type:Date, default:new Date() },
        estadoPedido:{type:String,default:'En preparación'},
        elementosPedido:[
            {
                disco:{type:mongoose.Schema.Types.ObjectId, ref:'Disco'},
                cantidadElemento:{type:Number, required:true,default:1},

            }
        ],
        subtotal:{type:Number,default:0 },
        gastosEnvio:{type:Number, default:0 },
        totalPedido:{type:Number, default:0},
        direccionEnvio:{type:mongoose.Schema.Types.ObjectId,ref:'Direccion'},
        direccionFacturacion:{type:mongoose.Schema.Types.ObjectId,ref:'Direccion'}
    },
    

);



module.exports=mongoose.model('Pedido',esquemaPedido,'Pedidos');