import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card overflow-hidden p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-dark font-heading">Reset Password</h2>
          <p className="text-muted mt-2">Enter your email to receive a password reset link</p>
        </div>

        {submitted ? (
          <div className="text-center animate-fade-in-up">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6">
              A reset link has been sent to <strong>{email}</strong>. Please check your inbox.
            </div>
            <Link to="/login" className="btn btn-outline w-full justify-center">
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn btn-primary flex justify-center py-3"
            >
              Send Reset Link <ArrowRight size={18} />
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm font-semibold text-primary hover:text-primary-dark">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
