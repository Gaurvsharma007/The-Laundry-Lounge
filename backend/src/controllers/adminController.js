import User from '../models/User.js';
import Order from '../models/Order.js';
import Complaint from '../models/Complaint.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const inProgressOrders = await Order.countDocuments({ status: 'In Progress' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const openComplaints = await Complaint.countDocuments({ status: 'Open' });

    const revenueAgg = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers, totalOrders, totalComplaints, totalRevenue,
          pendingOrders, inProgressOrders, deliveredOrders, openComplaints,
        },
        monthlyOrders,
        recentOrders,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent notifications (new orders + open complaints)
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getNotifications = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Recent orders (last 7 days)
    const recentOrders = await Order.find({ createdAt: { $gte: sevenDaysAgo } })
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    // Open / In-Progress complaints
    const openComplaints = await Complaint.find({
      status: { $in: ['Open', 'In Progress'] }
    })
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    // Merge into a unified notifications list
    const notifications = [
      ...recentOrders.map(o => ({
        id: o._id,
        type: 'order',
        title: 'New Order Placed',
        message: `${o.user?.name || 'A customer'} placed an order for ₹${o.totalAmount}`,
        status: o.status,
        link: '/admin/orders',
        time: o.createdAt,
      })),
      ...openComplaints.map(c => ({
        id: c._id,
        type: 'complaint',
        title: c.status === 'Open' ? 'New Complaint' : 'Complaint In Progress',
        message: `${c.user?.name || 'A customer'}: "${c.subject}"`,
        status: c.status,
        link: '/admin/complaints',
        time: c.createdAt,
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 15);

    res.json({
      success: true,
      data: notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Get all users (excludes admin accounts)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    // Always exclude admin accounts — admins are not customers
    const query = { role: { $ne: 'admin' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (cannot promote to admin via this route)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Only allow toggling between user/operator — not promoting to admin
    if (!['user', 'operator'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Admins cannot be created via this route.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Protect admin accounts from being demoted via this route
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot be modified via this route' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    let orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      orders = orders.filter(o =>
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o._id.toString().includes(search)
      );
    }

    const total = await Order.countDocuments(query);
    res.json({ success: true, data: orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    if (req.body.deliveryDate) order.deliveryDate = req.body.deliveryDate;

    const updated = await order.save();
    await updated.populate('user', 'name email phone');
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints (admin)
// @route   GET /api/admin/complaints
// @access  Private/Admin
export const getAllComplaints = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .populate('orderId', '_id status')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: complaints, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/admin/complaints/:id
// @access  Private/Admin
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    complaint.status = req.body.status || complaint.status;
    complaint.resolution = req.body.resolution || complaint.resolution;

    const updated = await complaint.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
