import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Maximize2, Bot, Sparkles, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import MeditationMark from '@/components/interactive/MeditationMark';
import VoiceGuideWidget from '@/components/voice/VoiceGuideWidget';
import { useFloatingControlsVisibility } from '@/hooks/useFloatingControlsVisibility';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const QUICK_REPLIES = ['Classes', 'Programs', 'Asanas', 'Meditation'];

const ChatbotWidget: React.FC = () => {
  const controlsVisible = useFloatingControlsVisibility();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activePanel, setActivePanel] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Namaste! 🙏 I'm your yoga assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setViewportHeight(null);
      return;
    }
    const viewport = window.visualViewport;
    const updateViewportHeight = () => setViewportHeight(viewport?.height ?? window.innerHeight);
    updateViewportHeight();
    viewport?.addEventListener('resize', updateViewportHeight);
    viewport?.addEventListener('scroll', updateViewportHeight);
    return () => {
      viewport?.removeEventListener('resize', updateViewportHeight);
      viewport?.removeEventListener('scroll', updateViewportHeight);
    };
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && activePanel === 'chat') inputRef.current?.focus();
  }, [isOpen, activePanel]);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('class') || q.includes('schedule'))
      return "Open the Schedule page to see the studio's currently published class times and availability.";
    if (q.includes('program') || q.includes('course'))
      return "Open the Programmes page to see the studio's currently published programmes and their details.";
    if (q.includes('asana') || q.includes('pose'))
      return "Visit our Asana Library to explore various yoga poses with detailed instructions and benefits. Would you like recommendations based on your level?";
    if (q.includes('meditation'))
      return "Try our Meditation Mode! Click the lotus icon on the screen for a guided breathing experience. 🧘‍♀️";
    if (q.includes('hello') || q.includes('hi'))
      return "Namaste! 🙏 How can I assist you with your yoga journey today?";
    return "Thank you for your message! Our team will get back to you soon. Feel free to explore our programs and schedule.";
  };

  const handleSend = (text?: string) => {
    const msg = (text || inputValue).trim();
    if (!msg) return;
    setInputValue('');
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: getBotResponse(msg) }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && controlsVisible && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActivePanel('chat'); setIsOpen(true); }}
            className="fixed bottom-4 right-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg widget-hover sm:bottom-5 sm:right-24"
            title="Open Yoga Guide chat"
            aria-label="Open yoga assistant"
          >
            <span className="relative grid place-items-center">
              <Bot className="h-7 w-7" aria-hidden="true" />
              <MeditationMark className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary p-0.5 text-primary-foreground" />
              <Sparkles className="absolute -top-2 -left-2 h-3.5 w-3.5 text-accent" aria-hidden="true" />
            </span>
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 flex min-h-0 flex-col overflow-hidden border border-border bg-background shadow-xl",
              isFullScreen
                ? "inset-0 rounded-none"
                : "bottom-5 right-5 w-[380px] h-[520px] rounded-2xl",
              "max-md:inset-x-0 max-md:top-0 max-md:bottom-0 max-md:w-full max-md:h-[var(--chat-viewport-height,100dvh)] max-md:max-h-[var(--chat-viewport-height,100dvh)] max-md:min-h-0 max-md:rounded-none"
            )}
            style={{ '--chat-viewport-height': viewportHeight ? `${viewportHeight}px` : undefined } as React.CSSProperties}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                  <MeditationMark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{activePanel === 'chat' ? 'Yoga Guide' : 'Voice guidance'}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-xs opacity-80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePanel((panel) => panel === 'chat' ? 'voice' : 'chat')}
                  className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold hover:bg-primary-foreground/15 transition-colors"
                  aria-label={activePanel === 'chat' ? 'Open voice guidance' : 'Return to Yoga Guide chat'}
                  title={activePanel === 'chat' ? 'Voice guidance' : 'Yoga Guide chat'}
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{activePanel === 'chat' ? 'Voice' : 'Chat'}</span>
                </button>
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  type="button"
                  className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-primary-foreground/15 transition-colors"
                  aria-label={isFullScreen ? "Minimize" : "Maximize"}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setIsOpen(false); setIsFullScreen(false); }}
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-foreground/15 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {activePanel === 'voice' ? (
              <VoiceGuideWidget embedded />
            ) : <>
            {/* Messages */}
            <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto p-4 space-y-3 bg-muted/30">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2",
                    msg.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
                      <MeditationMark className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl",
                      msg.sender === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card text-card-foreground border border-border rounded-bl-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm">
                    <MeditationMark className="h-4 w-4" />
                  </div>
                  <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="shrink-0 px-4 py-2 border-t border-border bg-background flex gap-2 flex-wrap">
                {QUICK_REPLIES.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleSend(label)}
                    type="button"
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="shrink-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-border bg-background">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
                <button
                  onClick={() => handleSend()}
                  type="button"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            </>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => { setIsOpen(false); setIsFullScreen(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
