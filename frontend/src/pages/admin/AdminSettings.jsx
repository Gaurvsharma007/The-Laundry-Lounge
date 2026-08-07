import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Mail, Phone, Calendar } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-5">Admin Profile</h3>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-800">{user?.name}</h4>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold mt-1">
              <Shield size={11} /> Administrator
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Mail size={16} className="text-slate-400" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={16} className="text-slate-400" />
            <span className="text-sm">{user?.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-sm">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
        <h4 className="font-semibold text-amber-800 mb-2">Security Note</h4>
        <p className="text-sm text-amber-700">
          To change admin password or email, use the database or contact your system administrator. 
          Password reset via email will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
