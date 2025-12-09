import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom Yoga Bot Icon - Lotus + Chat bubble hybrid
const YogaBotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" fill="currentColor" opacity="0.8"/>
    <path d="M12 14C12 14 6 16 6 19C6 20.66 8.69 22 12 22C15.31 22 18 20.66 18 19C18 16 12 14 12 14Z" fill="currentColor" opacity="0.6"/>
    <path d="M4 12C4 12 2 10 2 8C2 6.5 3.5 6 4 7C4.5 6 6 6.5 6 8C6 10 4 12 4 12Z" fill="currentColor" opacity="0.5"/>
    <path d="M20 12C20 12 22 10 22 8C22 6.5 20.5 6 20 7C19.5 6 18 6.5 18 8C18 10 20 12 20 12Z" fill="currentColor" opacity="0.5"/>
    <circle cx="12" cy="10" r="2" fill="white" opacity="0.9"/>
  </svg>
);

// Floating Button Icon - Lotus meditation pose
const FloatingBotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Lotus petals */}
    <path d="M16 6C16 6 12 10 12 14C12 16.5 13.79 18 16 18C18.21 18 20 16.5 20 14C20 10 16 6 16 6Z" fill="currentColor"/>
    <path d="M8 14C8 14 6 11 6 9C6 7.5 7.5 7 8 8C8.5 7 10 7.5 10 9C10 11 8 14 8 14Z" fill="currentColor" opacity="0.7"/>
    <path d="M24 14C24 14 26 11 26 9C26 7.5 24.5 7 24 8C23.5 7 22 7.5 22 9C22 11 24 14 24 14Z" fill="currentColor" opacity="0.7"/>
    {/* Meditation person silhouette */}
    <circle cx="16" cy="21" r="2.5" fill="currentColor"/>
    <path d="M11 28C11 28 12 24 16 24C20 24 21 28 21 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    {/* Chat bubble accent */}
    <circle cx="24" cy="8" r="4" fill="currentColor" opacity="0.9"/>
    <circle cx="24" cy="8" r="2" fill="white"/>
  </svg>
);

// User icon with namaste pose
const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="4" fill="currentColor"/>
    <path d="M12 12C8 12 5 15 5 19V21H19V19C19 15 16 12 12 12Z" fill="currentColor" opacity="0.8"/>
  </svg>
);

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi 👋 I'm your yoga assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Placeholder for future backend integration
  const sendToBackend = async (query: string): Promise<string> => {
    // TODO: integrate Python Flask endpoint
    // const res = await fetch("/api/chat", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message: query })
    // });
    // const data = await res.json();
    // return data.response;
    
    // Simulated responses based on keywords
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('class') || lowerQuery.includes('schedule')) {
      return "We offer yoga classes for all age groups! Check our Schedule page for timings. Would you like me to help you find a specific class?";
    } else if (lowerQuery.includes('program') || lowerQuery.includes('course')) {
      return "We have age-specific programs: Kids Yoga (5-12), Teens Yoga (13-19), Adults Yoga (20-50), and Senior Yoga (50+). Which one interests you?";
    } else if (lowerQuery.includes('asana') || lowerQuery.includes('pose')) {
      return "Visit our Asana Library to explore various yoga poses with detailed instructions and benefits. Would you like recommendations based on your level?";
    } else if (lowerQuery.includes('meditation')) {
      return "Try our Meditation Mode! Click the lotus icon on the screen for a guided breathing experience. 🧘‍♀️";
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Namaste! 🙏 How can I assist you with your yoga journey today?";
    }
    return "Thank you for your message! Our team will get back to you soon. In the meantime, feel free to explore our programs and schedule.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate delay and get response
    setTimeout(async () => {
      const botResponse = await sendToBackend(userMessage);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button - Yoga themed */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full",
          "bg-gradient-to-br from-yoga-lotus via-yoga-sunset to-yoga-lotus",
          "text-white shadow-elevated",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "hover:shadow-[0_0_30px_hsl(345_85%_60%/0.5)]",
          "focus:outline-none focus:ring-2 focus:ring-yoga-lotus focus:ring-offset-2",
          "animate-aura-pulse",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Open yoga assistant"
      >
        <FloatingBotIcon className="w-9 h-9" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 ease-out",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
          isFullScreen
            ? "inset-0 rounded-none"
            : "bottom-6 right-6 w-[380px] h-[520px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] rounded-2xl",
          // Mobile full screen
          "max-md:inset-0 max-md:rounded-none max-md:w-full max-md:h-full max-md:max-w-full max-md:max-h-full"
        )}
      >
        <div className={cn(
          "w-full h-full flex flex-col overflow-hidden",
          "bg-gradient-to-b from-yoga-mint/30 to-background border border-yoga-lotus/20 shadow-2xl",
          isFullScreen || "rounded-2xl max-md:rounded-none"
        )}>
          {/* Header - Warm yoga gradient */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-yoga-lotus via-yoga-sunset to-yoga-lotus text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <YogaBotIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base tracking-wide">Yoga Guide</h3>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Here to help your journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="hidden md:flex w-8 h-8 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label={isFullScreen ? "Minimize" : "Maximize"}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFullScreen(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area - Soft mint background */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-yoga-mint/20 via-background to-yoga-turquoise-light/10"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-end gap-2 animate-fade-in",
                  message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
                  message.sender === 'user'
                    ? "bg-gradient-to-br from-yoga-turquoise to-yoga-indigo text-white"
                    : "bg-gradient-to-br from-yoga-lotus to-yoga-sunset text-white"
                )}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-5 h-5" />
                  ) : (
                    <YogaBotIcon className="w-5 h-5" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-soft",
                  message.sender === 'user'
                    ? "bg-gradient-to-br from-yoga-turquoise to-yoga-indigo text-white rounded-br-sm"
                    : "bg-white/80 dark:bg-card/90 backdrop-blur-sm border border-yoga-lotus/20 text-foreground rounded-bl-sm"
                )}>
                  {message.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yoga-lotus to-yoga-sunset flex items-center justify-center text-white shadow-md">
                  <YogaBotIcon className="w-5 h-5" />
                </div>
                <div className="bg-white/80 dark:bg-card/90 backdrop-blur-sm border border-yoga-lotus/20 px-4 py-3 rounded-2xl rounded-bl-sm shadow-soft">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-yoga-lotus/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-yoga-sunset/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-yoga-turquoise/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Clean with accent border */}
          <div className="p-4 border-t border-yoga-lotus/20 bg-white/50 dark:bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about yoga, classes, asanas..."
                className={cn(
                  "flex-1 px-4 py-3 rounded-full",
                  "bg-yoga-mint/30 dark:bg-muted/50 border border-yoga-turquoise/30",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-yoga-lotus/50 focus:border-yoga-lotus/50",
                  "transition-all duration-200"
                )}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br from-yoga-lotus to-yoga-sunset text-white",
                  "transition-all duration-200 shadow-md",
                  "hover:shadow-lg hover:scale-105",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "focus:outline-none focus:ring-2 focus:ring-yoga-lotus focus:ring-offset-2"
                )}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => {
            setIsOpen(false);
            setIsFullScreen(false);
          }}
        />
      )}
    </>
  );
};

export default ChatbotWidget;
