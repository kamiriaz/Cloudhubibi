import React from 'react';
import { Circle, TrendingUp } from 'lucide-react';

interface ChatHeaderProps {
  customerName: string;
}

export function ChatHeader({ customerName }: ChatHeaderProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-6">
      <div className="flex items-center gap-3">
        {/* Logo container */}
        <div className="w-14 h-14 rounded-xl shadow-xl border border-blue-500/20 overflow-hidden">
          <img 
            src="/image.png" 
            alt="CloudHubibi Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">
            <div className="flex items-center gap-2">
              CloudHubibi GTM Assistant
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Circle className="w-2 h-2 fill-cyan-400 text-cyan-400 animate-pulse" />
            <span className="font-medium">Go-to-Market Strategy • Ready to Scale</span>
          </div>
        </div>
      </div>
    </div>
  );
}
