import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import ChatWindow from '../Components/ChatWindow';

const ChatPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle state
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoadnig] = useState(false);

    // Sidebar toggle function for Mobile
    //   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

   
    return (
        <div className="flex h-screen bg-[#0b0e14] overflow-hidden">

            {/* 1. Sidebar - Desktop: Always Visible | Mobile: Overlay */}
            <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <Sidebar
                    chats={chats}
                    currentChatId={currentChatId}
                    onSelectChat={(id) => {
                        setCurrentChatId(id);
                        setIsSidebarOpen(false); // Mobile pe chat select hote hi sidebar close
                    }}
                />
            </div>

            {/* 2. Mobile Overlay (Background dark ho jayega jab sidebar khulega) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* 3. Main Chat Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header (Only visible on small screens) */}
                <header className="md:hidden flex items-center p-4 border-b border-gray-800 bg-[#0d1117]">
                    <button onClick={toggleSidebar} className="text-gray-400 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <h1 className="ml-4 text-white font-semibold text-lg">AI Chatbot</h1>
                </header>

                {/* Chat Window */}
                <ChatWindow
                    messages={messages}
                    onSendMessage={(text) => console.log("Sending:", text)}
                />
            </div>
        </div>
    );
};

export default ChatPage;