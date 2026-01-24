import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, languages, Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "navbar" | "footer";
  className?: string;
}

const LanguageSwitcher = ({ variant = "navbar", className }: LanguageSwitcherProps) => {
  const { language, setLanguage, currentLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "footer") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/10 hover:bg-background/20 transition-colors text-sm text-muted-foreground hover:text-foreground"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLanguageInfo.nativeName}</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50"
              >
                <div className="max-h-64 overflow-y-auto py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors",
                        language === lang.code && "bg-primary/10"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">{lang.nativeName}</div>
                        <div className="text-xs text-muted-foreground">{lang.name}</div>
                      </div>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Navbar variant
  return (
    <div className={cn("relative", className)}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 hover:bg-background border border-border/50 transition-all text-sm font-medium"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">{currentLanguageInfo.nativeName}</span>
        <span className="sm:hidden">{currentLanguageInfo.code.toUpperCase()}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50"
            >
              <div className="p-2 border-b border-border bg-muted/30">
                <p className="text-xs text-muted-foreground font-medium px-2">Select Language</p>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors",
                      language === lang.code && "bg-primary/10"
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{lang.nativeName}</div>
                      <div className="text-xs text-muted-foreground">{lang.name}</div>
                    </div>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
