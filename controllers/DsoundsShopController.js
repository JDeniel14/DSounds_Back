

const mongoose = require('mongoose');


var Cliente = require('../models/Clientes')
var Disco = require('../models/Disco');
var Direccion = require('../models/direccion');
var Pedido = require('../models/pedido')



module.exports = {
    ObtenerDiscos : async(req,res,next)=>{
        try {
            
            let discos = await Disco.find()


            if(discos.length > 0){
                return res.status(200).send({
                        codigo: 0,
                        mensaje: 'Discos recuperados correctamente',
                        error: null,
                        datosCliente: null,
                        token: null,
                        otrosdatos: discos
                })
            }else{
                
                throw new Error('error obteniendo discos...')
            }

        } catch (error) {
            return res.status(400).send({
                        codigo: 1,
                        mensaje: 'Ha ocurrido un error al recuperar los discos de la bd',
                        error: error,
                        datosCliente: null,
                        token: null,
                        otrosdatos: null
            })
        }
    }
}
