import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import ChatbotUI from '../chatbot/ChatbotUI';

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-[70px]">
        {children}
      </main>
      <Footer />
      <ChatbotUI />
    </div>
  );
};

export default UserLayout;
