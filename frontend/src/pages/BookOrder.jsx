import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Info, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from 'axios';

const categories = ["All", "Bulk", "Clothing", "Household"];

const itemsList = [
  { id: 'wash-fold', category: 'Bulk', name: 'Wash & Fold (Mixed)', price: 99, unit: 'kg', icon: '🧺' },
  { id: 'tshirt', category: 'Clothing', name: 'T-Shirt / Top', price: 49, unit: 'item', icon: '👕' },
  { id: 'shirt', category: 'Clothing', name: 'Button-down Shirt', price: 59, unit: 'item', icon: '👔' },
  { id: 'jeans', category: 'Clothing', name: 'Jeans / Lower / Pants', price: 69, unit: 'item', icon: '👖' },
  { id: 'jacket', category: 'Clothing', name: 'Jacket / Coat', price: 199, unit: 'item', icon: '🧥' },
  { id: 'dress', category: 'Clothing', name: 'Dress / Suit', price: 149, unit: 'item', icon: '👗' },
  { id: 'socks', category: 'Clothing', name: 'Socks / Undergarments', price: 19, unit: 'pair', icon: '🧦' },
  { id: 'bedding', category: 'Household', name: 'Bedding & Linens', price: 399, unit: 'set', icon: '🛏️' },
  { id: 'curtains', category: 'Household', name: 'Curtains (Per Panel)', price: 199, unit: 'panel', icon: '🏠' },
];

const BookOrder = () => {
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState({});
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const updateQuantity = (id, delta) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      const currentQty = newItems[id] || 0;
      const newQty = currentQty + delta;
      
      if (newQty <= 0) {
        delete newItems[id];
      } else {
        newItems[id] = newQty;
      }
      return newItems;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedItems).forEach(([id, qty]) => {
      const item = itemsList.find(s => s.id === id);
      total += item.price * qty;
    });
    return total;
  };

  const getTotalItemsCount = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderItems = Object.entries(selectedItems).map(([id, qty]) => {
        const item = itemsList.find(s => s.id === id);
        return { name: item.name, quantity: qty, price: item.price };
      });

      const token = localStorage.getItem('token');
      await axios.post('/api/orders', {
        items: orderItems,
        pickupAddress: address,
        pickupDate: date,
        totalAmount: calculateTotal()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Order placed successfully!');
      setStep(3);
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const filteredItems = activeCategory === 'All' 
    ? itemsList 
    : itemsList.filter(item => item.category === activeCategory);

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-[calc(100vh-70px)] py-12 transition-colors duration-300">
      <div className="container-custom max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-dark dark:text-white font-heading mb-4">Book a Pickup</h1>
          <p className="text-gray-500 dark:text-gray-400">Select the exact items you want us to wash or dry clean.</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-16 sm:w-24 h-1 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>2</div>
            <div className={`w-16 sm:w-24 h-1 transition-colors ${step >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>3</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-glass border border-gray-100 dark:border-gray-700 overflow-hidden relative">
          
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row h-[700px] max-h-[80vh]">
              
              {/* Left Side: Catalog */}
              <div className="md:w-2/3 p-6 md:p-10 flex flex-col h-full border-r border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Select Your Clothes</h2>
                
                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                        activeCategory === cat 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10 custom-scrollbar">
                  {filteredItems.map(item => {
                    const qty = selectedItems[item.id] || 0;
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          qty > 0 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                            : 'border-gray-100 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{item.icon}</span>
                            <div>
                              <h3 className="font-bold text-dark dark:text-white text-sm">{item.name}</h3>
                              <p className="text-xs text-primary font-semibold">₹{item.price} / {item.unit}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          {qty === 0 ? (
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white text-dark dark:text-gray-200 rounded-xl text-sm font-bold transition-colors"
                            >
                              Add
                            </button>
                          ) : (
                            <div className="w-full flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-gray-800">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-bold text-dark dark:text-white transition-colors">-</button>
                              <span className="font-bold w-8 text-center text-dark dark:text-white">{qty}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-bold text-dark dark:text-white transition-colors">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Cart Summary */}
              <div className="md:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-6 md:p-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <ShoppingBag className="text-primary" size={24} />
                  <h3 className="text-xl font-bold text-dark dark:text-white">Your Laundry Bag</h3>
                </div>

                <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                  {Object.keys(selectedItems).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
                      <ShoppingBag size={48} className="mb-4 opacity-50" />
                      <p>Your bag is empty.</p>
                      <p className="text-sm mt-1">Select items to wash.</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {Object.entries(selectedItems).map(([id, qty]) => {
                        const item = itemsList.find(s => s.id === id);
                        return (
                          <li key={id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <p className="font-bold text-sm text-dark dark:text-white">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {qty}</p>
                              </div>
                            </div>
                            <p className="font-bold text-dark dark:text-white">₹{item.price * qty}</p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 dark:text-gray-400 font-semibold">Total ({getTotalItemsCount()} items)</span>
                    <span className="text-3xl font-bold text-primary">₹{calculateTotal()}</span>
                  </div>
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={Object.keys(selectedItems).length === 0}
                    className="w-full btn btn-primary py-4 rounded-xl shadow-lg shadow-primary/30 flex justify-center items-center gap-2"
                  >
                    Proceed to Schedule <ArrowRight size={18} />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-dark dark:text-white mb-8 text-center font-heading">Pickup Details</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Where should we pick it up?</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none resize-none"
                    placeholder="Enter full address, apartment number, and delivery instructions..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">When should we arrive?</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-dark dark:text-white transition-all outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-5 rounded-2xl flex items-start gap-4">
                  <Info className="text-blue-500 shrink-0 mt-0.5" size={24} />
                  <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">Payment on Delivery</h4>
                    <p className="text-sm text-blue-700/80 dark:text-blue-400">
                      Payment will be collected upon delivery. The total price may vary slightly if the driver adds additional items to your bag.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-gray-700">
                  <button type="button" onClick={() => setStep(1)} className="font-bold text-gray-500 hover:text-dark dark:hover:text-white px-4 py-2">
                    Back to Items
                  </button>
                  <button type="submit" className="btn btn-primary py-4 px-10 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2">
                    Confirm Order <Check size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-16 text-center max-w-2xl mx-auto">
              <div className="w-28 h-28 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, delay: 0.2 }}
                >
                  <Check size={56} strokeWidth={3} />
                </motion.div>
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              </div>
              
              <h2 className="text-4xl font-extrabold text-dark dark:text-white font-heading mb-4">Pickup Confirmed!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                Your laundry bag is scheduled for pickup. Our driver will arrive at the designated time. You can track your driver's status in the dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/track" className="btn btn-outline dark:text-gray-300 dark:border-gray-600 py-4 px-8 rounded-xl">Track Order Live</Link>
                <Link to="/dashboard" className="btn btn-primary py-4 px-8 rounded-xl shadow-lg shadow-primary/30">Go to Dashboard</Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookOrder;
