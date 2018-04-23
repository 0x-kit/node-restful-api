const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload-file');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/product');

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_products);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth , ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_products);


module.exports = router;