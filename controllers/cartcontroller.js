const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [], totalPrice: 0 });
    await cart.save();
  }
  await cart.populate('items.product');
  res.json({ status: 'success', message: 'Cart fetched', data: cart });
});

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ status: 'fail', message: 'Not enough stock' });
  }

  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [], totalPrice: 0 });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    // Update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  // Recalculate totalPrice
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await cart.save();

  res.json({ status: 'success', message: 'Item added to cart', data: cart });
});

exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 0) {
    return res.status(400).json({ status: 'fail', message: 'Quantity cannot be negative' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }

  let cart = await Cart.findOne();
  if (!cart) {
    return res.status(404).json({ status: 'fail', message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ status: 'fail', message: 'Item not in cart' });
  }

  if (quantity === 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    if (product.stock < quantity) {
      return res.status(400).json({ status: 'fail', message: 'Not enough stock' });
    }
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate totalPrice
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await cart.save();

  res.json({ status: 'success', message: 'Cart updated', data: cart });
});

exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  let cart = await Cart.findOne();
  if (!cart) {
    return res.status(404).json({ status: 'fail', message: 'Cart not found' });
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  // Recalculate totalPrice
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await cart.save();

  res.json({ status: 'success', message: 'Item removed', data: cart });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [], totalPrice: 0 });
  } else {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.json({ status: 'success', message: 'Cart cleared', data: cart });
});