const express = require('express');
const ordercontroller = require('../controllers/ordercontroller');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/ordercontroller');

router.route('/').post(createOrder).get(getAllOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(updateOrderStatus);

module.exports = router;