import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Xin chào! Em là Trợ lý AI của NextPhone 🤖. Em có thể giúp gì cho anh/chị về thông tin điện thoại, giá bán hoặc chương trình khuyến mãi hôm nay ạ?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Cảm ơn bạn đã hỏi về "${userText}". Hiện tại NextPhone đang có chương trình trợ giá thu cũ lên đời và giảm thêm 5% cho thành viên NextPhone Member đấy ạ!`
        }
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[420px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#009981] p-3.5 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Trợ Lý AI NextPhone</p>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Trực tuyến sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f8fafc] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#009981] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Nhập câu hỏi cần tư vấn..."
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#009981]"
            />
            <button
              type="submit"
              className="p-2 bg-[#009981] hover:bg-[#00826e] text-white rounded-xl shadow transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#009981] hover:bg-[#00826e] text-white px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white"
      >
        {/* Mascot / Bot Icon */}
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
          🐿️
        </div>
        <span className="text-xs font-black tracking-wider uppercase">CHAT NGAY</span>
      </button>
    </div>
  );
};

