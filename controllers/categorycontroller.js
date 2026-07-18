console.log("-> RUNNING CONTROLLER FROM:", __filename);const Category = require('../models/category'); 


const asyncHandler = require('../utils/asynchandler');
const AppError = require('../utils/apperror');

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ status: 'success', message: 'Categories fetched', data: categories });
});


exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }
  
  res.status(200).json({ status: 'success', message: 'Category fetched', data: category });
});


exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const newCategory = await Category.create({ name, description });
  
  res.status(201).json({ status: 'success', message: 'Category created', data: newCategory });
});


exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  if (name) category.name = name;
  if (description) category.description = description;


  await category.save();

  res.status(200).json({ status: 'success', message: 'Category updated', data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  
  if (!deleted) {
    return next(new AppError('No category found with that ID', 404));
  }
  
  res.status(200).json({ status: 'success', message: 'Category deleted' });
});
