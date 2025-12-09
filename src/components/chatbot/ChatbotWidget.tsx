import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-gradient-to-br from-yoga-indigo to-yoga-turquoise",
          "text-white shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-yoga-turquoise focus:ring-offset-2",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
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
          "bg-background border border-border shadow-2xl",
          isFullScreen || "rounded-2xl max-md:rounded-none"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-yoga-indigo to-yoga-turquoise text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Yoga Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
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

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
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
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.sender === 'user'
                    ? "bg-yoga-sunset text-white"
                    : "bg-gradient-to-br from-yoga-indigo to-yoga-turquoise text-white"
                )}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                  message.sender === 'user'
                    ? "bg-yoga-indigo text-white rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md shadow-sm"
                )}>
                  {message.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yoga-indigo to-yoga-turquoise flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-full",
                  "bg-muted border border-border",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-yoga-turquoise focus:border-transparent",
                  "transition-all duration-200"
                )}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br from-yoga-indigo to-yoga-turquoise text-white",
                  "transition-all duration-200",
                  "hover:shadow-lg hover:scale-105",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "focus:outline-none focus:ring-2 focus:ring-yoga-turquoise focus:ring-offset-2"
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
