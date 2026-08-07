import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Verification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Auto-focus prev input on backspace
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      return toast.error('Please enter all 6 digits');
    }

    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Account successfully verified!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-secondary dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2rem] shadow-glass border border-gray-100 dark:border-gray-700 overflow-hidden relative"
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>

        <div className="p-8 sm:p-10 relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/30">
            <ShieldCheck size={40} />
          </div>
          
          <h2 className="text-3xl font-extrabold text-dark dark:text-white font-heading mb-2">Verify Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We've sent a 6-digit verification code to <br/>
            <span className="font-bold text-dark dark:text-white">{user?.email || 'your email address'}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-10">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-extrabold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary text-dark dark:text-white transition-all outline-none"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isVerifying}
              className="w-full btn btn-primary flex justify-center items-center py-4 rounded-xl text-lg shadow-lg shadow-primary/30"
            >
              {isVerifying ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Verify Account <ArrowRight size={20} className="ml-2" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button className="font-bold text-primary hover:text-primary-dark transition-colors">
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Verification;
