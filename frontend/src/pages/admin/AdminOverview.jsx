import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
  Users, ShoppingBag, MessageSquareWarning, DollarSign,
  TrendingUp, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  Package, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, bg, change }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        {change !== undefined && (
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

const statusColors = {
  'Pending': 'bg-amber-100 text-amber-700',
  'Picked Up': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-indigo-100 text-indigo-700',
  'Ready': 'bg-teal-100 text-teal-700',
  'Delivered': 'bg-emerald-100 text-emerald-700',
};

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/analytics');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <Package size={200} className="absolute -right-10 -top-10" />
        </div>
        <h2 className="text-2xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-indigo-200 mt-1">Here's what's happening with The Laundry Lounge today.</p>
        <button onClick={fetchAnalytics} className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-semibold">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingBag} color="text-violet-600" bg="bg-violet-50" />
        <StatCard title="Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Open Complaints" value={stats?.openComplaints ?? 0} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Pending', val: stats?.pendingOrders ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Progress', val: stats?.inProgressOrders ?? 0, icon: RefreshCw, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Delivered', val: stats?.deliveredOrders ?? 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{item.label} Orders</p>
              <p className="text-2xl font-bold text-slate-800">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {data?.recentOrders?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700 text-sm">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
