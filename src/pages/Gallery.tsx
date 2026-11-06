import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Calendar, Users, Heart, Star, Camera } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

import yogaClassGroup from "@/assets/gallery/yoga-class-group.webp";
import achievementAwards from "@/assets/gallery/achievement-awards.webp";
import yogaRetreat from "@/assets/gallery/yoga-retreat.webp";
import yogaDayEvent from "@/assets/gallery/yoga-day-event.webp";
import kidsYoga from "@/assets/gallery/kids-yoga.webp";
import workshop from "@/assets/gallery/workshop.webp";

type Category = "all" | "achievements" | "events" | "classes" | "workshops";

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: Category;
  date: string;
  icon: typeof Trophy;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: achievementAwards,
    title: "Regional Yoga Championship — Gold Medal",
    titleHi: "क्षेत्रीय योग चैंपियनशिप — स्वर्ण पदक",
    description: "Our students won gold at the 2024 Regional Yoga Championship, showcasing exceptional skill and dedication.",
    descriptionHi: "हमारे छात्रों ने 2024 क्षेत्रीय योग चैंपियनशिप में स्वर्ण पदक जीता।",
    category: "achievements",
    date: "March 2024",
    icon: Trophy,
  },
  {
    id: 2,
    src: yogaDayEvent,
    title: "International Yoga Day Celebration",
    titleHi: "अंतर्राष्ट्रीय योग दिवस समारोह",
    description: "Over 200 participants joined us for a grand International Yoga Day celebration at the city park.",
    descriptionHi: "200 से अधिक प्रतिभागियों ने शहर के पार्क में अंतर्राष्ट्रीय योग दिवस समारोह में भाग लिया।",
    category: "events",
    date: "June 2024",
    icon: Calendar,
  },
  {
    id: 3,
    src: yogaClassGroup,
    title: "Morning Vinyasa Flow — Batch Graduation",
    titleHi: "प्रातःकालीन विन्यास फ्लो — बैच स्नातक",
    description: "Celebrating the completion of our 3-month Vinyasa Flow intensive program with an incredible group.",
    descriptionHi: "एक शानदार समूह के साथ हमारे 3 महीने के विन्यास फ्लो गहन कार्यक्रम के पूरा होने का जश्न।",
    category: "classes",
    date: "February 2024",
    icon: Users,
  },
  {
    id: 4,
    src: kidsYoga,
    title: "Kids Yoga Summer Camp",
    titleHi: "बच्चों का योग ग्रीष्मकालीन शिविर",
    description: "Fun-filled yoga sessions for children aged 5-12, building flexibility, focus, and confidence.",
    descriptionHi: "5-12 आयु वर्ग के बच्चों के लिए मज़ेदार योग सत्र, लचीलापन, एकाग्रता और आत्मविश्वास का निर्माण।",
    category: "events",
    date: "May 2024",
    icon: Heart,
  },
  {
    id: 5,
    src: yogaRetreat,
    title: "Himalayan Sunrise Retreat",
    titleHi: "हिमालयन सूर्योदय रिट्रीट",
    description: "A transformative 5-day retreat in the Himalayas with meditation, pranayama, and nature immersion.",
    descriptionHi: "ध्यान, प्राणायाम और प्रकृति के साथ हिमालय में 5 दिवसीय परिवर्तनकारी रिट्रीट।",
    category: "events",
    date: "October 2024",
    icon: Star,
  },
  {
    id: 6,
    src: workshop,
    title: "Advanced Asana Workshop",
    titleHi: "उन्नत आसन कार्यशाला",
    description: "An intensive weekend workshop focused on advanced postures, alignment, and breathing techniques.",
    descriptionHi: "उन्नत आसनों, संरेखण और श्वास तकनीकों पर केंद्रित एक गहन सप्ताहांत कार्यशाला।",
    category: "workshops",
    date: "January 2025",
    icon: Camera,
  },
];

const categories: { key: Category; label: string; labelHi: string }[] = [
  { key: "all", label: "All", labelHi: "सभी" },
  { key: "achievements", label: "Achievements", labelHi: "उपलब्धियाँ" },
  { key: "events", label: "Events", labelHi: "कार्यक्रम" },
  { key: "classes", label: "Classes", labelHi: "कक्षाएँ" },
  { key: "workshops", label: "Workshops", labelHi: "कार्यशालाएँ" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { language } = useLanguage();
  const isHi = language === "hi";

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedItem]);

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Gallery | Dhanesh Yoga Studio"
        description="Explore our achievements, events, workshops, and class moments at Dhanesh Yoga Studio."
        keywords="yoga gallery, yoga events, yoga achievements, yoga workshops, Dhanesh Yoga"
        canonicalPath="/gallery"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Camera className="w-3 h-3 mr-1" />
            {isHi ? "हमारी गैलरी" : "Our Gallery"}
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {isHi ? "उपलब्धियाँ और " : "Achievements & "}
            <span className="text-primary">{isHi ? "कार्यक्रम" : "Events"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isHi
              ? "हमारी यात्रा, सफलताओं और समुदाय के अविस्मरणीय क्षणों की झलकियाँ।"
              : "A glimpse into our journey, milestones, and unforgettable community moments."}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              type="button"
              aria-pressed={activeCategory === cat.key}
              title={`Filter gallery by ${isHi ? cat.labelHi : cat.label}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {isHi ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group card-hover w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm"
                  onClick={() => setSelectedItem(item)}
                  aria-label={`Open ${isHi ? item.titleHi : item.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.src}
                      alt={isHi ? item.titleHi : item.title}
                      title={isHi ? item.titleHi : item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        <Icon className="w-3 h-3" />
                        {isHi
                          ? categories.find((c) => c.key === item.category)?.labelHi
                          : categories.find((c) => c.key === item.category)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
                    <h3 className="font-display text-base font-semibold text-card-foreground line-clamp-2">
                      {isHi ? item.titleHi : item.title}
                    </h3>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={isHi ? selectedItem.titleHi : selectedItem.title}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                type="button"
                title={isHi ? "बंद करें" : "Close image"}
                aria-label={isHi ? "बंद करें" : "Close image"}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedItem.src}
                alt={isHi ? selectedItem.titleHi : selectedItem.title}
                title={isHi ? selectedItem.titleHi : selectedItem.title}
                decoding="async"
                className="w-full max-h-[60vh] object-cover"
              />
              <div className="p-6">
                <p className="text-xs text-muted-foreground mb-1">{selectedItem.date}</p>
                <h2 className="font-display text-xl font-bold text-card-foreground mb-2">
                  {isHi ? selectedItem.titleHi : selectedItem.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isHi ? selectedItem.descriptionHi : selectedItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
