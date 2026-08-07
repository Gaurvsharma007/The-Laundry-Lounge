import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'; //  new api key used here free limit

// System Prompt configuring the AI's persona and rules
const systemPrompt = `You are Sparkle, the highly intelligent and friendly AI assistant for "The Laundry Lounge", a premium laundry and dry cleaning platform in India.
Your tone should be helpful, professional, yet warm and conversational.

Core Rules:
1. Always act as an official representative of The Laundry Lounge.
2. Keep answers concise, clear, and direct. Use bullet points when listing things.
3. If a user asks for prices, here is the reference:
   - Wash & Fold (Mixed): ₹99 / kg
   - T-Shirt / Top: ₹49 / item
   - Button-down Shirt: ₹59 / item
   - Jeans / Lower / Pants: ₹69 / item
   - Jacket / Coat: ₹199 / item
   - Dress / Suit: ₹149 / item
   - Socks / Undergarments: ₹19 / pair
   - Bedding & Linens: ₹399 / set
   - Curtains (Per Panel): ₹199 / panel
4. If a user asks about order tracking, refer to the CONTEXT INJECTION if provided. If not, tell them to visit the Track Order page.
5. If they ask about complaints, tell them they can raise a ticket via the Complaints tab.
6. Pickup is usually done within 2-3 hours of booking. Delivery takes 24-48 hours.
7. Payment is collected on delivery (Cash or UPI).
8. Never break character. Never reveal that you are an AI language model.`;

export const generateChatResponse = async (userMessage, chatHistory, orderContext = null) => {
  try {
    if (!GROQ_API_KEY) {
      return "The AI service is not configured. Please add your GROQ_API_KEY to the backend .env file.";
    }

    // Build message with optional order context injection
    let contextualMessage = userMessage;
    if (orderContext && orderContext.length > 0) {
      contextualMessage = `[SYSTEM CONTEXT: The user has these active orders: ${JSON.stringify(orderContext)}. Use this to answer their order status query naturally.]\n\nUser: ${userMessage}`;
    }

    // Build messages array for Groq (OpenAI-compatible format)
    const messages = [
      { role: 'system', content: systemPrompt },
      // Add chat history (last 10 messages to avoid token limits)
      ...chatHistory.slice(-10).map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: contextualMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${response.status}: ${data.error?.message || JSON.stringify(data)}`);
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error('Empty response from Groq API');

    console.log('✅ Groq responded successfully');
    return reply;

  } catch (error) {
    console.error('Groq API Error:', error);
    return `I encountered a specific error: ${error.message}`;
  }
};
