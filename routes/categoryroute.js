const express = require('express');
const categorycontroller = require('../controllers/categorycontroller');

const router = express.Router();

router.route('/')
  .get(categorycontroller.getAllCategories)
  .post(categorycontroller.createCategory);

router.route('/:id')
  .get(categorycontroller.getCategory)
  .put(categorycontroller.updateCategory)
  .delete(categorycontroller.deleteCategory);

module.exports = router;