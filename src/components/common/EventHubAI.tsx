import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiAssistantService, ChatMessage } from '../../services/aiAssistantService';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const EventHubAI: React.FC = () => {
  const {
    events,
    registrations,
    currentUser,
    setActiveTab,
    openEventModal,
    setSelectedCategory,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${currentUser.name.split(' ')[0]}! 👋 I'm **KIOT EventHub AI**, your Knowledge Institute of Technology campus event assistant.\n\nAsk me about upcoming workshops, what's live on campus, your registered schedule, or any schedule conflicts!`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: '🔴 What is live now?', actionId: 'query_live' },
        { label: '📅 What is happening today?', actionId: 'query_today' },
        { label: '🚀 Any hackathons?', actionId: 'filter_hackathon' },
        { label: '⚠ Check my conflicts', actionId: 'check_conflicts' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Rule-based engine handles response
    setTimeout(() => {
      const assistantReply = aiAssistantService.processQuery(
        text,
        events,
        registrations,
        currentUser
      );
      setMessages((prev) => [...prev, assistantReply]);
    }, 250);
  };

  const handleActionClick = (actionId: string, payload?: unknown) => {
    if (actionId === 'query_live') {
      handleSendMessage('What is live now?');
    } else if (actionId === 'query_today') {
      handleSendMessage('What events are happening today?');
    } else if (actionId === 'filter_hackathon') {
      handleSendMessage('Any hackathons this week?');
    } else if (actionId === 'check_conflicts') {
      handleSendMessage('Do I have schedule conflicts?');
    } else if (actionId === 'filter_workshop') {
      handleSendMessage('Find workshops');
    } else if (actionId === 'goto_schedule') {
      setActiveTab('my-schedule');
      setIsOpen(false);
    } else if (actionId === 'goto_my_events') {
      setActiveTab('my-events');
      setIsOpen(false);
    } else if (actionId === 'goto_discover') {
      setActiveTab('discover');
      setIsOpen(false);
    } else if (actionId === 'filter_my_college') {
      setActiveTab('discover');
      setIsOpen(false);
    } else if (actionId === 'filter_tech') {
      setSelectedCategory('Technology');
      setActiveTab('discover');
      setIsOpen(false);
    } else if (actionId === 'view_event' && typeof payload === 'string') {
      const target = events.find((e) => e.id === payload);
      if (target) {
        openEventModal(target);
      }
    }
  };

  const quickChips = [
    "What's happening today?",
    'My upcoming events',
    'Any hackathons?',
    'What is live now?',
    'Check my schedule',
    'Find workshops',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-indigo-400/30"
          aria-label="Open EventHub AI assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-700 animate-pulse"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">EventHub AI</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-indigo-100">
            Assistant
          </span>
        </button>
      )}

      {/* Modern Expandable Chat Panel */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isExpanded
              ? 'w-[92vw] sm:w-[540px] h-[82vh]'
              : 'w-[92vw] sm:w-[400px] h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold leading-tight">EventHub AI</h4>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-indigo-100/80 leading-none mt-0.5">
                  Your campus event assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Query Bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-600 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/70 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs font-normal">
                    {msg.text}
                  </div>

                  {/* Attached mini event cards if any */}
                  {msg.eventCards && msg.eventCards.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      {msg.eventCards.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => openEventModal(evt)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700 hover:border-indigo-400 cursor-pointer transition-all"
                        >
                          <img
                            src={evt.bannerUrl}
                            alt={evt.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1 text-[11px]">
                              {evt.title}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {evt.date} • {evt.startTime}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Actions inside response */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.actionId, act.payload)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about live events, hackathons, conflicts..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[9px] text-center text-slate-400 mt-1.5">
              EventHub Rule-Engine v1.0 • Ready for Gemini / LLM integration in Phase 2
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
