import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Truck, Clock, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
};

const Home = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 lg:pt-32 lg:pb-32 bg-secondary dark:bg-gray-900 transition-colors duration-300">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-[-10%] -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary to-blue-400 blur-[100px]"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-accent to-purple-500 blur-[100px]"
          ></motion.div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-8 border border-primary/20 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Premium Care for Your Clothes
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-dark dark:text-white mb-6 leading-[1.1] font-heading tracking-tight">
              Smart & Sustainable <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary-dark">Laundry Services</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the ultimate convenience. We pick up, clean, and deliver your garments with eco-friendly solutions and expert care.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn bg-dark text-white dark:bg-white dark:text-dark hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg flex items-center gap-2">
                  Book Pickup Now <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/track" className="btn bg-white dark:bg-gray-800 text-dark dark:text-white border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary px-8 py-4 text-lg rounded-full shadow-sm">
                  Track Order
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mt-16 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { icon: <CheckCircle2 className="text-primary" size={24} />, text: "Quality Guaranteed" },
                { icon: <Truck className="text-primary" size={24} />, text: "Free Pickup & Delivery" },
                { icon: <Clock className="text-primary" size={24} />, text: "24-48h Turnaround" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-dark dark:text-gray-200">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-white mb-4 font-heading">Our Services</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">We offer a comprehensive range of laundry and dry cleaning services tailored to your specific needs.</p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Service Card 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-secondary dark:bg-gray-800/50 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-heading text-dark dark:text-white">Wash & Fold</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">Everyday laundry, washed, dried, and perfectly folded. Ready to be put away.</p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting at</span>
                  <p className="text-xl font-bold text-dark dark:text-white">₹99<span className="text-sm font-normal text-gray-500">/kg</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-dark dark:text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
            
            {/* Service Card 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] p-8 border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-white text-primary text-xs font-bold px-4 py-1.5 rounded-bl-2xl">POPULAR</div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-heading text-white">Dry Cleaning</h3>
              <p className="text-white/80 mb-6 line-clamp-2">Expert care for your delicate and structured garments. Stain removal included.</p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <span className="text-sm text-white/70">Starting at</span>
                  <p className="text-xl font-bold text-white">₹199<span className="text-sm font-normal text-white/70">/item</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
            
            {/* Service Card 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-secondary dark:bg-gray-800/50 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-heading text-dark dark:text-white">Ironing & Pressing</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">Professional pressing for a crisp, wrinkle-free finish on your shirts and trousers.</p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting at</span>
                  <p className="text-xl font-bold text-dark dark:text-white">₹49<span className="text-sm font-normal text-gray-500">/item</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-dark dark:text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/30 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-white mb-4 font-heading">Loved by Thousands</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Don't just take our word for it. Here is what our customers have to say.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">"Absolutely game-changing service. My clothes have never looked better, and the pickup/delivery is perfectly on time every week. Highly recommended!"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500"></div>
                  <div>
                    <h4 className="font-bold text-dark dark:text-white">Sarah Jenkins</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Regular Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
