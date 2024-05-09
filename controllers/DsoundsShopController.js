

const mongoose = require('mongoose');
const axios = require('axios')
const jsonwebtoken = require('jsonwebtoken')
var Cliente = require('../models/Clientes')
var Disco = require('../models/Disco');
var Direccion = require('../models/direccion');
var Pedido = require('../models/pedido')
const StripeService = require('../servicios/StripeService')
const GEOAPI_KEY = process.env.GEOAPI_KEY;
const JWT_APIKEY = process.env.JWT_SECRETKEY;

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
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    ObtenerDiscoById: async(req,res,next)=>{
        try {
            let {idDisco} = req.query;
            console.log('id disco a buscar...',idDisco)

            let disco = await Disco.findById(idDisco);

            if(disco != undefined){
                return res.status(200).send({
                    codigo: 0,
                    mensaje: 'Disco recuperados correctamente',
                    error: null,
                    datosCliente: null,
                    token: null,
                    otrosdatos: disco
            })
        }else{
            
            throw new Error('error obteniendo discos...')
        }
        } catch (error) {
            return res.status(400).send({
                        codigo: 1,
                        mensaje: 'Ha ocurrido un error al recuperar el disco de la bd',
                        error: error,
                        datosCliente: null,
                        token: null,
                        otrosdatos: null
            })
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    RecuperarProvincias: async (req,res,next)=>{
        try {
            console.log('hola..121321', GEOAPI_KEY)
            let _resp = await axios.get(`https://apiv1.geoapi.es/provincias?type=JSON&key=${GEOAPI_KEY}&sandbox=0`);
            console.log(_resp.data)
            let _provincias = _resp.data.data;
            console.log('provs....',_provincias)
            res.status(200).send(_provincias);
        } catch (error) {
            res.status(400).send([]);
        }
    },

    RecuperarMunicipios: async(req,res,next)=> {
        try {
            let {codpro}=req.query;
            

            let _resp=await axios.get(`https://apiv1.geoapi.es/municipios?CPRO=${codpro}&type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`);
            let _municipios=_resp.data.data;
            
            res.status(200).send(_municipios)
        } catch (error) {
            res.status(400).send([]);
        }
    },
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 * @returns 
 */
    RealizarPedido: async(req,res,next)=>{
        try {
            let {pedido,email}=req.body;
            console.log('pedido...',pedido.datosPago.DireccionFactura)
            let _nuevoPedidoDsounds = {
                _id : new mongoose.Types.ObjectId(),
                fechaPedido: pedido.fechaPedido,
                estadoPedido: pedido.estadoPedido,
                gastosEnvio: pedido.gastosEnvio,
                subTotal : pedido.subTotal,
                totalPedido: pedido.totalPedido,
                elementosPedido: pedido.elementosPedido,
            }
            console.log('peidod nuevo...',_nuevoPedidoDsounds)
            let datosPagoCliente = pedido.datosPago;
            
            let clienteActual = await Cliente.findOne({'cuenta.email': email});
            console.log('cliente obtenido..', clienteActual);

            let _customerId = await StripeService.createCustomerStripe(clienteActual,pedido.datosPago.DireccionEnvio);
            console.log('customerid...', _customerId);
            if(!_customerId)throw new Error("Error al crear customer de stripe...");
            
            let _cardId = await StripeService.createCardStripe(_customerId);
            if(!_cardId)throw new Error("Error al crear card de stripe...");

            let _pagoStripe = await StripeService.createChargeStripe(_customerId, _cardId, pedido.totalPedido, pedido.idPedido);
            console.log('pago stripe...`',_pagoStripe)
            if(_pagoStripe){
                let _resInsertPedido = await new Pedido(_nuevoPedidoDsounds).save();
                console.log('resultado del insert del pedido...', _resInsertPedido);

                let _dirAGuardar;
                let _direccionesCliente = clienteActual.direcciones;

                if(datosPagoCliente.DireccionFactura !== undefined){
                    console.log('datos..s.a.ds   ',datosPagoCliente)
                    _dirAGuardar = {
                    
                        direccionEnvio: {
                            _id : new mongoose.Types.ObjectId(),
                            calle : datosPagoCliente.DireccionEnvio.calle,
                        pais:datosPagoCliente.DireccionEnvio.pais,
                        cp: datosPagoCliente.DireccionEnvio.cp,
                        provincia: datosPagoCliente.DireccionEnvio.provincia,
                        municipio: datosPagoCliente.DireccionEnvio.municipio,
                        esPrincipal: false,
                        esFacturacion: false,
                        },
                        direccionFacturacion:{
                        idDireccion : datosPagoCliente.DireccionFactura.idDireccion,
                        calle : datosPagoCliente.DireccionFactura.calle,
                        cp: datosPagoCliente.DireccionFactura.cp,
                        pais:datosPagoCliente.DireccionFactura.pais,
                        provincia: datosPagoCliente.DireccionFactura.provincia,
                        municipio: datosPagoCliente.DireccionFactura.municipio,
                        esPrincipal: false,
                        esFacturacion: false,
                        }
                    }
                    console.log('a guardar',_dirAGuardar)
                }else{
                    console.log('hola2')
                    _dirAGuardar = {
                    
                        direccionEnvio: {
                            _id : new mongoose.Types.ObjectId(),
                            calle : datosPagoCliente.DireccionEnvio.calle,
                        pais:datosPagoCliente.DireccionEnvio.pais,
                        provincia: datosPagoCliente.DireccionEnvio.provincia,
                        municipio: datosPagoCliente.DireccionEnvio.municipio,
                        esPrincipal: false,
                        esFacturacion: false,
                        }
                    }
                }
                let direccionEnvio;
                let direccionFacturacion;
                let resInsDireccionEnvio;
                let resInsDireccionFactura;
                
                console.log(_direccionesCliente.length)
                if(_direccionesCliente.length == 0){
                    console.log('hola3', datosPagoCliente)
                    if(datosPagoCliente.tipoDireccionFactura == "IgualEnvio"){
                        console.log('igualenvio..')
                        _dirAGuardar.direccionEnvio.esFacturacion = true;
                        _dirAGuardar.direccionEnvio.esPrincipal = true;
                        
                        resInsDireccionEnvio = await new Direccion(_dirAGuardar.direccionEnvio).save();
                        direccionEnvio = _dirAGuardar.direccionEnvio;
                    }else{
                        console.log('hola4')
                        console.log('distintaenvio..')
                        _dirAGuardar.direccionFacturacion.esFacturacion = true;
                        _dirAGuardar.direccionFacturacion.esPrincipal = false;
                        
                        direccionFacturacion = _dirAGuardar.direccionFacturacion;
                        console.log(direccionFacturacion)
                        resInsDireccionFactura = await new Direccion(direccionFacturacion).save();
                        console.log('hola4')
                        

                        _dirAGuardar.direccionEnvio.esFacturacion = false;
                        _dirAGuardar.direccionEnvio.esPrincipal = true;
                        direccionEnvio = _dirAGuardar.direccionEnvio;
                        console.log(direccionEnvio)
                        resInsDireccionEnvio = await new Direccion(direccionEnvio).save();
                        console.log('hola4', resInsDireccionEnvio)
                        
                    }
                }else{
                    console.log('hola5')
                    if(datosPagoCliente.tipodireccionenvio == 'otradireccion'){
                        console.log('otraenvio')
                        _dirAGuardar.direccionEnvio.esFacturacion = datosPago.tipoDireccionFactura == 'igualenvio';
                        _dirAGuardar.direccionEnvio.esPrincipal = true;
                        direccionEnvio = _dirAGuardar.direccionEnvio;
                        resInsDireccionEnvio = await new Direccion(direccionEnvio).save();

                    }
                    if(datosPagoCliente.tipoDireccionFactura == "otra"){
                        console.log('hola6')
                        console.log('otrafacturacion')
                        _dirAGuardar.direccionFacturacion.esFacturacion = true;
                        _dirAGuardar.direccionFacturacion.esPrincipal = false;
                        
                        direccionFacturacion = _dirAGuardar.direccionFacturacion;
                        resInsDireccionFactura = await new Direccion(direccionFacturacion).save();

                    }
                }

                console.log('hola7')
                let _resUpdateCliente = await Cliente.updateOne({_id: clienteActual._id}, {$push: {'pedidos': _nuevoPedidoDsounds._id}});
                 if(direccionEnvio)_resUpdateCliente = await Cliente.updateOne({_id: clienteActual._id}, {$push: {'direcciones': resInsDireccionEnvio._id}});
                 if(direccionFacturacion)_resUpdateCliente = await Cliente.updateOne({_id: clienteActual._id}, {$push: {'direcciones': resInsDireccionFactura._id}});
                 console.log('hola8')
                console.log('resultado update...', _resUpdateCliente);

                //Mandar datos cliente actualizados y actualizar el jwt
                let _clienteActualizado = await Cliente.findById(clienteActual._id)
                                                        .populate(
                                                            [
                                                                [
                                                                    { path: 'pedidos', model: 'Pedido', populate: [ { path: 'elementosPedido.disco', model: 'Disco'} ] },
                                                                    { path: 'direcciones', model: 'Direccion' }
                                                                ]                                    
                                                            ]
                                                        );
                                                        console.log('hola9')
                let nombre  =_clienteActualizado.nombre;
                let apellidos  =_clienteActualizado.apellidos;
                let idcliente  =_clienteActualizado._id;
                
                console.log('hola10     ',nombre,apellidos,email, idcliente,JWT_APIKEY, process.env.JWT_SECRETKEY)
                
                let _jwt = await jsonwebtoken.sign(
                    {nombre, apellidos, idcliente  },
                    JWT_APIKEY,
                    {issuer: 'http://localhost:3003', expiresIn:'2h'}
                )
                console.log('hola11     ',_jwt, _clienteActualizado)
                //TODO: LIMPIAR COMENTARIOS Y MANDAR MAIL CON DETALLE PEDIDO
                res.status(200).send({
                    codigo: 0,
                    mensaje: 'Pedido realizado correctamente',
                    error: null,
                    datosCliente: _clienteActualizado,
                    token: _jwt,
                    otrosdatos: null
                })
            }else{
                throw new Error("No se ha podido realizar el pago en stripe...");
            }
        } catch (error) {
            return res.status(400).send({
                codigo: 1,
                mensaje: 'Ha ocurrido un error al realizar el pedido',
                error: error,
                datosCliente: null,
                token: null,
                otrosdatos: null
    })
        }
    }
}
