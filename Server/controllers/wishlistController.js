const User = require('../models/User');

exports.getWishlist = async (req, res) => {
    try {
        // تم التعديل هنا لعمل Deep Populate
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            populate: { path: 'category' }
        });
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { wishlist: productId } },
            { new: true }
        ).populate({
            path: 'wishlist',
            populate: { path: 'category' } // Deep Populate
        });
        res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { wishlist: productId } },
            { new: true }
        ).populate({
            path: 'wishlist',
            populate: { path: 'category' } // Deep Populate
        });
        res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
    }
};