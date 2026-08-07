import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Package, CircleDollarSign, AlertCircle, Phone } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ChatbotUI = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi there! I'm Sparkle, your AI laundry assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  // Fetch chat history on open if logged in
  useEffect(() => {
    if (isOpen && user) {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('/api/chat', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.length > 0) {
            // Keep the initial greeting if history is empty, otherwise load history
            setMessages(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch chat history", error);
        }
      };
      fetchHistory();
    }
  }, [isOpen, user]);

  const handleSend = async (e, forcedMessage = null) => {
    e?.preventDefault();
    const textToSend = forcedMessage || input;
    if (!textToSend.trim()) return;

    // Must be logged in to chat with AI
    if (!user) {
      setMessages(prev => [...prev, 
        { role: 'user', content: textToSend },
        { role: 'model', content: "Please log in to chat with me so I can pull up your account details and give you the best service!" }
      ]);
      setInput("");
      return;
    }

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/chat', { message: textToSend }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages([...newMessages, { role: 'model', content: res.data.response }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', content: "Oops! My circuits are a bit tangled right now. Please try again later or contact support." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Track Order", icon: <Package size={14}/>, query: "Where is my order?" },
    { label: "Pricing", icon: <CircleDollarSign size={14}/>, query: "What are your prices?" },
    { label: "Complaint", icon: <AlertCircle size={14}/>, query: "I need to raise a complaint." },
    { label: "Support", icon: <Phone size={14}/>, query: "How do I contact human support?" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[550px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-500 p-4 flex items-center justify-between text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-inner">
                    <Sparkles size={20} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-md leading-tight">Sparkle AI</h3>
                  <p className="text-xs text-white/80">Intelligent Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white mr-2 mt-1 shrink-0">
                      <Sparkles size={12} />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'model' 
                        ? 'bg-white dark:bg-gray-800 text-dark dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-sm' 
                        : 'bg-primary text-white shadow-md rounded-tr-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white mr-2 mt-1 shrink-0">
                    <Sparkles size={12} />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={16} />
                    <span className="text-xs text-gray-500 font-medium">Sparkle is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 px-3 py-2 border-t border-gray-100 dark:border-gray-700 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(null, action.query)}
                  disabled={isLoading}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-primary/10 dark:bg-gray-700 dark:hover:bg-primary/20 text-gray-600 dark:text-gray-300 hover:text-primary rounded-full text-xs font-semibold transition-colors border border-gray-200 dark:border-gray-600 disabled:opacity-50"
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
              {!user && (
                <div className="mb-2 text-center text-xs text-red-500 font-semibold bg-red-50 p-2 rounded-lg">
                  Please <Link to="/login" className="underline">log in</Link> to chat.
                </div>
              )}
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  placeholder="Ask Sparkle anything..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white transition-all disabled:opacity-50"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || !user}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading || !user}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-colors shadow-sm"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 relative"
      >
        {isOpen ? <X size={24} /> : (
          <>
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ChatbotUI;
