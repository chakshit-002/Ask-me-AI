import React from 'react';

const MessageBox = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
        isUser 
          ? 'bg-blue-600 text-white rounded-tr-none' 
          : 'bg-[#1c2128] text-gray-200 border border-gray-700 rounded-tl-none'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-[10px] opacity-50 mt-1 block">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBox;