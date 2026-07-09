const mongoose = require('mongoose');

const categoryartSchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: [true, 'a category name is required.'],
    trim: true
  },
  desctription: {
    type: String,
    required: [true, 'a category description is required.']
  },
  def: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('category', categorySchema);
