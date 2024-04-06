
const routingDsoundsInfo = require('../routing/DsoundsInfoRouting')
const routingDsoundsClient = require('../routing/DsoundsClientRouting')
module.exports = function(servExpress){

    servExpress.use('/api/DsoundsInfo',routingDsoundsInfo );
    
    servExpress.use('/api/DsoundsClient', routingDsoundsClient);
    
}