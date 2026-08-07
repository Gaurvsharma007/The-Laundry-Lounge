import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Trash2, Edit2, ChevronDown, User2, Wrench, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const roleConfig = {
  user:     { label: 'User',     color: 'bg-sky-100 text-sky-700',    icon: User2  },
  operator: { label: 'Operator', color: 'bg-amber-100 text-amber-700', icon: Wrench },
};

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialise from URL param (set by AdminLayout Quick Search)
  const [search, setSearch]           = useState(searchParams.get('search') || '');
  const [roleFilter, setRoleFilter]   = useState('');
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole]         = useState('');

  // Debounced search — only fires 400ms after user stops typing
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      // No role param — backend always excludes admins
      const res = await axios.get('/api/admin/users', { params });
      setUsers(res.data.data || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Sync URL param so back-button works
  useEffect(() => {
    if (search.trim()) {
      setSearchParams({ search: search.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [search]);

  // Client-side role filter (since backend always returns non-admin users)
  const filteredUsers = roleFilter
    ? users.filter(u => u.role === roleFilter)
    : users;

  const handleUpdateRole = async () => {
    try {
      await axios.put(`/api/admin/users/${editingUser._id}/role`, { role: newRole });
      toast.success(`Role updated to "${newRole}"`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filter (client-side) */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white transition cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="operator">Operator</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Users Table ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">
            All Users <span className="text-slate-400 font-normal text-base">({filteredUsers.length})</span>
          </h3>
          {search && (
            <p className="text-xs text-slate-400">
              Showing results for <span className="font-semibold text-slate-600">"{search}"</span>
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-400">
                {search ? `No users matching "${search}"` : 'No users found'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(user => {
                  const rc = roleConfig[user.role] || roleConfig.user;
                  const RoleIcon = rc.icon;
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700 text-sm">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${rc.color}`}>
                          <RoleIcon size={11} /> {rc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditingUser(user); setNewRole(user.role); }}
                            className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                            title="Change role"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Role Edit Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-800 mb-1">Change User Role</h3>
              <p className="text-sm text-slate-500 mb-5">{editingUser.name} — {editingUser.email}</p>
              <div className="space-y-2 mb-6">
                {Object.entries(roleConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setNewRole(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left
                        ${newRole === key ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <Icon size={16} className={newRole === key ? 'text-indigo-600' : 'text-slate-400'} />
                      <span className={`font-semibold text-sm ${newRole === key ? 'text-indigo-700' : 'text-slate-600'}`}>
                        {config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleUpdateRole} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
