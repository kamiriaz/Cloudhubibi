import React from 'react';

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  onOptionClick?: (option: string) => void;
  options?: string[];
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, onOptionClick, options }) => {
  return (
    <div className={`flex items-start gap-3 mb-6 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden shadow-md border border-blue-500/20">
          <img 
            src="/image.png" 
            alt="Bot Logo" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isBot ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-gradient-to-r from-blue-600 to-cyan-500 border border-blue-500/20'} backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg`}>
        <p className={`text-sm leading-relaxed ${isBot ? 'text-slate-100' : 'text-white'} whitespace-pre-wrap`}>
          {message}
        </p>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
            U
          </div>
        </div>
      )}
      
      {options && options.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 border border-blue-500/20"
              onClick={() => onOptionClick && onOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
