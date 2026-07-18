const Product = require('../models/product'); 
const Category = require('../models/category');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asynchandler');
const AppError = require('../utils/apperror'); 

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;

  const filter = {};

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const matchedCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${category}$`, 'i') }
      });

      if (matchedCategory) {
        filter.category = matchedCategory._id;
      } else {
        return res.json({ status: 'success', message: 'Products fetched', data: [] });
      }
    }
  }

  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  
  if (inStock !== undefined) {
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    } else {
      filter.stock = 0;
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).populate('category', 'name description');

  res.json({ status: 'success', message: 'Products fetched', data: products });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  
  res.json({ status: 'success', message: 'Product fetched', data: product });
});


exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, category, images } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError('Category validation failed: The specified category ID does not exist', 400));
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
      return next(new AppError('Category validation failed: The specified category ID does not exist', 400));
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price, stock, category, images },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return next(new AppError('Product not found', 404));
  }

  res.json({ status: 'success', message: 'Product updated', data: updatedProduct });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  
  if (!deleted) {
    return next(new AppError('Product not found', 404));
  }
  
  res.json({ status: 'success', message: 'Product deleted' });
});
