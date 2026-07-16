const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController'); 

// Handles collection-wide requests and query filtering
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

// Handles single product alterations
router.route('/:id')
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;