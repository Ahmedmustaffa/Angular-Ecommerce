const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authGuard = require('../middleware/auth');
const adminGuard = require('../middleware/admin');

router.get('/', categoryController.getAllCategories);
router.post('/', authGuard, adminGuard, categoryController.createCategory);
router.put('/:id', authGuard, adminGuard, categoryController.updateCategory);
router.delete('/:id', authGuard, adminGuard, categoryController.deleteCategory);

module.exports = router;