const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authGuard = require('../middleware/auth'); // User must be logged in

router.get('/', authGuard, wishlistController.getWishlist);
router.post('/add', authGuard, wishlistController.addToWishlist);
router.delete('/remove/:productId', authGuard, wishlistController.removeFromWishlist);

module.exports = router;