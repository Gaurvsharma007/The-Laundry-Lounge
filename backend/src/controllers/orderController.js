import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, pickupAddress, pickupDate, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      items,
      address: pickupAddress,
      pickupDate,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    // If admin, get all orders. If user, get only their orders.
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query).populate('user', 'id name email phone').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is admin or the order belongs to them
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search/track order by trackingId (public)
// @route   GET /api/orders/track/:trackingId
// @access  Public
export const trackOrderByTrackingId = async (req, res) => {
  try {
    const trackingId = req.params.trackingId.toUpperCase().trim();
    const order = await Order.findOne({ trackingId }).populate('user', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found. Please check your tracking ID.' });
    }

    // Return safe subset of order info (no sensitive user data)
    res.json({
      _id: order._id,
      trackingId: order.trackingId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items,
      totalAmount: order.totalAmount,
      address: order.address,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
