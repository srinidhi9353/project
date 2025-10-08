import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  );
};
