import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Picked Up', 'In Progress', 'Ready', 'Delivered'];

const statusColors = {
  'Pending':     'bg-amber-100 text-amber-700 border-amber-200',
  'Picked Up':   'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Ready':       'bg-teal-100 text-teal-700 border-teal-200',
  'Delivered':   'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch]               = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter]   = useState('');
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId]       = useState(null);

  // 400ms debounce
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Sync URL
  useEffect(() => {
    if (search.trim()) setSearchParams({ search: search.trim() }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [search]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      // Don't send search to backend — filter client-side since backend does post-pagination filter
      const res = await axios.get('/api/admin/orders', { params });
      setOrders(res.data.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Client-side search filter across customer name, email, order ID
  const filteredOrders = debouncedSearch.trim()
    ? orders.filter(o => {
        const q = debouncedSearch.toLowerCase();
        return (
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o._id?.toLowerCase().includes(q)
        );
      })
    : orders;

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email or order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Orders Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">
            Orders <span className="text-slate-400 font-normal text-base">({filteredOrders.length})</span>
          </h3>
          {search && (
            <p className="text-xs text-slate-400">
              Results for <span className="font-semibold text-slate-600">"{search}"</span>
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              {search ? `No orders matching "${search}"` : 'No orders found'}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-8"></th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Update Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(order => (
                  <>
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <td className="px-6 py-4">
                        <ChevronRight size={16} className={`text-slate-400 transition-transform ${expandedOrder === order._id ? 'rotate-90' : ''}`} />
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-700 text-sm">{order.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            defaultValue={order.status}
                            onChange={e => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.tr
                          key={`${order._id}-expanded`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                          <td colSpan={7} className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Order Items</p>
                              {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600">{item.name || item.serviceId} × {item.quantity}</span>
                                  <span className="font-semibold text-slate-700">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                              {order.address && <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-200">📍 {order.address}</p>}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
