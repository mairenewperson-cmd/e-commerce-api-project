const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { asyncHandler, AppError } = require('../middleware/errorhandler');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (inStock !== undefined) filter.inStock = inStock === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter);

  res.json({ status: 'success', message: 'Products fetched', data: products });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });
  res.json({ status: 'success', message: 'Product fetched', data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, category, images } = req.body;

  // Validate category
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(404).json({ status: 'fail', message: 'Category not found' });
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images,
  });

  res.status(201).json({ status: 'success', message: 'Product created', data: newProduct });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, category, images } = req.body;

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price, stock, category, images },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) return res.status(404).json({ status: 'fail', message: 'Product not found' });

  res.json({ status: 'success', message: 'Product updated', data: updatedProduct });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ status: 'fail', message: 'Product not found' });
  res.json({ status: 'success', message: 'Product deleted' });
});

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc    Create a product
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  // 1. Check if the incoming category ID actually exists in the database
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return next(new AppError('Category validation failed: The specified category ID does not exist', 400));
  }

  // 2. Create product ONLY after the validation passes
  const product = await Product.create(req.body);
  
  res.status(201).json({ 
    success: true, 
    data: product 
  });
});

// @desc    Update product parameters
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ success: true, data: product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'category', 
    select: 'name description' 
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
}); 