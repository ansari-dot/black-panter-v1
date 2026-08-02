import Wishlist from '../models/Wishlist.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products',
    select: 'name title price regularPrice salePrice imageUrl image category slug stockStatus mainImage description',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json(wishlist.products || []);
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  const exists = wishlist.products.some(p => p && p.toString() === productId);
  if (!exists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  wishlist = await wishlist.populate({
    path: 'products',
    select: 'name title price regularPrice salePrice imageUrl image category slug stockStatus mainImage description',
  });

  res.json(wishlist.products || []);
});

// @desc    Remove product from wishlist
// @route   POST /api/wishlist/remove or DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.body.productId || req.params.productId;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  wishlist.products = wishlist.products.filter(p => p && p.toString() !== productId);
  await wishlist.save();

  wishlist = await wishlist.populate({
    path: 'products',
    select: 'name title price regularPrice salePrice imageUrl image category slug stockStatus mainImage description',
  });

  res.json(wishlist.products || []);
});

// @desc    Clear user wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true, upsert: true }
  );

  res.json([]);
});
