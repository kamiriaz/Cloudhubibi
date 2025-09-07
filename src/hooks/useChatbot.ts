import { useState, useCallback } from 'react';
import { ChatApiService } from '../services/chatApi';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  options?: string[];
}

export function useChatbot(customerName: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 Welcome to CloudHubibi! I'm your Go-to-Market Strategy assistant.

We help businesses accelerate growth through strategic market entry and expansion. How can I assist you today?`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ["GTM Strategy", "Market Research", "Sales Process", "Case Studies", "Book Consultation"]
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [chatApiService] = useState(() => new ChatApiService());

  const sendMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    if (showOptions) setShowOptions(false);

    chatApiService.sendMessage(text, messages).then(response => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }).catch(error => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to the chat service.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    });
  }, [chatApiService, messages, showOptions]);

  return { messages, isTyping, sendMessage, showOptions, clearHistory: () => chatApiService.clearHistory() };
}
