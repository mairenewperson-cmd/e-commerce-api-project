const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cartcontroller');

router.route('/').get(getCart).delete(clearCart);
router.route('/items').post(addItemToCart);
router.route('/items/:productId').patch(updateItemQuantity).delete(removeItemFromCart);

module.exports = router;