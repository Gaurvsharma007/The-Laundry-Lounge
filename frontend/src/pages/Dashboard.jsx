import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, AlertCircle, Plus, ArrowRight, Activity, MapPin, ChevronRight, Search, Loader2, CheckCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const STATUS_META = {
  'Pending':     { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', dot: 'bg-yellow-400' },
  'Picked Up':   { color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-100 dark:bg-blue-900/30',   dot: 'bg-blue-400' },
  'In Progress': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', dot: 'bg-purple-400 animate-pulse' },
  'Ready':       { color: 'text-teal-600 dark:text-teal-400',   bg: 'bg-teal-100 dark:bg-teal-900/30',   dot: 'bg-teal-400' },
  'Delivered':   { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', dot: 'bg-green-400' },
};

const fmtTime = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } catch (err) {
        setError('Could not load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(o => !['Delivered'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Delivered');
  const recentOrders = orders.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const stats = [
    {
      title: 'Active Orders',
      value: loading ? '…' : activeOrders.length,
      icon: <Activity size={22} />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      link: '/track',
    },
    {
      title: 'Completed',
      value: loading ? '…' : completedOrders.length,
      icon: <CheckCircle size={22} />,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      link: '/track',
    },
    {
      title: 'Total Spent',
      value: loading ? '…' : `₹${orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toFixed(0)}`,
      icon: <Package size={22} />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      link: '/track',
    },
  ];

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-10 transition-colors duration-300">
      <div className="container-custom max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800"
        >
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-dark dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Here's what's happening with your laundry today.</p>
          </div>
          <Link to="/book" className="btn btn-primary shadow-primary/30">
            <Plus size={20} /> New Order
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all hover:shadow-md cursor-default"
            >
              <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-dark dark:text-white mt-0.5">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Recent Orders – Left 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-dark dark:text-white font-heading">Recent Orders</h2>
                <Link
                  to="/track"
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="py-14 flex flex-col items-center gap-3 text-gray-400">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p className="text-sm">Loading orders…</p>
                </div>
              ) : error ? (
                <div className="py-14 flex flex-col items-center gap-3 text-center px-6">
                  <AlertCircle size={36} className="text-red-400" />
                  <p className="text-red-500 font-semibold text-sm">{error}</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-5 border border-gray-100 dark:border-gray-800">
                    <Package className="text-gray-300 dark:text-gray-600" size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-dark dark:text-white mb-1">No Active Orders</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-7 max-w-sm text-sm">
                    You don't have any laundry orders right now. Book a pickup to get started!
                  </p>
                  <Link to="/book" className="btn btn-outline dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    Book Laundry Pickup <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {recentOrders.map((order) => {
                    const meta = STATUS_META[order.status] || STATUS_META['Pending'];
                    return (
                      <Link
                        key={order._id}
                        to="/track"
                        state={{ openOrder: order._id }}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-dark dark:text-white text-sm">
                              #{order.trackingId || order._id?.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{fmtTime(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                            {order.status}
                          </span>
                          <span className="font-bold text-dark dark:text-white text-sm">₹{order.totalAmount?.toFixed(0)}</span>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-5"
          >
            {/* Track Order CTA */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Search size={18} />
                <h3 className="font-bold">Track an Order</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">Search by Tracking ID to get real-time status.</p>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
              >
                Open Tracker <ArrowRight size={14} />
              </Link>
            </div>

            {/* Default Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-dark dark:text-white text-sm">Default Address</h3>
                <Link to="/profile" className="text-xs text-primary font-semibold hover:underline">Edit</Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="text-gray-400 shrink-0 mt-0.5" size={15} />
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {user?.address || '123 Laundry Lane, Apt 4B'}<br />
                  {user?.phone || '+91 98765 43210'}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-dark dark:text-white text-sm mb-3">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { to: '/track', label: 'My Orders' },
                  { to: '/profile', label: 'My Profile' },
                  { to: '/services', label: 'Pricing & Services' },
                  { to: '/complaints', label: 'Support & Complaints' },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
                  >
                    <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">{link.label}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
