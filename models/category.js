const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category name is required.'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: false, 
    trim: true
  },
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});


categorySchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
});

module.exports = mongoose.model('Category', categorySchema);
