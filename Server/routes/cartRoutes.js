const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authGuard = require('../middleware/auth'); // Must be logged in!

router.get('/', authGuard, cartController.getUserCart);
router.post('/add', authGuard, cartController.addToCart);
router.put('/update', authGuard, cartController.updateCartItemQuantity);
router.delete('/remove/:productId', authGuard, cartController.removeFromCart);

module.exports = router;