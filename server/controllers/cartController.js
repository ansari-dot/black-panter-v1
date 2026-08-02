import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name title price imageUrl image category slug stockStatus',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(cart);
});

// @desc    Sync local cart with DB
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = asyncHandler(async (req, res) => {
  const { localItems } = req.body; // Array of { productId, quantity }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Merge items
  if (localItems && Array.isArray(localItems)) {
    for (const item of localItems) {
      if (!item || !item.productId) continue;
      const existingItem = cart.items.find(i => i.product && i.product.toString() === item.productId);
      if (existingItem) {
        existingItem.quantity = Math.max(existingItem.quantity, item.quantity);
      } else {
        cart.items.push({ product: item.productId, quantity: item.quantity });
      }
    }
    await cart.save();
  }

  cart = await cart.populate({
    path: 'items.product',
    select: 'name title price imageUrl image category slug stockStatus',
  });

  res.json(cart);
});

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(i => i.product && i.product.toString() === productId);

  if (existingItemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item
      cart.items.splice(existingItemIndex, 1);
    } else {
      // Update quantity
      cart.items[existingItemIndex].quantity = quantity;
    }
  } else if (quantity > 0) {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  cart = await cart.populate({
    path: 'items.product',
    select: 'name title price imageUrl image category slug stockStatus',
  });

  res.json(cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [] },
    { returnDocument: 'after' }
  );
  res.json(cart || { user: req.user._id, items: [] });
});
