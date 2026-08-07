import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Shirt } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 pt-16 pb-8">
      <div className="container-custom max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white shadow-md">
                <Shirt size={18} className="fill-white/20" />
              </div>
              <span className="text-xl font-extrabold font-heading text-dark dark:text-white">
                The Laundry Lounge
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Premium laundry and dry cleaning services delivered directly to your door. We take the hassle out of laundry day so you can focus on what matters.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-dark dark:text-white mb-6 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">Wash & Fold</Link></li>
              <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">Dry Cleaning</Link></li>
              <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">Ironing</Link></li>
              <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">Commercial Laundry</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-dark dark:text-white mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/track" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">Track Order</Link></li>
              <li><Link to="/complaints" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">File a Complaint</Link></li>
              <li><Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">FAQs</Link></li>
              <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-dark dark:text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm">
                <MapPin className="text-primary shrink-0 mt-0.5" size={16} />
                <span>123 Laundry Lane<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                <Phone className="text-primary shrink-0" size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                <Mail className="text-primary shrink-0" size={16} />
                <span>support@laundrylounge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} The Laundry Lounge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <span>Made with</span>
            <span className="text-accent">♥</span>
            <span>for your clothes.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
