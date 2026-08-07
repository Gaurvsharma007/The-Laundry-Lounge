import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, MessageSquareWarning, CheckCircle2, Clock, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const statusConfig = {
  'Open':        { color: 'bg-red-100 text-red-700 border-red-200',       icon: Clock               },
  'In Progress': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: MessageSquareWarning },
  'Resolved':    { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2   },
};

const AdminComplaints = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch]             = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [complaints, setComplaints]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [expandedId, setExpandedId]     = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [updatingId, setUpdatingId]     = useState(null);

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

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await axios.get('/api/admin/complaints', { params });
      setComplaints(res.data.data || []);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  // Client-side search across subject, description, user name/email
  const filteredComplaints = debouncedSearch.trim()
    ? complaints.filter(c => {
        const q = debouncedSearch.toLowerCase();
        return (
          c.subject?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.user?.name?.toLowerCase().includes(q) ||
          c.user?.email?.toLowerCase().includes(q)
        );
      })
    : complaints;

  const handleResolve = async (complaintId) => {
    setUpdatingId(complaintId);
    try {
      await axios.put(`/api/admin/complaints/${complaintId}`, {
        status: 'Resolved',
        resolution: resolutionText.trim() || 'Resolved by admin.',
      });
      toast.success('Complaint resolved');
      setExpandedId(null);
      setResolutionText('');
      fetchComplaints();
    } catch {
      toast.error('Failed to resolve complaint');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}`, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      fetchComplaints();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, description or customer..."
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

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Complaints List ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">
            Complaints <span className="text-slate-400 font-normal">({filteredComplaints.length})</span>
          </h3>
          {search && (
            <p className="text-xs text-slate-400">
              Results for <span className="font-semibold text-slate-600">"{search}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquareWarning size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400">
              {search ? `No complaints matching "${search}"` : 'No complaints found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredComplaints.map(c => {
              const sc = statusConfig[c.status] || statusConfig['Open'];
              const StatusIcon = sc.icon;
              return (
                <div key={c._id} className="transition-colors">
                  <div
                    className="px-6 py-5 hover:bg-slate-50 cursor-pointer flex items-start gap-4"
                    onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${sc.color}`}>
                      <StatusIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{c.subject}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{c.user?.name} — {c.user?.email}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.color}`}>
                            <StatusIcon size={10} /> {c.status}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === c._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50 border-t border-slate-100"
                      >
                        <div className="px-6 py-5 space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Full Description</p>
                            <p className="text-sm text-slate-600">{c.description}</p>
                          </div>
                          {c.resolution && (
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                              <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">Resolution</p>
                              <p className="text-sm text-emerald-700">{c.resolution}</p>
                            </div>
                          )}
                          {c.status !== 'Resolved' && (
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <select
                                  defaultValue={c.status}
                                  onChange={e => handleStatusChange(c._id, e.target.value)}
                                  className="appearance-none px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                  <option value="Open">Open</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                              </div>
                              <textarea
                                rows={3}
                                placeholder="Write resolution notes..."
                                value={resolutionText}
                                onChange={e => setResolutionText(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
                              />
                              <button
                                onClick={() => handleResolve(c._id)}
                                disabled={updatingId === c._id}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                              >
                                {updatingId === c._id ? 'Saving...' : 'Mark as Resolved'}
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
