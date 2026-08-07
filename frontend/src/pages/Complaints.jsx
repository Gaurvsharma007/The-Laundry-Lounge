import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    orderId: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Complaint submitted successfully');
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-16 transition-colors duration-300">
      <div className="container-custom max-w-5xl">
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left side info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-5/12 space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white font-heading mb-4 leading-tight">We're Here to Help.</h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Your satisfaction is our priority. Let us know what went wrong, and we'll fix it immediately.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <h3 className="font-bold text-xl text-dark dark:text-white">Our Resolution Process</h3>
              </div>
              <ul className="space-y-5 text-gray-600 dark:text-gray-300">
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Submit your detailed complaint ticket</span>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Support team reviews within 24 hours</span>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Investigation and swift resolution</span>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <span>Follow-up & compensation applied</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right side form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:w-7/12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-glass border border-gray-100 dark:border-gray-700 p-8 md:p-10 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-dark dark:text-white mb-4">Ticket Submitted!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto">
                      Thank you for bringing this to our attention. Our team will review your ticket #TCK-8923 and email you shortly.
                    </p>
                    <button 
                      onClick={() => { setSubmitted(false); setFormData({orderId: '', subject: '', description: ''}); }} 
                      className="btn btn-outline dark:text-gray-300 dark:border-gray-600"
                    >
                      Submit Another Ticket
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 relative z-10"
                  >
                    {!user && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-xl mb-8">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          You are submitting this as a guest. <Link to="/login" className="font-bold underline hover:text-blue-800 dark:hover:text-blue-200">Log in</Link> to link this to your account.
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Order ID (Optional)</label>
                        <input
                          type="text"
                          name="orderId"
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none"
                          placeholder="e.g. ORD-12345"
                          value={formData.orderId}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                        <select
                          name="subject"
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none appearance-none"
                          value={formData.subject}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select a subject</option>
                          <option value="Late Delivery">Late Delivery</option>
                          <option value="Damaged Item">Damaged Item</option>
                          <option value="Missing Item">Missing Item</option>
                          <option value="Poor Cleaning Quality">Poor Cleaning Quality</option>
                          <option value="Billing Issue">Billing Issue</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Description</label>
                      <textarea
                        name="description"
                        required
                        rows="6"
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none resize-none"
                        placeholder="Please describe what happened in detail..."
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn btn-primary w-full py-4 rounded-xl text-lg mt-4 flex justify-center items-center gap-2 shadow-lg shadow-primary/30"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <><Send size={20} /> Submit Ticket</>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
