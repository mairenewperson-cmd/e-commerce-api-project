const Cart = require('../models/cart');
const Product = require('../models/product');
const asyncHandler = require('../utils/asynchandler'); 
const AppError = require('../utils/apperror');
const GUEST_USER_ID = 'default-guest-session';

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ userId: GUEST_USER_ID });
  if (!cart) {
    cart = new Cart({ userId: GUEST_USER_ID, items: [], totalPrice: 0 });
    await cart.save();
  }
  await cart.populate('items.product');
  res.status(200).json({ status: 'success', message: 'Cart fetched', data: cart });
});

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(new AppError('Please provide productId and quantity', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  if (product.stock < quantity) {
    return next(new AppError('Not enough stock available', 400));
  }


  let cart = await Cart.findOne({ userId: GUEST_USER_ID });
  if (!cart) {
    cart = new Cart({ userId: GUEST_USER_ID, items: [], totalPrice: 0 });
  }


  const existingItem = cart.items.find(item => item.product.toString() === productId);
  const existingQty = existingItem ? existingItem.quantity : 0;
  if (product.stock < (existingQty + Number(quantity))) {
    return next(new AppError(`Not enough stock. You already have ${existingQty} in cart, and available stock is ${product.stock}.`, 400));
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += Number(quantity);
    cart.items[itemIndex].price = product.price;
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
  }

  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  await cart.save();
  res.status(200).json({ status: 'success', message: 'Item added to cart', data: cart });
});


exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    return next(new AppError('Quantity cannot be negative or missing', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  let cart = await Cart.findOne({ userId: GUEST_USER_ID });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    if (product.stock < quantity) {
      return next(new AppError('Not enough stock available', 400));
    }
    cart.items[itemIndex].quantity = Number(quantity);
    cart.items[itemIndex].price = product.price;
  }

  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  await cart.save();
  res.status(200).json({ status: 'success', message: 'Cart updated', data: cart });
});


exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  
  let cart = await Cart.findOne({ userId: GUEST_USER_ID });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  await cart.save();
  res.status(200).json({ status: 'success', message: 'Item removed', data: cart });
});

exports.clearCart = asyncHandler(async (req, res, next) => {

  let cart = await Cart.findOne({ userId: GUEST_USER_ID });
  if (!cart) {
    cart = new Cart({ userId: GUEST_USER_ID, items: [], totalPrice: 0 });
  } else {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.status(200).json({ status: 'success', message: 'Cart cleared', data: cart });
});