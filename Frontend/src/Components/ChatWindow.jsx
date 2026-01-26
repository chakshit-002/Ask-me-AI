import React, { useState } from 'react';
import MessageBox from './MessageBox';

const ChatWindow = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14]">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 md:px-20 lg:px-40 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            How can I help you today?
          </div>
        ) : (
          messages.map((msg) => <MessageBox key={msg._id} message={msg} />)
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 md:px-20 lg:px-40 bg-linear-to-t from-[#0b0e14] via-[#0b0e14] to-transparent">
        <div className="relative flex items-center">
          <textarea
            rows="1"
            className="w-full bg-[#1c2128] text-white border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 resize-none shadow-lg"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;