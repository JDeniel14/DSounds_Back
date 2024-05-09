const axios = require('axios');

module.exports={
    createCustomerStripe: async(datosCliente, direccionEnvio)=>{
        try {
            
            let _direccionPrincipal ={}
            _direccionPrincipal = datosCliente.direcciones.filter(d => d.esPrincipal == true)[0];
            if(_direccionPrincipal == undefined){
                _direccionPrincipal = direccionEnvio;
            }
            console.log('dir...',_direccionPrincipal.municipio)
            let _customerStripeValues = new URLSearchParams(
                {
                    'name': datosCliente.nombre,
                    'email':datosCliente.cuenta.email,
                    'phone': datosCliente.telefono,
                    'address[city]': _direccionPrincipal.municipio.DMUN50,
                    'address[state]': _direccionPrincipal.provincia.PRO,
                    'address[country]': _direccionPrincipal.pais,
                    'address[postal_code]': _direccionPrincipal.cp,
                    'address[line1]': _direccionPrincipal.calle,
                }
            ).toString()

            let _resp = await axios(
               { method:'POST',
                url:'https://api.stripe.com/v1/customers',
                data : _customerStripeValues,
                headers:{
                    'Authorization': `Bearer ${process.env.STRIPE_PRIVATE_KEY}`
                }}
            );
                console.log('respuesta1...',_resp.data)
            if(_resp.status === 200){
                console.log('respuesta de stripe con create customer...',_resp.data);

                return _resp.data.id;
            }else{
                return null;
            }


        } catch (error) {
            console.log(error)
            return null;
        }
    },

    createCardStripe: async(clienteStripeId)=>{
        try {
            
                
            let _cardStripeValues = new URLSearchParams(
                {
                    'source': 'tok_visa'
                }
            ).toString();

            let _resp = await axios(
               { method:'POST',
                url:`https://api.stripe.com/v1/customers/${clienteStripeId}/sources`,
                data : _cardStripeValues,
                headers:{
                    'Authorization': `Bearer ${process.env.STRIPE_PRIVATE_KEY}`
                }}
            );

            if(_resp.status === 200){
                console.log('respuesta de stripe con create customer...',_resp.data);

                return _resp.data.id;
            }else{
                return null;
            }

        } catch (error) {
            return null;
        }
    },

    createChargeStripe : async(clienteStripeId, cardId, totalPedido, idPedido)=>{

        try {
            console.log(clienteStripeId, cardId,totalPedido,idPedido)
            let _chargeStripeValues = new URLSearchParams(
                {
                    "customer":clienteStripeId,
                    "source":cardId,
                    "amount": (totalPedido * 100).toString(),
                    "currency": "eur",
                    "description":idPedido
                }
            ).toString();

            let _resp = await axios(
                {method:'POST',
                url:'https://api.stripe.com/v1/charges',
                data : _chargeStripeValues,
                headers:{
                    'Authorization': `Bearer ${process.env.STRIPE_PRIVATE_KEY}`
                }}
            );

            if(_resp.status === 200){
                console.log('respuesta de stripe con create customer...',_resp.data);

                return _resp.data.status === "succeeded";
            }else{
                return null;
            }

        } catch (error) {
            return null;
        }
    }
}
