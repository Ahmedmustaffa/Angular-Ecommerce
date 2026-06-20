const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const authGuard = require('../middleware/auth');
const adminGuard = require('../middleware/admin');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', authGuard, adminGuard, productController.createProduct);
router.put('/:id', authGuard, adminGuard, productController.updateProduct);
router.delete('/:id', authGuard, adminGuard, productController.deleteProduct);

module.exports = router;