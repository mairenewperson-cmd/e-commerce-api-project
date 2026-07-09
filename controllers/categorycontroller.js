const Category = require('../models/category.model');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ status: 'success', message: 'Categories fetched', data: categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ status: 'fail', message: 'Category not found' });
    res.json({ status: 'success', message: 'Category fetched', data: category });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newCategory = await Category.create({ name, description, slug });
    res.status(201).json({ status: 'success', message: 'Category created', data: newCategory });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : undefined;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, slug },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) return res.status(404).json({ status: 'fail', message: 'Category not found' });
    res.json({ status: 'success', message: 'Category updated', data: updatedCategory });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'Category not found' });
    res.json({ status: 'success', message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};