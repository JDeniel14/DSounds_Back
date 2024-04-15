
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

var Cliente = require('../models/Clientes')
var Disco = require('../models/Disco');
var Direccion = require('../models/direccion');
var Pedido = require('../models/pedido')

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
            <img src="http://localhost:3003/images/DSOUNDS-removebg-preview.png" style="width: 300px; margin: 0 auto; display: block;">
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
                console.log("holaaa")
                
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
                    pedidos: []
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
                console.log('hola1')
                 _datosCliente= await Cliente.findById(token);
                 console.log('hola2')
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

                 _datosCliente = await Cliente.findOne({'cuenta.email': email});
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
            res.status(500).send(
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
    }
}