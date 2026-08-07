import Chat from '../models/Chat.js';
import Order from '../models/Order.js';
import { generateChatResponse } from '../services/geminiService.js';

// @desc    Get user's chat history
// @route   GET /api/chat
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message to chatbot
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Get or create chat session
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = new Chat({ user: req.user._id, messages: [] });
    }

    // 2. Add user message to DB
    chat.messages.push({ role: 'user', content: message });
    await chat.save();

    // 3. Context gathering: Check if user is asking about an order
    let orderContext = null;
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('order') || lowerMsg.includes('track') || lowerMsg.includes('status')) {
      // Fetch recent active orders for context
      const activeOrders = await Order.find({ 
        user: req.user._id,
        status: { $ne: 'Delivered' }
      }).sort('-createdAt').limit(3).select('_id status totalAmount pickupDate items.name');
      
      if (activeOrders.length > 0) {
        orderContext = activeOrders;
      }
    }

    // 4. Generate AI Response
    const chatHistory = chat.messages.slice(0, -1); // Exclude the message we just added
    const aiResponse = await generateChatResponse(message, chatHistory, orderContext);

    // 5. Add AI response to DB
    chat.messages.push({ role: 'model', content: aiResponse });
    await chat.save();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({ message: 'Failed to process chat message' });
  }
};
