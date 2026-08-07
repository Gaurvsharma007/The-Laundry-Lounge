import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Edit3, Save, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    address: '123 Laundry Lane, Apt 4B, New York, NY 10001'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-12 transition-colors duration-300">
      <div className="container-custom max-w-4xl">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-dark dark:text-white font-heading">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your personal information and preferences.</p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-bold">
              <Shield size={16} /> Admin Account
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Avatar Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center h-fit"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-lg shadow-primary/20">
              {formData.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-dark dark:text-white mb-1">{formData.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{user?.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
            
            <button className="w-full btn btn-outline dark:border-gray-600 dark:text-gray-300 py-2 mb-3">
              Change Password
            </button>
            <button className="w-full text-red-500 hover:text-red-700 font-semibold text-sm py-2 transition-colors">
              Delete Account
            </button>
          </motion.div>

          {/* Details Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-dark dark:text-white">Personal Information</h3>
              <button 
                onClick={() => !isEditing && setIsEditing(true)}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  isEditing ? 'text-primary' : 'text-gray-500 hover:text-primary dark:text-gray-400'
                }`}
              >
                <Edit3 size={16} /> Edit
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      className="pl-11 w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      disabled={!isEditing}
                      className="pl-11 w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    disabled={!isEditing}
                    className="pl-11 w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Default Address</label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    name="address"
                    rows="3"
                    disabled={!isEditing}
                    className="pl-11 w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-800 resize-none"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-end gap-4 pt-4"
                >
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline py-2 px-6 dark:border-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary py-2 px-6 flex items-center gap-2 shadow-primary/20">
                    <Save size={18} /> Save Changes
                  </button>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
