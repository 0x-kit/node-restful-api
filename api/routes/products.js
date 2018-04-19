const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose')

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json({ response });
        })
        .catch(err => { res.status(500).json({ error: err }) });
});


router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product sucessfully',
                createdProduct: {
                    id: result._id,
                    name: result.name,
                    price: result.price
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            });
        })
        .catch(err => { res.status(500).json({ error: err }) });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products`
                    }
                });
            }
            else 
                res.status(404).json({ message: 'Not valid entry found for provided ID' });
        })
        .catch(err => { res.status(500).json({ error: err }) });
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updatedOps = {};

    for (const ops of req.body) {
        updatedOps[ops.propName] = ops.value;
    }
    //{name: req.body.newName, price: req.body.newPrice}

    Product.update({ _id: id }, { $set: updatedOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products`
                }
            });
        })
        .catch(err => { res.status(500).json({ error: err }); });
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: `http://localhost:3000/products`,
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => { res.status(500).json({ error: err }); });
})


module.exports = router;