
const routingDsoundsInfo = require('../routing/DsoundsInfoRouting')
const routingDsoundsClient = require('../routing/DsoundsClientRouting')
const routingDsoundsShop = require('../routing/DsoundsShopRouting')

module.exports = function(servExpress){

    servExpress.use('/api/DsoundsInfo',routingDsoundsInfo );
    
    servExpress.use('/api/DsoundsClient', routingDsoundsClient);
    
    servExpress.use('/api/DsoundsShop', routingDsoundsShop);
}