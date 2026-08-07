import { motion } from 'framer-motion';
import { Check, ShieldCheck, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Wash & Fold',
    price: '₹99',
    unit: 'per kg',
    icon: <Package size={32} />,
    description: 'Perfect for everyday laundry like t-shirts, jeans, and undergarments.',
    features: [
      'Cold water wash',
      'Premium detergent',
      'Tumble dry low',
      'Expertly folded'
    ],
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Dry Cleaning',
    price: '₹199',
    unit: 'starting per item',
    icon: <ShieldCheck size={32} />,
    description: 'Expert care for suits, dresses, coats, and delicate fabrics.',
    features: [
      'Stain inspection',
      'Gentle solvent cleaning',
      'Hand-pressed finish',
      'Hanger included'
    ],
    color: 'from-primary to-primary-dark',
    popular: true
  },
  {
    name: 'Express 24h',
    price: '+₹499',
    unit: 'flat fee',
    icon: <Clock size={32} />,
    description: 'In a rush? Get your laundry back the very next day.',
    features: [
      'Priority processing',
      'Next-day delivery',
      'Dedicated support',
      'SMS updates'
    ],
    color: 'from-purple-500 to-indigo-600'
  }
];

const Services = () => {
  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-16 transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white mb-6 font-heading"
          >
            Clear, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            No hidden fees. Just premium care for your clothes at competitive rates. Choose the service that fits your needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className={`bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-glass border relative ${
                plan.popular ? 'border-primary shadow-primary/20 scale-105 z-10' : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                  <span className="bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${plan.color} mb-6 shadow-md`}>
                {plan.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">{plan.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-dark dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">{plan.unit}</span>
              </div>
              
              <ul className="space-y-4 mb-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark dark:text-gray-300">
                    <Check className="text-primary shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/book" 
                className={`w-full py-4 rounded-xl font-bold text-center block transition-all ${
                  plan.popular 
                    ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30' 
                    : 'bg-gray-100 dark:bg-gray-700 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Book Now
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
