const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authGuard = require('../middleware/auth');
const adminGuard = require('../middleware/admin');

router.post('/checkout', authGuard, orderController.checkout);
router.get('/my-orders', authGuard, orderController.getUserOrders);

// Admin only routes
router.get('/all', authGuard, adminGuard, orderController.getAllOrders);
router.put('/:orderId/status', authGuard, adminGuard, orderController.updateOrderStatus);

module.exports = router;