import { useState, useEffect, useContext } from 'react';
import { Search, Package, CheckCircle, Truck, Clock, ChevronRight, AlertCircle, RefreshCw, WashingMachine, Loader2, X, CalendarDays, MapPin, CreditCard, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// ─── Status helpers ───────────────────────────────────────────────
const STATUS_ORDER = ['Pending', 'Picked Up', 'In Progress', 'Ready', 'Delivered'];

const STATUS_META = {
  'Pending':     { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', dot: 'bg-yellow-400', label: 'Pending' },
  'Picked Up':   { color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-100 dark:bg-blue-900/30',   dot: 'bg-blue-400',   label: 'Picked Up' },
  'In Progress': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', dot: 'bg-purple-400 animate-pulse', label: 'In Progress' },
  'Ready':       { color: 'text-teal-600 dark:text-teal-400',   bg: 'bg-teal-100 dark:bg-teal-900/30',   dot: 'bg-teal-400',   label: 'Ready for Delivery' },
  'Delivered':   { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', dot: 'bg-green-400',   label: 'Delivered' },
};

const STEP_ICONS = {
  'Pending':     <Clock size={20} />,
  'Picked Up':   <Truck size={20} />,
  'In Progress': <WashingMachine size={20} />,
  'Ready':       <Package size={20} />,
  'Delivered':   <CheckCircle size={20} />,
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

// ─── Order Status Timeline ────────────────────────────────────────
const OrderTimeline = ({ status }) => {
  const currentIdx = STATUS_ORDER.indexOf(status);
  return (
    <div className="relative flex flex-col gap-0">
      {STATUS_ORDER.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const pending = idx > currentIdx;
        const meta = STATUS_META[step];
        return (
          <div key={step} className="flex items-start gap-4 relative">
            {/* Connector line */}
            {idx < STATUS_ORDER.length - 1 && (
              <div className={`absolute left-[19px] top-10 w-0.5 h-8 ${done || active ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
            {/* Icon bubble */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all
              ${done ? 'bg-primary border-primary text-white' :
                active ? 'bg-white dark:bg-gray-800 border-primary text-primary shadow-md shadow-primary/20' :
                'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'}`}>
              {STEP_ICONS[step]}
            </div>
            {/* Label */}
            <div className={`pb-8 pt-1.5 ${pending ? 'opacity-40' : ''}`}>
              <p className={`font-semibold text-sm ${active ? 'text-primary' : 'text-dark dark:text-white'}`}>
                {STATUS_META[step].label}
              </p>
              {active && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Currently in this stage</p>
              )}
              {done && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Completed</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Order Detail Card ────────────────────────────────────────────
const OrderDetailCard = ({ order, onClose }) => {
  const meta = STATUS_META[order.status] || STATUS_META['Pending'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-glass overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="font-bold text-xl text-dark dark:text-white">
              #{order.trackingId || order._id?.slice(-8).toUpperCase()}
            </h3>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.color}`}>
              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {fmtTime(order.createdAt)}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1">
            <X size={22} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left: Timeline */}
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
          <h4 className="font-bold text-dark dark:text-white mb-6 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Order Progress</h4>
          <OrderTimeline status={order.status} />
        </div>

        {/* Right: Details */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Order items */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Items</h4>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-dark dark:text-white font-medium">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">×{item.quantity}</span>
                    <span className="text-dark dark:text-white font-semibold">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between font-bold">
                <span className="text-dark dark:text-white">Total</span>
                <span className="text-primary">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div className="space-y-3">
            {order.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{order.address}</span>
              </div>
            )}
            {order.pickupDate && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays size={15} className="text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">Pickup: {fmt(order.pickupDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <CreditCard size={15} className="text-gray-400 shrink-0" />
              <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                {order.paymentStatus === 'Paid' ? 'Paid' : 'Payment Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Order Row in list ────────────────────────────────────────────
const OrderRow = ({ order, onClick }) => {
  const meta = STATUS_META[order.status] || STATUS_META['Pending'];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      className="w-full text-left flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
          <Package size={20} />
        </div>
        <div>
          <p className="font-bold text-dark dark:text-white text-sm">
            #{order.trackingId || order._id?.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{fmtTime(order.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
        <span className="text-dark dark:text-white font-bold text-sm">₹{order.totalAmount?.toFixed(2)}</span>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
      </div>
    </motion.button>
  );
};

// ─── Main Component ───────────────────────────────────────────────
const TrackOrder = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(user ? 'myorders' : 'search');
  const [searchId, setSearchId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myOrdersError, setMyOrdersError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch user's orders if logged in
  const fetchMyOrders = async () => {
    if (!user) return;
    setMyOrdersLoading(true);
    setMyOrdersError('');
    try {
      const res = await axios.get('/api/orders');
      setMyOrders(res.data);
    } catch (err) {
      setMyOrdersError(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setMyOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  // Public track by tracking ID
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setSearchLoading(true);
    setSearchResult(null);
    setSearchError('');
    try {
      const res = await axios.get(`/api/orders/track/${searchId.trim()}`);
      setSearchResult(res.data);
    } catch (err) {
      setSearchError(err.response?.data?.message || 'Order not found. Please check your tracking ID.');
    } finally {
      setSearchLoading(false);
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? myOrders
    : myOrders.filter(o => o.status === filterStatus);

  const tabs = [
    ...(user ? [{ id: 'myorders', label: 'My Orders' }] : []),
    { id: 'search', label: 'Track by ID' },
  ];

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-14 transition-colors duration-300">
      <div className="container-custom max-w-4xl">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Package size={16} />
            Order Tracking
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white font-heading mb-3">
            Track Your Laundry
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            {user
              ? 'View all your orders or search by tracking ID.'
              : 'Enter your order tracking ID to see the current status of your laundry.'}
          </p>
        </motion.div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 w-fit mx-auto"
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedOrder(null); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── MY ORDERS TAB ─── */}
          {activeTab === 'myorders' && user && (
            <motion.div
              key="myorders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {selectedOrder ? (
                <div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-4"
                  >
                    ← Back to Orders
                  </button>
                  <OrderDetailCard order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-glass overflow-hidden">
                  {/* List header */}
                  <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-dark dark:text-white text-lg">Order History</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Filter */}
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                        <ListFilter size={14} className="text-gray-400" />
                        <select
                          value={filterStatus}
                          onChange={e => setFilterStatus(e.target.value)}
                          className="text-sm bg-transparent text-dark dark:text-white font-medium outline-none cursor-pointer"
                        >
                          <option value="All">All Status</option>
                          {STATUS_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <button
                        onClick={fetchMyOrders}
                        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        <RefreshCw size={14} className={myOrdersLoading ? 'animate-spin' : ''} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 md:p-4">
                    {myOrdersLoading ? (
                      <div className="py-16 flex flex-col items-center gap-4 text-gray-400">
                        <Loader2 size={36} className="animate-spin text-primary" />
                        <p>Loading your orders…</p>
                      </div>
                    ) : myOrdersError ? (
                      <div className="py-16 flex flex-col items-center gap-3 text-center">
                        <AlertCircle size={40} className="text-red-400" />
                        <p className="text-red-500 font-semibold">{myOrdersError}</p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="py-16 flex flex-col items-center gap-4 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center">
                          <Package size={36} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-dark dark:text-white text-lg">No orders found</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs">
                            {filterStatus !== 'All' ? `No orders with status "${filterStatus}".` : "You haven't placed any orders yet."}
                          </p>
                        </div>
                        {filterStatus === 'All' && (
                          <Link to="/book" className="btn btn-primary mt-2">Book a Pickup</Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredOrders.map((order) => (
                          <OrderRow
                            key={order._id}
                            order={order}
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── SEARCH TAB ─── */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search box */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-glass border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-6 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 relative z-10">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Tracking ID (e.g., LL-A3F9B2)"
                      className="pl-12 w-full px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none text-base"
                      value={searchId}
                      onChange={(e) => { setSearchId(e.target.value); setSearchError(''); setSearchResult(null); }}
                      required
                    />
                    {searchId && (
                      <button
                        type="button"
                        onClick={() => { setSearchId(''); setSearchResult(null); setSearchError(''); }}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={searchLoading || !searchId.trim()}
                    className="btn btn-primary py-4 px-8 whitespace-nowrap rounded-2xl text-base flex justify-center items-center gap-2 disabled:opacity-60"
                  >
                    {searchLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={18} />}
                    {searchLoading ? 'Searching…' : 'Track Order'}
                  </button>
                </form>
                {!user && (
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                    <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link> to see all your orders in one place.
                  </p>
                )}
              </div>

              {/* Error */}
              <AnimatePresence>
                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 mb-6 overflow-hidden"
                  >
                    <AlertCircle size={20} className="text-red-500 shrink-0" />
                    <p className="text-red-600 dark:text-red-400 font-semibold text-sm">{searchError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result */}
              <AnimatePresence>
                {searchResult && (
                  <OrderDetailCard order={searchResult} />
                )}
              </AnimatePresence>

              {/* Empty state hint */}
              {!searchResult && !searchError && !searchLoading && (
                <div className="text-center mt-8 text-gray-400 dark:text-gray-600">
                  <Package size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Your order details will appear here</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrder;
