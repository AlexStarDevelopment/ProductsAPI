const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://alexstar1408:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.u7j7e5v.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop')

const productRoutes = require('./api/routes/products');
const productOrders = require('./api/routes/orders');

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST PATCH DELETE, GET')
        return res.status(200).json({})
    }

    next()
})

app.use('/products', productRoutes)
app.use('/orders', productOrders)

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;