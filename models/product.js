const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price cannot be less than 0']
  },
  stock: {
    type: Number,
    min: [0, 'Stock cannot be less than 0'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: [true, 'Please add a product category']
  },
  images: {
    type: [String],
    default: [] 
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


productSchema.pre('save', function() {

  const currentStock = this.stock ?? 0;
  this.inStock = currentStock > 0;
});

module.exports = mongoose.model('Product', productSchema);
