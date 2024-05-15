const mongoose = require("mongoose");
const axios = require("axios");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require('fs');

var Cliente = require("../models/Clientes");
var Disco = require("../models/Disco");
var Direccion = require("../models/direccion");
var Pedido = require("../models/pedido");

const StripeService = require("../servicios/StripeService");
const GEOAPI_KEY = process.env.GEOAPI_KEY;
const JWT_APIKEY = process.env.JWT_SECRETKEY;
let MAIL_ACCOUNT = process.env.MAIL_ACCOUNT;
let MAIL_PRIVATE = process.env.MAIL_PRIVATE;

 function EnviarCorreo(tipoEmail, email, mensaje) {
  let mailOptions;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAIL_ACCOUNT,
      pass: MAIL_PRIVATE,
    },
  });

  
  mailOptions = {
    from: "dsoundsmail@gmail.com",
    to: email,
    subject: "Tu compra en DSounds",
    html: mensaje,
  };
  
  transporter.sendMail(mailOptions, function (error, datos) {
    if (error) {
      console.log("Error al mandar el email...", error);
      
    } else {
      console.log("Mail mandado correctamente...", datos);
       
    }
  });

  
}

module.exports = {
  ObtenerDiscos: async (req, res, next) => {
    try {
      let discos = await Disco.find();

      if (discos.length > 0) {
        return res.status(200).send({
          codigo: 0,
          mensaje: "Discos recuperados correctamente",
          error: null,
          datosCliente: null,
          token: null,
          otrosdatos: discos,
        });
      } else {
        throw new Error("error obteniendo discos...");
      }
    } catch (error) {
      return res.status(400).send({
        codigo: 1,
        mensaje: "Ha ocurrido un error al recuperar los discos de la bd",
        error: error,
        datosCliente: null,
        token: null,
        otrosdatos: null,
      });
    }
  },

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {*} next
   */
  ObtenerDiscoById: async (req, res, next) => {
    try {
      let { idDisco } = req.query;
      console.log("id disco a buscar...", idDisco);

      let disco = await Disco.findById(idDisco);

      if (disco != undefined) {
        return res.status(200).send({
          codigo: 0,
          mensaje: "Disco recuperados correctamente",
          error: null,
          datosCliente: null,
          token: null,
          otrosdatos: disco,
        });
      } else {
        throw new Error("error obteniendo discos...");
      }
    } catch (error) {
      return res.status(400).send({
        codigo: 1,
        mensaje: "Ha ocurrido un error al recuperar el disco de la bd",
        error: error,
        datosCliente: null,
        token: null,
        otrosdatos: null,
      });
    }
  },

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {*} next
   */
  RecuperarProvincias: async (req, res, next) => {
    try {
      console.log("hola..121321", GEOAPI_KEY);
      let _resp = await axios.get(
        `https://apiv1.geoapi.es/provincias?type=JSON&key=${GEOAPI_KEY}&sandbox=0`
      );
      console.log(_resp.data);
      let _provincias = _resp.data.data;
      console.log("provs....", _provincias);
      res.status(200).send(_provincias);
    } catch (error) {
      res.status(400).send([]);
    }
  },

  RecuperarMunicipios: async (req, res, next) => {
    try {
      let { codpro } = req.query;

      let _resp = await axios.get(
        `https://apiv1.geoapi.es/municipios?CPRO=${codpro}&type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`
      );
      let _municipios = _resp.data.data;

      res.status(200).send(_municipios);
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
  RealizarPedido: async (req, res, next) => {
    try {
      let { pedido, email } = req.body;
      
      let _nuevoPedidoDsounds = {
        _id: new mongoose.Types.ObjectId(),
        fechaPedido: pedido.fechaPedido,
        estadoPedido: pedido.estadoPedido,
        gastosEnvio: pedido.gastosEnvio,
        subTotal: pedido.subTotal,
        totalPedido: pedido.totalPedido,
        elementosPedido: pedido.elementosPedido,
      };
      
      let datosPagoCliente = pedido.datosPago;

      let clienteActual = await Cliente.findOne({ "cuenta.email": email });
      

      let _customerId = await StripeService.createCustomerStripe(
        clienteActual,
        pedido.datosPago.DireccionEnvio
      );
      console.log("customerid...", _customerId);
      if (!_customerId) throw new Error("Error al crear customer de stripe...");

      let _cardId = await StripeService.createCardStripe(_customerId);
      if (!_cardId) throw new Error("Error al crear card de stripe...");

      let _pagoStripe = await StripeService.createChargeStripe(
        _customerId,
        _cardId,
        pedido.totalPedido,
        pedido.idPedido
      );
      
      if (_pagoStripe) {
        let _resInsertPedido = await new Pedido(_nuevoPedidoDsounds).save();
        

        let _dirAGuardar;
        let _direccionesCliente = clienteActual.direcciones;

        if (datosPagoCliente.DireccionFactura !== undefined) {
          
          _dirAGuardar = {
            direccionEnvio: {
              _id: new mongoose.Types.ObjectId(),
              calle: datosPagoCliente.DireccionEnvio.calle,
              pais: datosPagoCliente.DireccionEnvio.pais,
              cp: datosPagoCliente.DireccionEnvio.cp,
              provincia: datosPagoCliente.DireccionEnvio.provincia,
              municipio: datosPagoCliente.DireccionEnvio.municipio,
              esPrincipal: false,
              esFacturacion: false,
            },
            direccionFacturacion: {
              idDireccion: datosPagoCliente.DireccionFactura.idDireccion,
              calle: datosPagoCliente.DireccionFactura.calle,
              cp: datosPagoCliente.DireccionFactura.cp,
              pais: datosPagoCliente.DireccionFactura.pais,
              provincia: datosPagoCliente.DireccionFactura.provincia,
              municipio: datosPagoCliente.DireccionFactura.municipio,
              esPrincipal: false,
              esFacturacion: false,
            },
          };
          
        } else {
          
          _dirAGuardar = {
            direccionEnvio: {
              _id: new mongoose.Types.ObjectId(),
              calle: datosPagoCliente.DireccionEnvio.calle,
              pais: datosPagoCliente.DireccionEnvio.pais,
              provincia: datosPagoCliente.DireccionEnvio.provincia,
              municipio: datosPagoCliente.DireccionEnvio.municipio,
              esPrincipal: false,
              esFacturacion: false,
            },
          };
        }
        let direccionEnvio;
        let direccionFacturacion;
        let resInsDireccionEnvio;
        let resInsDireccionFactura;

        
        if (_direccionesCliente.length == 0) {
          
          if (datosPagoCliente.tipoDireccionFactura == "IgualEnvio") {
            
            _dirAGuardar.direccionEnvio.esFacturacion = true;
            _dirAGuardar.direccionEnvio.esPrincipal = true;

            resInsDireccionEnvio = await new Direccion(
              _dirAGuardar.direccionEnvio
            ).save();
            direccionEnvio = _dirAGuardar.direccionEnvio;
          } else {
            _dirAGuardar.direccionFacturacion.esFacturacion = true;
            _dirAGuardar.direccionFacturacion.esPrincipal = false;

            direccionFacturacion = _dirAGuardar.direccionFacturacion;
            console.log(direccionFacturacion);
            resInsDireccionFactura = await new Direccion(
              direccionFacturacion
            ).save();


            _dirAGuardar.direccionEnvio.esFacturacion = false;
            _dirAGuardar.direccionEnvio.esPrincipal = true;
            direccionEnvio = _dirAGuardar.direccionEnvio;
            resInsDireccionEnvio = await new Direccion(direccionEnvio).save();
          }
        } else {
          
          if (datosPagoCliente.tipodireccionenvio == "otradireccion") {
            
            _dirAGuardar.direccionEnvio.esFacturacion =
              datosPago.tipoDireccionFactura == "igualenvio";
            _dirAGuardar.direccionEnvio.esPrincipal = true;
            direccionEnvio = _dirAGuardar.direccionEnvio;
            resInsDireccionEnvio = await new Direccion(direccionEnvio).save();
          }
          if (datosPagoCliente.tipoDireccionFactura == "otra") {
          
            _dirAGuardar.direccionFacturacion.esFacturacion = true;
            _dirAGuardar.direccionFacturacion.esPrincipal = false;

            direccionFacturacion = _dirAGuardar.direccionFacturacion;
            resInsDireccionFactura = await new Direccion(
              direccionFacturacion
            ).save();
          }
        }

        
        let _resUpdateCliente = await Cliente.updateOne(
          { _id: clienteActual._id },
          { $push: { pedidos: _nuevoPedidoDsounds._id } }
        );
        if (direccionEnvio)
          _resUpdateCliente = await Cliente.updateOne(
            { _id: clienteActual._id },
            { $push: { direcciones: resInsDireccionEnvio._id } }
          );
        if (direccionFacturacion)
          _resUpdateCliente = await Cliente.updateOne(
            { _id: clienteActual._id },
            { $push: { direcciones: resInsDireccionFactura._id } }
          );
        
        
        let _clienteActualizado = await Cliente.findById(
          clienteActual._id
        ).populate([
          {
            path: "pedidos",
            model: "Pedido",
            populate: { path: "elementosPedido.disco", model: "Disco" },
          },
          { path: "direcciones", model: "Direccion" },
        ]);
        
        let nombre = _clienteActualizado.nombre;
        let apellidos = _clienteActualizado.apellidos;
        let idcliente = _clienteActualizado._id;

        

        let _jwt = await jsonwebtoken.sign(
          { nombre, apellidos, idcliente },
          JWT_APIKEY,
          { issuer: "http://localhost:3003", expiresIn: "2h" }
        );
        
  
        

        const tablaHTML = `
    <h2>Detalle del Pedido</h2>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style=" padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Disco</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Cantidad</th>
                <th style=" padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Foto</th>
                <th style=" padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Precio Unitario</th>
                <th style=" padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${pedido.elementosPedido
              .map(
                (el) => `
                <tr>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                      el.disco.Nombre
                    }</td>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                      el.cantidadElemento
                    }</td>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;"><img style="max-width: 100px; max-height: 100px;" src="${
                      el.disco.UrlImagen
                    }" alt="${el.disco.Nombre}"></td>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                      el.disco.Precio
                    }€</td>
                    <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                      el.cantidadElemento * el.disco.Precio
                    }€</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    </table>`;


        const mensajeHTML = `<div style="background-color: black; color: white; text-align: center; width: 100%; padding: 20px;">
                              <hr>
                              <h1>Tu compra en DSounds!😁</h1>
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
                              <br>
                              <p>Gracias por comprar en DSounds, aquí tienes los detalles de tu compra:</p>
                              <p style="text-decoration:underline; font-style:italic;">Total: ${pedido.totalPedido.toFixed(
                                        2
                                      )}€ con un total de ${pedido.elementosPedido
                                        .map((el) => el.cantidadElemento)
                                        .reduce((a, b) => a + b, 0)} elementos</p>
                              <br>
                              ${tablaHTML}
                              <p>Ten un maravilloso día</p>
                              <p>Tu equipo de DSounds</p>
                              </div>`;

          
 
          let mailOptions;

          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: MAIL_ACCOUNT,
              pass: MAIL_PRIVATE,
            },
          });

          mailOptions = {
            from: "dsoundsmail@gmail.com",
            to: email,
            subject: "Tu compra en DSounds",
            html: mensajeHTML,
          };

          transporter.sendMail(mailOptions, function (error, datos) {
            if (error) {
              console.log("Error al mandar el email...", error);
            } else {
              console.log("Mail mandado correctamente...", datos);
            }
          });

        
          res.status(200).send({
            codigo: 0,
            mensaje: "Pedido realizado correctamente",
            error: null,
            datosCliente: _clienteActualizado,
            token: _jwt,
            otrosdatos: null,
          });
        

         
      } else {
        throw new Error("No se ha podido realizar el pago en stripe...");
      }
    } catch (error) {
      return res.status(400).send({
        codigo: 1,
        mensaje: "Ha ocurrido un error al realizar el pedido",
        error: error,
        datosCliente: null,
        token: null,
        otrosdatos: null,
      });
    }
  },

  
};
