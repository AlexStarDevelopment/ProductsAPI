const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose')


exports.orders_get_all = (req, res, next) => {
    //populate filters out what to return to the user
    Order.find().select('product quantity _id').populate('product', 'name').exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id 
                    }
                }
            })
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_create = (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        if(!product) {
            return res.status(404).json({
                message: 'No product'
            })
        }
    })
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })
    order.save().then(result => {
        res.status(201).json({
            message: 'Order Stored',
            createdOrder: {
                _id: result.product,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_get_by_id = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id).exec().then(result => {
        if (result) {
            res.status(200).json({
                order: result,
                request: {
                    type: 'GET',
                    request: 'http://localhost:3000/details/' + id
                }
            })
        } else {
            res.status(404).json({message: 'No valid entry found for id'})
        }
        
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
}

exports.orders_delete = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId}).exec().then(result => {
        res.status(200).json({
            message: "order deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}