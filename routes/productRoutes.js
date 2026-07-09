const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct);

module.exports = router;
