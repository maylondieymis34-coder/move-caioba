
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatState } from '../types';
import { geminiService } from '../services/geminiService';
import MessageBubble from './MessageBubble';

const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';

const ChatInterface: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'bot',
        content: 'Olá! Eu sou o MOVE. Em que posso te apoiar ou orientar na sua caminhada cristã hoje?',
        timestamp: new Date(),
      },
    ],
    isLoading: false,
    error: null,
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Initial audio setup
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setInputValue('');
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const botReply = await geminiService.sendMessage(state.messages, userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botReply,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }));

      // Play sound and vibrate
      audioRef.current?.play().catch(() => {});
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Erro ao conectar. Tente novamente.',
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 z-0">
        <div className="max-w-2xl mx-auto">
          {state.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {state.isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          {state.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
              {state.error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 z-10">
        <div className="max-w-2xl mx-auto relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte ao MOVE..."
            rows={1}
            className="w-full bg-slate-100 text-slate-800 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none max-h-32 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || state.isLoading}
            className={`
              absolute right-2 bottom-2 p-2 rounded-xl transition-all
              ${!inputValue.trim() || state.isLoading 
                ? 'text-slate-400' 
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
              }
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          MOVE: Mentoria Orientada por Valores Espirituais.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
