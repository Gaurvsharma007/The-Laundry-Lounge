import { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Shirt, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Track Order', path: '/track' },
  ];

  const isActive = (path) => location.pathname === path;

  // Dashboard link and label based on role
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? 'Admin Panel' : (user?.name?.split(' ')[0] || 'Dashboard');
  const DashboardIcon = isAdmin ? ShieldCheck : LayoutDashboard;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30"
          >
            <Shirt size={22} className="fill-white/20" />
          </motion.div>
          <span className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark hidden sm:block">
            The Laundry Lounge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`font-semibold transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-dark'}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Role-aware dashboard / admin link */}
              <Link
                to={dashboardPath}
                className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-full transition-colors ${
                  isAdmin
                    ? 'text-violet-600 hover:bg-violet-50 border border-violet-200'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <DashboardIcon size={18} />
                <span>{dashboardLabel}</span>
                {isAdmin && (
                  <span className="ml-1 text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-semibold text-dark hover:text-primary transition-colors px-4 py-2">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary py-2 px-5 text-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-dark z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden"
            >
              <ul className="flex flex-col gap-6 text-lg">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`block font-semibold ${isActive(link.path) ? 'text-primary' : 'text-dark'}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

                <li className="w-full h-px bg-gray-100" />

                {user ? (
                  <>
                    <li>
                      {/* Role-aware mobile dashboard link */}
                      <Link
                        to={dashboardPath}
                        className={`flex items-center gap-3 font-semibold ${isAdmin ? 'text-violet-600' : 'text-primary'}`}
                      >
                        <DashboardIcon size={20} />
                        {isAdmin ? 'Admin Panel' : 'Dashboard'}
                        {isAdmin && (
                          <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </Link>
                    </li>
                    {!isAdmin && (
                      <li>
                        <Link to="/complaints" className="font-semibold text-dark">
                          Complaints
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-500 font-semibold w-full text-left"
                      >
                        <LogOut size={20} /> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    <Link to="/login" className="btn btn-outline w-full justify-center">Log in</Link>
                    <Link to="/register" className="btn btn-primary w-full justify-center">Sign up</Link>
                  </div>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
