import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Special Care'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);
