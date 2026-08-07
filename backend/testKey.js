import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBnVmMBKqvlKmFhNZHZdn-g78KCHu0nS8o');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hi');
    console.log(result.response.text());
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}
test();
