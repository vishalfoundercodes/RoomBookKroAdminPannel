// ChatComponent.jsx - Interactive chat widget
import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import Card from './Card';

const ChatComponent = ({ height = 320, initialMessages = null }) => {
  const defaultMessages = [
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: "10:30 AM" },
    { id: 2, text: "I need help with my dashboard", sender: "user", timestamp: "10:31 AM" },
    { id: 3, text: "I'd be happy to help you with your dashboard. What specific area do you need assistance with?", sender: "bot", timestamp: "10:31 AM" }
  ];

  const [messages, setMessages] = useState(initialMessages || defaultMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage("");
      
      // Auto reply after 1 second
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Thanks for your message! I'm processing your request...",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <Card title="Live Chat" icon={MessageCircle}>
      <div className="flex flex-col" style={{ height: `${height}px` }}>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ChatComponent;