'use client';

import { useState, useRef, useEffect } from 'react';
import { AIMessage } from '@/types';
import { getAIResponse, SUGGESTED_QUESTIONS } from '@/services/ai.service';
import { Sparkles, Send, User, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: AIMessage = {
      id: `m_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await getAIResponse(newMessages);
      const assistantMsg: AIMessage = {
        id: `m_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">Assistente IA</h1>
            <p className="text-[11px] text-emerald-500 font-medium">● Online</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw size={13} />
            Limpar
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 py-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              Olá! Sou seu assistente de economia 👋
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 max-w-xs">
              Posso te ajudar a economizar mais nas compras, encontrar as melhores promoções e otimizar sua lista.
            </p>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Perguntas sugeridas
            </p>
            <div className="space-y-2 w-full max-w-xs">
              {SUGGESTED_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all active:scale-98"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2.5',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-violet-600 to-purple-700'
                    : 'bg-slate-200 dark:bg-slate-700'
                )}>
                  {msg.role === 'assistant'
                    ? <Sparkles size={13} className="text-white" />
                    : <User size={13} className="text-slate-600 dark:text-slate-300" />
                  }
                </div>
                <div className={cn(
                  'max-w-[78%] rounded-2xl px-4 py-3 text-sm',
                  msg.role === 'assistant'
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm rounded-tl-sm'
                    : 'bg-violet-600 text-white rounded-tr-sm'
                )}>
                  {msg.role === 'assistant' ? (
                    <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={13} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions chips (when has messages) */}
      {messages.length > 0 && !loading && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 flex-shrink-0">
          {SUGGESTED_QUESTIONS.slice(0, 3).map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:border-violet-300 transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-2 pb-1 flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Pergunte sobre promoções, preços..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all disabled:opacity-60"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
