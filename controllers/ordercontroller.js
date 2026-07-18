const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

const asyncHandler = require('../utils/asynchandler');
const AppError = require('../utils/apperror');

const generateOrderNumber = () => {
  return 'ORD' + Math.floor(100000 + Math.random() * 900000);
};

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
    return next(new AppError('Please provide a complete shipping address containing street, city, and country.', 400));
  }

  const cart = await Cart.findOne({ userId: 'default-guest-session' }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty', 400));
  }

  for (let item of cart.items) {
    if (!item.product) {
      return next(new AppError('One of the products in your cart no longer exists', 404));
    }
    if (item.product.stock < item.quantity) {
      return next(new AppError(`Not enough stock available for ${item.product.name}`, 400));
    }
  }

  for (let item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderNumber = generateOrderNumber();

  const newOrder = await Order.create({
    orderNumber,
    items: orderItems,
    totalPrice,
    status: 'pending', 
    shippingAddress,
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: 'success', message: 'Order created successfully', data: newOrder });
});

exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ status: 'success', message: 'Orders fetched', data: orders });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Order not found with that ID', 404));
  }
  
  res.status(200).json({ status: 'success', message: 'Order fetched', data: order });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value provided', 400));
  }
  
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  
  if (!order) {
    return next(new AppError('Order not found with that ID', 404));
  }
  
  res.status(200).json({ status: 'success', message: 'Order status updated successfully', data: order });
});
