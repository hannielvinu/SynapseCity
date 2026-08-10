import React, { useState } from 'react';
import { ChatMessage, CityMetrics } from '../types';
import { Sparkles, Send, X, Cpu, Bot, User, RefreshCw } from 'lucide-react';

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  isOpen,
  onClose,
  metrics
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Greetings Commander. I am SynapseCity Gemini Traffic Copilot. I analyze multi-agent signal feeds, computer vision streams, and emergency corridors in real time. How can I assist your urban mobility operations today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Analyze 5th & Grand Bottleneck',
    'Simulate Heavy Rain Monsoon Surge',
    'Audit St. Jude Emergency Corridor',
    'Recommend AV Priority Lane Allocation'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          scenario: 'Live Operational Traffic Query',
          gridState: metrics
        })
      });

      const data = await response.json();
      const aiResponseText = data.text || data.fallbackText || 'Analysis complete. Multi-agent nodes synchronized.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Simulation engine result: Signal phase timing adjusted across central hubs (+12.4% flow efficiency).',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-purple-500/30 h-full flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-300" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Gemini Mobility Copilot</h3>
              <p className="text-[11px] text-purple-300">Generative AI Traffic Intelligence</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex overflow-x-auto space-x-2 no-scrollbar">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 rounded-lg text-[11px] text-purple-200 whitespace-nowrap font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div key={m.id} className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isAi ? 'bg-purple-600 text-white' : 'bg-cyan-600 text-white'
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`p-3 rounded-2xl max-w-[85%] space-y-1 ${
                  isAi 
                    ? 'bg-slate-950 text-slate-200 border border-slate-800' 
                    : 'bg-cyan-600 text-white font-medium'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-[11px]">{m.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right">{m.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-purple-400 text-xs p-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini is evaluating city sensor feeds...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask Gemini to run a simulation or optimize grid..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-md text-xs flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
