const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartcontroller'); // Adjust path

const {
getCart,
addToCart,
updateCart,
removeFromCart,
clearCart
} = require(" .. /controllers/cartcontroller");
const cartValidator = require(" .. /controllers/cartcontroller");
const validatorMiddleware = require(" .. /middleware/errorhandler");
router.route('/').get(getCart).delete(clearCart);
router.route('/items').post(addItemToCart);
router.route('/items/:productId').patch(updateItemQuantity).delete(removeItemFromCart);


// Define the POST endpoint for adding items
router.post('/add', cartcontroller.addItemToCart);

module.exports = router;