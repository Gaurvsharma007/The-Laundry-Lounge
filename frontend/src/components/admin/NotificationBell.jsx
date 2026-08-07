import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, ShoppingBag, MessageSquareWarning, Check, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POLL_INTERVAL = 30_000; // refresh every 30 seconds

const typeConfig = {
  order: {
    icon: ShoppingBag,
    iconBg: 'bg-indigo-100 text-indigo-600',
    badge: 'bg-indigo-500',
  },
  complaint: {
    icon: MessageSquareWarning,
    iconBg: 'bg-red-100 text-red-600',
    badge: 'bg-red-500',
  },
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [loading, setLoading]             = useState(true);
  const [readIds, setReadIds]             = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('readNotifs') || '[]')); }
    catch { return new Set(); }
  });
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // ── Fetch notifications ──────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/notifications');
      const data = res.data.data || [];
      setNotifications(data);
      // Count items whose ID hasn't been read locally
      const unreadCount = data.filter(n => !readIds.has(String(n.id))).length;
      setUnread(unreadCount);
    } catch {
      // silently fail — don't toast on background poll
    } finally {
      setLoading(false);
    }
  }, [readIds]);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Mark all as read ─────────────────────────────────────
  const markAllRead = () => {
    const allIds = notifications.map(n => String(n.id));
    const newSet = new Set([...readIds, ...allIds]);
    setReadIds(newSet);
    localStorage.setItem('readNotifs', JSON.stringify([...newSet]));
    setUnread(0);
  };

  // ── Click a notification ─────────────────────────────────
  const handleClick = (notif) => {
    // Mark this one as read
    const newSet = new Set([...readIds, String(notif.id)]);
    setReadIds(newSet);
    localStorage.setItem('readNotifs', JSON.stringify([...newSet]));
    setUnread(prev => Math.max(0, prev - 1));
    setOpen(false);
    navigate(notif.link);
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          setOpen(prev => !prev);
          if (!open && unread > 0) markAllRead();
        }}
        className="relative w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
        title="Notifications"
      >
        <Bell size={18} className={unread > 0 ? 'text-indigo-600' : ''} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow"
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {notifications.length} recent activity items
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchNotifications}
                  title="Refresh"
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RefreshCw size={13} />
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    title="Mark all as read"
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Check size={12} /> All read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-sm text-slate-400">No recent notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => {
                    const isRead = readIds.has(String(notif.id));
                    const cfg = typeConfig[notif.type] || typeConfig.order;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={`${notif.type}-${notif.id}`}
                        onClick={() => handleClick(notif)}
                        className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors flex items-start gap-4 ${!isRead ? 'bg-indigo-50/40' : ''}`}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                          <Icon size={16} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-semibold truncate ${!isRead ? 'text-slate-800' : 'text-slate-600'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">
                              {timeAgo(notif.time)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            notif.status === 'Pending' || notif.status === 'Open'
                              ? 'bg-amber-100 text-amber-700'
                              : notif.status === 'Delivered' || notif.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {notif.status}
                          </span>
                        </div>

                        {/* Unread dot */}
                        {!isRead && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">Auto-refreshes every 30s</p>
                <button
                  onClick={() => { navigate('/admin/orders'); setOpen(false); }}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                >
                  View all orders →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
