const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get the logged-in user's cart
exports.getUserCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        // If they don't have a cart yet, create an empty one
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Add an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // 1. Verify the product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

        // 2. Find or create the user's cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });

        // 3. Check if product is already in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity if it exists
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        // 4. Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};

// Remove an item entirely from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};

// Update quantity of an item in the cart
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // 1. Verify the product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be greater than zero' });
        if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

        // 2. Find the user's cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // 3. Find the item
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        // 4. Update the quantity directly
        cart.items[itemIndex].quantity = quantity;

        // 5. Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item quantity', error: error.message });
    }
};