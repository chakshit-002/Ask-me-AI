import React from 'react';

const Sidebar = ({ chats, onSelectChat, currentChatId }) => {
  return (
    <div className="w-64 h-screen bg-[#0d1117] border-r border-gray-800 flex flex-col">
      <button className="m-4 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 text-white transition-all text-sm font-medium">
        + New Chat
      </button>
      
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className={`p-3 mb-1 cursor-pointer rounded-lg text-gray-300 hover:bg-gray-800 truncate ${
              currentChatId === chat._id ? 'bg-gray-800 text-white' : ''
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800 text-gray-400 text-xs">
        Logged in as: User
      </div>
    </div>
  );
};

export default Sidebar;