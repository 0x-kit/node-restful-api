const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
    console.log(req.userData)
    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/orders/${doc._id}`
                        }
                    }
                })
            });
        })
        .catch(err => { res.status(500).json({ error: err }); });
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            else {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });

                order.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Created order sucessfully',
                            createdOrder: {
                                id: result._id,
                                product: result.product,
                                quantity: result.quantity
                            },
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/orders/${result._id}`
                            }
                        });
                    })
                    .catch(err => { res.status(500).json({ error: err }); });
            }
        })
        .catch(err => { res.status(500).json({ error: err }); });
}

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
    .select('-__v')
    .populate('product')
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json({
                order: doc,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/orders`
                }
            })
        }
        else
            res.status(404).json({message: 'Not valid entry found for provided ID'})
    })
    .catch(err => { res.status(500).json({ error: err }) });
}

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: `http://localhost:3000/orders`,
                body: { productId: 'ID', quantity: 'Number' }
            }
        });
    })
    .catch(err => { res.status(500).json({ error: err }); });
}