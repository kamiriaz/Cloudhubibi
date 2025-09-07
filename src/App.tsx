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

  // Reset buttons after bot responds
  useEffect(() => {
    if (!isTyping) {
      setShowOptions(true);
    }
  }, [messages, isTyping]);

  const handleOptionClick = (option: string) => {
    // Temporarily hide buttons while bot is "thinking"
    setShowOptions(false);

    switch (option) {
      case "Run a 2-Minute GTM Mini-Scan":
        sendMessage("I’d be happy to run a quick GTM Mini-Scan. Could you provide a bit of context about your current GTM strategy?");
        break;
      case "Diagnose My Revenue Leaks":
        sendMessage("Let’s identify potential revenue leaks. Can you share details about your sales process and current challenges?");
        break;
      case "Architect My GTM System":
        sendMessage("I can help you design a clear GTM blueprint. What are your key goals and target markets?");
        break;
      case "Scale My Operations":
        sendMessage("Scaling operations requires efficiency and visibility. Can you describe your current team setup and tools?");
        break;
      case "Book a Free Consultation":
        sendMessage("I'd be happy to connect you with our team. Could you please share your company name, industry, and main GTM challenge you're facing?");
        break;
      case "Learn About CloudHubibi's Approach":
        sendMessage("CloudHubibi builds GTM strategies, CRM architecture, and funnel systems that convert demand into revenue. Would you like an overview?");
        break;
      default:
        sendMessage(option);
    }
  };

  const options = [
    "Run a 2-Minute GTM Mini-Scan",
    "Diagnose My Revenue Leaks",
    "Architect My GTM System",
    "Scale My Operations",
    "Book a Free Consultation",
    "Learn About CloudHubibi's Approach"
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

                  {/* Show buttons below each bot message */}
                  {message.isBot && showOptions && (
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
