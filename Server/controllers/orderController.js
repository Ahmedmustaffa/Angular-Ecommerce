const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // 1. استدعاء موديل المنتجات

exports.checkout = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // 2. خصم الكمية من المخزون قبل إتمام الطلب
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity } // تقليل المخزون بمقدار الكمية المطلوبة
            });
        }

        // 3. إنشاء الطلب الجديد
        const order = new Order({
            user: req.user.id,
            items: cart.items,
            totalAmount: cart.totalPrice,
            shippingAddress: shippingAddress
        });
        await order.save();

        // 4. تفريغ العربة
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (error) {
        res.status(500).json({ message: 'Checkout failed', error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('items.product').populate('user', 'username email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};