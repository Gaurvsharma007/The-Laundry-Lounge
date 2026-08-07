import mongoose from 'mongoose';

const generateTrackingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LL-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trackingId: {
    type: String,
    unique: true,
    default: generateTrackingId
  },
  items: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Picked Up', 'In Progress', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  pickupDate: Date,
  deliveryDate: Date,
  address: String
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
