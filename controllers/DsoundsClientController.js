
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

var Cliente = require('../models/Clientes')
var Disco = require('../models/Disco');
var Direccion = require('../models/direccion');
var Pedido = require('../models/pedido');
const pedido = require('../models/pedido');

let MAIL_ACCOUNT = process.env.MAIL_ACCOUNT;
let MAIL_PRIVATE = process.env.MAIL_PRIVATE;

 function EnviarCorreo(tipoEmail,email,_id){
    let mailOptions;

    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:MAIL_ACCOUNT,
            pass:MAIL_PRIVATE
        }
    });

    if(tipoEmail == "verificacionCuenta"){
        mailOptions = {
            from:'dsoundsmail@gmail.com',
            to:email,
            subject:'Activa tu cuenta de DSounds',
            html:`<div style="background-color: black; color: white; text-align: center; width: 100%; padding: 20px;">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
                <path d="M507 1795 c-85 -32 -162 -111 -191 -198 -64 -190 73 -390 275 -405 164 -12 310 106 326 263 l6 55 -135 0 c-108 0 -138 3 -148 15 -17 21 -47 19 -60 -4 -21 -41 25 -78 59 -47 21 19 81 22 81 3 0 -35 -65 -87 -110 -87 -37 0 -77 28 -95 66 -36 77 24 161 108 150 21 -2 46 -11 56 -20 22 -20 31 -20 31 -1 0 20 -57 48 -101 48 -76 0 -129 -57 -129 -138 0 -42 5 -52 39 -86 34 -35 44 -39 87 -39 74 0 115 31 138 103 4 14 18 17 81 17 l77 0 -7 -32 c-31 -146 -143 -241 -283 -241 -114 0 -201 54 -251 154 -82 164 1 352 178 405 132 40 272 -31 337 -170 13 -28 24 -59 24 -68 0 -10 5 -18 10 -18 19 0 10 56 -17 110 -58 116 -161 181 -286 179 -34 0 -79 -7 -100 -14z"/>
                <path d="M568 1764 c-38 -11 -15 -22 55 -25 62 -4 79 -9 121 -37 52 -35 71 -36 40 -1 -37 43 -162 78 -216 63z"/>
                <path d="M562 1709 c2 -6 29 -12 60 -13 42 -2 68 -10 98 -30 23 -15 44 -25 47 -22 10 10 -21 39 -62 57 -44 20 -149 26 -143 8z"/>
                <path d="M577 1673 c-17 -16 -4 -23 42 -23 33 0 56 -6 74 -20 28 -23 51 -26 45 -7 -10 32 -139 72 -161 50z"/>
                <path d="M1070 1519 l0 -92 47 6 c32 3 53 12 65 27 20 24 24 81 8 110 -10 20 -59 40 -96 40 -23 0 -24 -2 -24 -91z m88 33 c27 -35 4 -92 -39 -92 -17 0 -19 7 -19 61 0 58 1 60 23 54 12 -4 28 -14 35 -23z"/>
                <path d="M1343 1600 c-50 -20 -35 -85 23 -96 25 -5 34 -11 32 -23 -4 -23 -46 -26 -69 -5 -18 16 -19 16 -19 -9 0 -22 6 -27 34 -33 42 -8 80 7 89 35 7 24 -10 61 -30 61 -7 0 -26 5 -41 10 -24 10 -26 12 -12 26 11 11 21 13 41 5 23 -9 27 -8 27 8 0 11 -9 21 -22 25 -28 7 -27 7 -55 -4z"/>
                <path d="M1589 1599 c-56 -21 -70 -107 -24 -146 37 -32 80 -30 116 6 36 36 38 79 7 115 -27 30 -63 39 -99 25z m79 -63 c11 -56 -30 -90 -73 -62 -55 36 -5 126 50 91 11 -7 22 -20 23 -29z"/>
                <path d="M2320 1520 l0 -90 39 0 c57 0 91 31 91 81 0 22 -4 49 -10 59 -10 20 -59 40 -96 40 -23 0 -24 -2 -24 -90z m88 38 c31 -26 3 -98 -39 -98 -17 0 -19 7 -19 61 0 58 1 60 23 53 12 -3 28 -11 35 -16z"/>
                <path d="M2593 1600 c-50 -20 -35 -85 23 -96 25 -5 34 -11 32 -23 -4 -23 -46 -26 -69 -5 -18 16 -19 16 -19 -9 0 -22 6 -27 36 -33 42 -8 80 7 89 35 7 24 -10 61 -30 61 -7 0 -26 5 -41 10 -24 10 -26 12 -12 26 11 11 21 13 41 5 23 -9 27 -8 27 8 0 11 -9 21 -22 25 -28 7 -27 7 -55 -4z"/>
                <path d="M1818 1530 c4 -75 21 -100 69 -100 41 0 63 37 63 107 0 56 -2 63 -20 63 -18 0 -20 -7 -20 -65 0 -49 -4 -67 -15 -71 -29 -12 -45 16 -45 77 0 50 -3 59 -17 59 -16 0 -18 -9 -15 -70z"/>
                <path d="M2070 1515 c0 -68 3 -85 14 -85 11 0 16 15 18 53 l3 52 33 -52 c49 -78 62 -71 62 32 0 80 -1 85 -21 85 -20 0 -21 -4 -15 -50 4 -27 4 -50 1 -50 -3 0 -19 23 -36 50 -46 75 -59 67 -59 -35z"/>
                <path d="M486 1392 c-13 -12 -4 -22 49 -47 45 -23 63 -26 100 -21 69 11 59 33 -12 28 -49 -3 -63 0 -95 21 -20 14 -39 23 -42 19z"/>
                <path d="M454 1359 c-16 -26 90 -78 158 -79 51 0 78 7 78 22 0 5 -18 7 -43 3 -54 -8 -117 8 -156 41 -21 17 -32 21 -37 13z"/>
                <path d="M420 1320 c0 -19 91 -69 145 -80 48 -10 71 -9 128 7 39 10 3 20 -58 15 -72 -5 -139 14 -170 48 -19 21 -45 27 -45 10z"/>
            </g>
        </svg>
            <hr>
            <h1>Bienvenido a DSounds!😁</h1>
            <br>
            <p>Gracias por registrarte en DSounds. Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>
            <p><a href="http://localhost:3003/api/DsoundsClient/ActivarCuenta?token=${_id}">Activar cuenta</a></p>
            <p>Si no has solicitado esto, puedes ignorar este correo.</p>
            <p>Ten un maravilloso día</p>
            <p>Tu equipo de DSounds</p>
        </div>
        `
        }

    }else if(tipoEmail == ""){

    }
    transporter.sendMail(mailOptions, function(error,datos){
        if(error){
            console.log("Error al mandar el email...",error);
        }else{
            console.log('Mail mandado correctamente...', datos);
        }
    });
}

module.exports ={
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    Registro: async(req,res,next)=>{

        try {
            console.log('datos recibidos para el registro...', req.body)
            
            var _existeCliente = await Cliente.findOne({'cuenta.email':req.body.email}) ;
            console.log(_existeCliente)
            if(_existeCliente == null || _existeCliente == undefined ){
                
                
            var _resultadoInsert = await new Cliente(
                {
                    nombre: req.body.nombre,
                    apellidos: req.body.apellidos,
                    cuenta:{
                        email:req.body.email,
                        password: bcrypt.hashSync(req.body.password,10),
                        login:req.body.login,
                        cuentaActiva:false,
                        imagenAvatarBASE64:''
                    },
                    direcciones:[],
                    pedidos: [],
                    genero:'',
                    
                }
            ).save();

            
            EnviarCorreo("verificacionCuenta",req.body.email,_resultadoInsert._id)
             
            


            


            res.status(200).send({
                codigo: 0,
                mensaje: 'Cliente registrado correctamente',
                error: null,
                datosCliente: _resultadoInsert,
                token: null,
                otrosdatos: null
            })
        }else if(_existeCliente){
            throw new Error('Ya existe un cliente con ese Email')
        }
        } catch (error) {
            
            res.status(400).send({
                codigo: 1,
                mensaje: 'Error al registrar al cliente',
                error: error.message,
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
    Login: async(req,res,next)=>{

        try {
            
            let {token} = req.query
            let {email, password}=req.body;
            console.log(req.body)
            
            if(token)console.log('datos obtenidos...', token);
            if(email && password)console.log('datos obtenidos...', email,password);
            
            let _jwtCliente;
            let _datosCliente;
            
            if(token ){
                
                _datosCliente = await Cliente.findById(token).populate([
                    { path: 'pedidos', model: 'Pedido', populate: { path: 'elementosPedido.disco', model: 'Disco' } },
                    { path: 'direcciones', model: 'Direccion' }
                ]);
                
                 
                if(_datosCliente){
                    if(_datosCliente.cuenta.cuentaActiva){
                        console.log('datos del cliente obtenidos para login...',_datosCliente);

                    
                     _jwtCliente = jwt.sign(
                        {
                            nombre:_datosCliente.nombre,
                            apellidos:_datosCliente.apellidos,
                            email:_datosCliente.cuenta.email,
                            idCliente:_datosCliente._id
                        },
                        process.env.JWT_SECRETKEY,
                        {
                            expiresIn:'24h',
                            issuer:'http://localhost:3003'
                        }
                    )
                    res.status(200).send(
                        {
                            codigo: 0,
                            mensaje: 'Login del cliente realizado correctamente',
                            error: null,
                            datosCliente: _datosCliente,
                            token: _jwtCliente,
                            otrosdatos: null  
                        }
                    )
                    }else{
                        EnviarCorreo("verificacionCuenta");
                        throw new Error("La cuenta no está activa, le hemos enviado un correo de activación")
                    }
                }
            }else if(email && password){
                
                console.log('datos cuenta cliente..', email,password)

                 _datosCliente = await Cliente.findOne({'cuenta.email': email}).populate([
                    { path: 'pedidos', model: 'Pedido', populate: { path: 'elementosPedido.disco', model: 'Disco' } },
                    { path: 'direcciones', model: 'Direccion' }
                ]);
                console.log('datos cliente recuperados..',_datosCliente);
                if(_datosCliente.cuenta.cuentaActiva){

                    if(bcrypt.compareSync(password,_datosCliente.cuenta.password)){
    
                        
                        _jwtCliente = jwt.sign(
                            {
                                nombre:_datosCliente.nombre,
                                apellidos:_datosCliente.apellidos,
                                email:_datosCliente.cuenta.email,
                                idCliente:_datosCliente._id
                            },
                            process.env.JWT_SECRETKEY,
                            {
                                expiresIn:'24h',
                                issuer:'http://localhost:3003'
                            }
                        )
                        res.status(200).send(
                            {
                                codigo: 0,
                                mensaje: 'Login del cliente realizado correctamente',
                                error: null,
                                datosCliente: _datosCliente,
                                token: _jwtCliente,
                                otrosdatos: null  
                            }
                        )
                    }else{
                        throw new Error("Las contraseñas no coinciden, inténtelo de nuevo");
                    }
                }else{
                    EnviarCorreo("verificacionCuenta");
                    throw new Error("La cuenta no está activa, le hemos enviado un correo de activación")
                }
            }else{
                throw new Error('No hay datos en el body de la request para hacer el login');
            }
        } catch (error) {
            res.status(400).send(
                {
                    codigo:1,
                    mensaje:'No se ha podido realizar el login',
                    error:error.message,
                    datosCliente:null,
                    token:null,
                    otrosdatos:null
                }
            )
        }
    },
  /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    ActivarCuenta: async(req,res,next)=>{

        try {
           console.log('holaa')
            let {token} = req.query;
            console.log('token recibido para activar la cuenta del cliente...',token);

            if(token != undefined){
                let _datosClienteBd = await Cliente
                                            .findByIdAndUpdate
                                            (token,
                                            {'cuenta.cuentaActiva': true},
                                            {new:true}
                                        );
                if(_datosClienteBd){
                    console.log('datos del cliente existente...', _datosClienteBd)

                    res.redirect(`http://localhost:4200/Login?token=${_datosClienteBd._id}`);
                    /*res.status(200).send(
                        {
                            codigo: 0,
                            mensaje: 'Cuenta del Cliente activada correctamente',
                            error: null,
                            datosCliente: _datosClienteBd,
                            token: null,
                            otrosdatos: null
                        }
                    )*/
                    
                }else{
                  throw new Error('No existe un cliente con ese id');
                }

            }else{
                throw new Error('No hay token para activar el cliente en los parámetros...')
            }
        } catch (error) {
            res.status(400).send(
                {
                    codigo: 1,
                    mensaje: 'error al activar la cuenta del cliente',
                    error: error,
                    datosCliente: null,
                    token: null,
                    otrosdatos: null
                }
            )
        }
    },

    CancelarPedido: async(req,res,next)=>{
        try {
            let {idPedido} = req.query;

            let _resultadoUpdatePedido = await Pedido.findByIdAndUpdate(idPedido,{'estadoPedido':'Cancelado'});
            

            if(_resultadoUpdatePedido){
                let _clienteActualizado = await Cliente.findOne({pedidos: idPedido}).populate([
                    {
                      path: "pedidos",
                      model: "Pedido",
                      populate: { path: "elementosPedido.disco", model: "Disco" },
                    },
                    { path: "direcciones", model: "Direccion" },
                  ]);


                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: `Pedido con id ${idPedido} cancelado`,
                        error: null,
                        datosCliente: _clienteActualizado,
                        token: null,
                        otrosdatos: null
                    })
            }
        } catch (error) {
            res.status(400).send(
                {
                    codigo: 1,
                    mensaje: 'error al cancelar el pedido',
                    error: error,
                    datosCliente: null,
                    token: null,
                    otrosdatos: null
                }
            )
        }
    },


    ActualizarPassword: async(req,res, next)=>{
        try {
            let {passwordActual, passwordNueva, email}=req.body;

            let _datosCliente = await Cliente.findOne({'cuenta.email':email});
            let operacionCorrecta = false;
            if(_datosCliente){
                let passCoinciden = bcrypt.compareSync(passwordActual, _datosCliente.cuenta.password);

                if(passCoinciden){
                    operacionCorrecta = true;
                    let passNuevaHass = bcrypt.hashSync(passwordNueva,10);
                    let _resUpdateCliente = await Cliente.updateOne({'cuenta.email':email},{$set:{'cuenta.password': passNuevaHass}});

                    if(_resUpdateCliente){
                        let _datosClienteActualizados = await Cliente.findOne({'cuenta.email':email}).populate([
                            {
                              path: "pedidos",
                              model: "Pedido",
                              populate: { path: "elementosPedido.disco", model: "Disco" },
                            },
                            { path: "direcciones", model: "Direccion" },
                          ]);;

                        let _jwtCliente = jwt.sign(
                            {
                                nombre:_datosClienteActualizados.nombre,
                                apellidos:_datosClienteActualizados.apellidos,
                                email:_datosClienteActualizados.cuenta.email,
                                idCliente:_datosClienteActualizados._id
                            },
                            process.env.JWT_SECRETKEY,
                            {
                                expiresIn:'24h',
                                issuer:'http://localhost:3003'
                            }
                        );

                        if(operacionCorrecta){
                            res.status(200).send(
                                {
                                            
                                codigo: 0,
                                mensaje: `La contraseña se ha actualizado correctamente`,
                                error: null,
                                datosCliente: _datosClienteActualizados,
                                token: _jwtCliente,
                                otrosdatos: null
                                }
                            )
                        }else{
                            res.status(500).send(
                                {
                                    codigo: 1,
                                    mensaje: 'Error al intentar actualizar la contraseña',
                                    error: null,
                                    datosCliente: null,
                                    token: null,
                                    otrosdatos: null
                                }
                            )
                        }
                    }else{
                        operacionCorrecta = false;
                    }
                }else{
                    operacionCorrecta = false;
                }
            }
            
        } catch (error) {
            res.status(500).send(
                {
                    codigo: 1,
                    mensaje: 'Error al intentar actualizar la contraseña',
                    error: error,
                    datosCliente: null,
                    token: null,
                    otrosdatos: null
                }
            )
        }
    },

    ActualizarDatosCliente: async (req,res,next)=>{
        try {
            let {datosNuevosCliente, email} = req.body;

            console.log('datos recibidos...', datosNuevosCliente,email);

            

            let _resUpdateCliente = await Cliente.updateOne({'cuenta.email':email}, datosNuevosCliente);
            if(_resUpdateCliente){
                let _datosClienteActualizados = await Cliente.findOne({'cuenta.email':datosNuevosCliente.cuenta.email}).populate([
                    {
                      path: "pedidos",
                      model: "Pedido",
                      populate: { path: "elementosPedido.disco", model: "Disco" },
                    },
                    { path: "direcciones", model: "Direccion" },
                  ]);

                let _jwtCliente = jwt.sign(
                    {
                        nombre:_datosClienteActualizados.nombre,
                        apellidos:_datosClienteActualizados.apellidos,
                        email:_datosClienteActualizados.cuenta.email,
                        idCliente:_datosClienteActualizados._id
                    },
                    process.env.JWT_SECRETKEY,
                    {
                        expiresIn:'24h',
                        issuer:'http://localhost:3003'
                    }
                );

                res.status(200).send(
                    {
                                
                    codigo: 0,
                    mensaje: `Datos del perfil actualizados correctamente`,
                    error: null,
                    datosCliente: _datosClienteActualizados,
                    token: _jwtCliente,
                    otrosdatos: null
                    }
                )
            }else{
                res.status(500).send(
                    {
                        codigo: 1,
                        mensaje: 'Error al intentar actualizar los datos del cliente',
                        error: null,
                        datosCliente: null,
                        token: null,
                        otrosdatos: null
                    }
                )
            }
        } catch (error) {
            res.status(500).send(
                {
                    codigo: 1,
                    mensaje: 'Error al intentar actualizar los datos del cliente',
                    error: error,
                    datosCliente: null,
                    token: null,
                    otrosdatos: null
                }
            )
        }
    },

    OperarDireccion: async(req,res,next)=>{
        try {
            
            let {direccionOperar,operacion,email} = req.body;
            console.log('datos recibidos...',direccionOperar, operacion, email);

            let resOperacion = false;
            let direccionCrear= {
                _id: new mongoose.Types.ObjectId(),
                calle: direccionOperar.calle,
                pais: direccionOperar.pais,
                cp:direccionOperar.cp,
                provincia:{
                    CCOM: direccionOperar.provincia.CCOM ? direccionOperar.provincia.CCOM : "0",
                    CPRO:direccionOperar.provincia.CPRO ? direccionOperar.provincia.CPRO : "0",
                    PRO: direccionOperar.provincia.PRO ? direccionOperar.provincia.PRO : "a"
                },
                municipio:{
                    CMUM: direccionOperar.municipio.CMUM ?direccionOperar.municipio.CMUM:"0",
                    CPRO:direccionOperar.municipio.CPRO ? direccionOperar.municipio.CPRO : "0",
                    DMUN50:direccionOperar.municipio.DMUN50 ? direccionOperar.municipio.DMUN50 : "a",
                    CUN: direccionOperar.municipio.CUN ? direccionOperar.municipio.CUN :"0"
                },
                esPrincipal: direccionOperar.esPrincipal,
                esFacturacion: direccionOperar.esFacturacion,
              }
              console.log('direccion let...', direccionCrear)

            switch (operacion) {
                case 'CREAR':
                    let _resInsertDireccion = await new Direccion(direccionCrear).save();
                    let _updateCliente = await Cliente.updateOne({'cuenta.email':email}, {$push: {direcciones: _resInsertDireccion._id}});

                    if(_updateCliente){
                        resOperacion= true;
                    }
                    break;
            
                case 'ELIMINAR':

                    let _resDeleteDireccion = await Direccion.deleteOne({'_id':direccionOperar._id});
                    let _updateClienteDelete = await Cliente.updateOne({'cuenta.email':email},{$pull:{direcciones:direccionOperar._id}})
                    if(_updateClienteDelete){
                        resOperacion = true;
                    }
                    break;

                case 'MODIFICAR':
                    let _resUpdateDireccion = await Direccion.updateOne({_id:direccionOperar._id}, {$set:direccionOperar});
                    if(_resUpdateDireccion){
                        resOperacion= true;
                    }
                    break;
                default:
                    break;
            }

            if(resOperacion){
                let _clienteActualizado = await Cliente.findOne({'cuenta.email':email}).populate([
                    {
                      path: "pedidos",
                      model: "Pedido",
                      populate: { path: "elementosPedido.disco", model: "Disco" },
                    },
                    { path: "direcciones", model: "Direccion" },
                  ]);


                  res.status(200).send({
                            codigo: 0,
                            mensaje: 'Operación realizada correctamente',
                            error: null,
                            datosCliente: _clienteActualizado,
                            token: null,
                            otrosdatos: null
                        
                  })
            }else{
                res.status(500).send(
                    {
                        codigo: 1,
                        mensaje: 'Error al intentar realizar la operación sobre la dirección del cliente',
                        error: null,
                        datosCliente: null,
                        token: null,
                        otrosdatos: null
                    }
                )
            }



        } catch (error) {
            res.status(500).send(
                {
                    codigo: 1,
                    mensaje: 'Error al intentar realizar la operación sobre la dirección del cliente',
                    error: error,
                    datosCliente: null,
                    token: null,
                    otrosdatos: null
                }
            )
        }
    }
}