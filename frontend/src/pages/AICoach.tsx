import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, MessageCircle } from 'lucide-react';
import api from '../api';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hello! I'm your FitFreak AI Coach. How can I help you reach your fitness goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col glass-card rounded-3xl border-emerald-500/30 overflow-hidden">
      <div className="p-6 bg-emerald-900/50 border-b border-emerald-800/50 flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-4 ring-emerald-500/20">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold">FitFreak AI Coach</h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Online & Ready to help
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-emerald-700' : 'bg-emerald-500'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-emerald-600 rounded-tr-none text-white' 
                : 'bg-emerald-900/80 rounded-tl-none border border-emerald-800/50 text-emerald-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-emerald-900/80 border border-emerald-800/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span className="text-emerald-400 text-sm italic">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-emerald-950/50 border-t border-emerald-800/50">
        <div className="flex gap-4 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about fitness, diet, or routine..."
            className="flex-1 emerald-input pr-12 h-12"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-emerald-600 mt-3 uppercase tracking-widest font-bold">
          Powered by Gemini AI
        </p>
      </div>
    </div>
  );
};

export default AICoach;
