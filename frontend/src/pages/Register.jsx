import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    
    setIsLoading(true);
    
    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-secondary dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-[2rem] shadow-glass border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* Info Side */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary to-blue-600 p-12 text-white md:w-2/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <Link to="/" className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-12 shadow-sm">
              <Shirt size={24} className="fill-white/20" />
            </Link>
            <h2 className="text-4xl font-extrabold font-heading mb-4 leading-tight">Start your journey with us.</h2>
            <p className="mb-8 text-white/80 text-lg font-light">Create an account to experience premium laundry care delivered to your door.</p>
          </div>
          
          <div className="relative z-10">
            <div className="flex -space-x-4 mb-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-primary-dark bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold`}></div>
              ))}
            </div>
            <p className="text-sm text-white/70">Join 10,000+ users who trust our service.</p>
          </div>
        </div>
        
        {/* Form Side */}
        <div className="p-8 md:p-12 md:w-3/5">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-extrabold text-dark dark:text-white font-heading">Create Account</h2>
          </div>
          <h2 className="hidden md:block text-3xl font-extrabold text-dark dark:text-white font-heading mb-8">Create Account</h2>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-dark dark:text-white transition-all outline-none"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-dark dark:text-white transition-all outline-none"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
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
                  required
                  className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-dark dark:text-white transition-all outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
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
                  required
                  className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-dark dark:text-white transition-all outline-none"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-dark dark:text-white transition-all outline-none"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-dark dark:text-white transition-all outline-none"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex justify-center py-4 rounded-xl text-lg mt-8"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create Account <ArrowRight size={20} /></>
              )}
            </motion.button>
            
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
