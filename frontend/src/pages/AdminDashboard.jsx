import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, AlertCircle, DollarSign, Activity, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all admin data
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [ordersRes, usersRes, complaintsRes] = await Promise.all([
        axios.get('/api/orders', config),
        axios.get('/api/users', config),
        axios.get('/api/complaints', config)
      ]);

      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setComplaints(complaintsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const newUsers = users.length;

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order status updated!');
      fetchData(); // Refresh data
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/complaints/${id}`, { status, resolution: 'Resolved by Admin' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint status updated!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update complaint');
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Active Orders', value: activeOrders.toString(), icon: <Activity size={24} />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Users', value: newUsers.toString(), icon: <Users size={24} />, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin-slow rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-10 transition-colors duration-300">
      <div className="container-custom">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-dark dark:text-white font-heading">Admin Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage your laundry operations.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-semibold">{stat.label}</p>
                <h3 className="text-2xl font-bold text-dark dark:text-white font-heading">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-8 py-5 font-bold transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
            >
              <ShoppingBag size={20} /> Manage Orders
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-8 py-5 font-bold transition-colors whitespace-nowrap ${activeTab === 'users' ? 'text-purple-500 border-b-2 border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
            >
              <Users size={20} /> Registered Users
            </button>
            <button 
              onClick={() => setActiveTab('complaints')}
              className={`flex items-center gap-2 px-8 py-5 font-bold transition-colors whitespace-nowrap ${activeTab === 'complaints' ? 'text-red-500 border-b-2 border-red-500 bg-red-50 dark:bg-red-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
            >
              <AlertCircle size={20} /> Support Tickets
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-500 text-sm border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-3 font-semibold px-4">Order ID</th>
                      <th className="pb-3 font-semibold px-4">Customer</th>
                      <th className="pb-3 font-semibold px-4">Items</th>
                      <th className="pb-3 font-semibold px-4">Total</th>
                      <th className="pb-3 font-semibold px-4">Status</th>
                      <th className="pb-3 font-semibold px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-500">No orders found.</td></tr>}
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-dark dark:text-white">#{order._id.substring(18).toUpperCase()}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-dark dark:text-white">{order.user?.name || 'Unknown'}</span>
                            {order.user?.email && <span className="text-xs text-gray-500 dark:text-gray-400">📧 {order.user.email}</span>}
                            {order.user?.phone && <span className="text-xs text-gray-500 dark:text-gray-400">📱 {order.user.phone}</span>}
                            {order.address && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">📍 {order.address}</span>}
                            {order.pickupDate && <span className="text-xs text-gray-500 dark:text-gray-400">📅 {new Date(order.pickupDate).toLocaleString()}</span>}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {order.items?.map((item, i) => (
                              <span key={i} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md w-max">
                                {item.quantity}x {item.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-dark dark:text-white">₹{order.totalAmount}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            order.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            className="text-sm bg-gray-100 dark:bg-gray-700 text-dark dark:text-white rounded-lg px-2 py-1 outline-none border border-gray-200 dark:border-gray-600"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Picked Up">Picked Up</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-500 text-sm border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-3 font-semibold px-4">Name</th>
                      <th className="pb-3 font-semibold px-4">Email</th>
                      <th className="pb-3 font-semibold px-4">Role</th>
                      <th className="pb-3 font-semibold px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && <tr><td colSpan="4" className="text-center py-6 text-gray-500">No users found.</td></tr>}
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-dark dark:text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">{u.name.charAt(0)}</div>
                          {u.name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'complaints' && (
              <div className="space-y-4">
                {complaints.length === 0 && <div className="text-center py-6 text-gray-500">No complaints found.</div>}
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-dark dark:text-white text-lg">{complaint.subject}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From: <span className="font-semibold">{complaint.user?.name}</span> • Order: #{complaint.orderId?._id.substring(18).toUpperCase() || 'N/A'}</p>
                      </div>
                      
                      {complaint.status !== 'Resolved' && (
                        <button 
                          onClick={() => updateComplaintStatus(complaint._id, 'Resolved')}
                          className="text-sm font-bold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} /> Mark Resolved
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-4 rounded-xl text-sm border border-gray-100 dark:border-gray-800">
                      "{complaint.description}"
                    </p>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
