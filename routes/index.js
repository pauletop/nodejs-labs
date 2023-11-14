const apiaccountRouter = require('./account');
const apiproductRouter = require('./products');
const apiorderRouter = require('./orders');
const authMiddleware = require('../middlewares/auth');

const route = (app) => {
    app.use('/api/account', apiaccountRouter);
    app.use('/api/products', apiproductRouter);
    app.use('/api/orders', authMiddleware, apiorderRouter);
    // warning: end point invalid
    app.use((req, res) => {
        res.status(404).json({ message: '404 - Not Found' });
    });
    app.use((req, res) => {
        res.status(405).json({ message: '405 - Method Not Allowed' });
    });
}


module.exports = route;