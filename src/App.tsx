import React, { useEffect, useRef, useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { useChatbot } from './hooks/useChatbot';

function App() {
  const customerName = "CloudHubibi";
  const { messages, isTyping, sendMessage } = useChatbot(customerName);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showOptions, setShowOptions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOptionClick = (option: string) => {
    setShowOptions(false); // Hide options permanently
    sendMessage(option);   // Continue chat
  };

  const options = [
    "GTM Strategy",
    "Market Research",
    "Sales Process",
    "Case Studies",
    "Book Consultation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-t-xl md:rounded-xl md:my-4 overflow-hidden">
          <ChatHeader customerName={customerName} />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-900/30">
            <div className="space-y-1">
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ChatMessage
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                  />

                  {/* Show options only below the first bot message */}
                  {index === 0 && message.isBot && showOptions && (
                    <div className="flex flex-col mt-4 space-y-3 items-center">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          className="w-2/3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 border border-blue-500/20"
                          onClick={() => handleOptionClick(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatInput id="chat-input" onSendMessage={sendMessage} disabled={isTyping} />
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-sm text-slate-400">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            CloudHubibi AI • Powered by GPT-4o-mini • Go-to-Market Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
