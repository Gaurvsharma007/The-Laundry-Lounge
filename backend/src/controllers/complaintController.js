import Complaint from '../models/Complaint.js';

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = async (req, res) => {
  try {
    const { orderId, subject, description } = req.body;

    const complaint = new Complaint({
      user: req.user._id,
      orderId: orderId || null,
      subject,
      description,
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user complaints
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const complaints = await Complaint.find(query)
      .populate('user', 'id name email')
      .populate('orderId', '_id status')
      .sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = req.body.status || complaint.status;
    complaint.resolution = req.body.resolution || complaint.resolution;

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
