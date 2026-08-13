import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const weekDayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const weekDaysEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const scheduleData: Record<string, Array<{ time: string; class: string; type: string; duration: string; instructor: string; spots: number }>> = {
  Monday: [
    { time: "6:00 AM", class: "Morning Flow", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "4:00 PM", class: "Kids Yoga", type: "Kids", duration: "45 min", instructor: "Main Instructor", spots: 10 },
    { time: "7:00 AM", class: "Senior Gentle", type: "Seniors", duration: "50 min", instructor: "Main Instructor", spots: 8 },
    { time: "7:00 PM", class: "Evening Relaxation", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Tuesday: [
    { time: "6:00 AM", class: "Power Yoga", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "5:00 PM", class: "Teen Strength", type: "Teens", duration: "60 min", instructor: "Main Instructor", spots: 12 },
    { time: "7:00 PM", class: "Stress Relief", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Wednesday: [
    { time: "6:00 AM", class: "Morning Flow", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "4:00 PM", class: "Kids Yoga", type: "Kids", duration: "45 min", instructor: "Main Instructor", spots: 10 },
    { time: "7:00 AM", class: "Senior Gentle", type: "Seniors", duration: "50 min", instructor: "Main Instructor", spots: 8 },
    { time: "7:00 PM", class: "Meditation Focus", type: "Adults", duration: "60 min", instructor: "Main Instructor", spots: 20 },
  ],
  Thursday: [
    { time: "6:00 AM", class: "Vinyasa Flow", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "5:00 PM", class: "Teen Mindfulness", type: "Teens", duration: "60 min", instructor: "Main Instructor", spots: 12 },
    { time: "7:00 PM", class: "Deep Stretch", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Friday: [
    { time: "6:00 AM", class: "Morning Flow", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "4:00 PM", class: "Kids Yoga", type: "Kids", duration: "45 min", instructor: "Main Instructor", spots: 10 },
    { time: "7:00 AM", class: "Senior Gentle", type: "Seniors", duration: "50 min", instructor: "Main Instructor", spots: 8 },
    { time: "7:00 PM", class: "Weekend Prep", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Saturday: [
    { time: "8:00 AM", class: "Weekend Special", type: "Adults", duration: "90 min", instructor: "Main Instructor", spots: 20 },
    { time: "10:00 AM", class: "Family Yoga", type: "All Ages", duration: "60 min", instructor: "Main Instructor", spots: 25 },
    { time: "5:00 PM", class: "Restorative Yoga", type: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Sunday: [
    { time: "9:00 AM", class: "Sunday Slow Flow", type: "Adults", duration: "90 min", instructor: "Main Instructor", spots: 20 },
    { time: "11:00 AM", class: "Meditation & Pranayama", type: "All Levels", duration: "60 min", instructor: "Main Instructor", spots: 25 },
  ],
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Kids": return "bg-sage-light text-sage-dark border-sage";
    case "Teens": return "bg-terracotta-light text-terracotta border-terracotta";
    case "Adults": return "bg-gold-light text-gold border-gold";
    case "Seniors": return "bg-muted text-forest border-forest";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const Schedule = () => {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [filterType, setFilterType] = useState("All");

  const types = ["All", "Kids", "Teens", "Adults", "Seniors"];

  const filteredSchedule = (scheduleData[selectedDay] || []).filter(
    (cls) => filterType === "All" || cls.type === filterType || cls.type === "All Ages" || cls.type === "All Levels"
  );

  const shiftDay = (dir: -1 | 1) => {
    const idx = weekDaysEn.indexOf(selectedDay);
    const next = (idx + dir + weekDaysEn.length) % weekDaysEn.length;
    setSelectedDay(weekDaysEn[next]);
  };

  const getTranslatedDay = (day: string) => {
    const idx = weekDaysEn.indexOf(day);
    return idx >= 0 ? t(`schedulePage.days.${weekDayKeys[idx]}`) : day;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Class Schedule – Weekly Timetable" description="View our weekly yoga class schedule." keywords="yoga schedule, yoga timetable" canonicalPath="/schedule" />
      <FlashNewsTicker />
      <Navbar />
      
      <main className="pt-32 md:pt-36">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-4">{t('schedulePage.badge')}</span>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                {t('schedulePage.title')} <span className="text-gradient-sage">{t('schedulePage.titleHighlight')}</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-8">{t('schedulePage.description')}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-body text-sm text-foreground">{t('schedulePage.location')}</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => shiftDay(-1)} title="Previous day" aria-label="Previous day" className="p-2 rounded-lg hover:bg-muted transition-colors widget-hover"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  {weekDaysEn.map((day) => (
                    <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 rounded-xl font-body text-sm whitespace-nowrap transition-all ${selectedDay === day ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border hover:border-primary/30"}`}>
                      {getTranslatedDay(day)}
                    </button>
                  ))}
                </div>
                <button onClick={() => shiftDay(1)} title="Next day" aria-label="Next day" className="p-2 rounded-lg hover:bg-muted transition-colors widget-hover"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-body text-sm text-muted-foreground">{t('schedulePage.filter')}</span>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1 rounded-full text-sm font-body transition-all ${filterType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                {getTranslatedDay(selectedDay)}{t('schedulePage.todayClasses')}
              </h2>
              {filteredSchedule.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredSchedule.map((cls, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(cls.type)}`}>{cls.type}</span>
                        <div className="text-right">
                          <div className="font-display text-lg font-semibold text-foreground">{cls.time}</div>
                          <div className="font-body text-sm text-muted-foreground">{cls.duration}</div>
                        </div>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{cls.class}</h3>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="w-4 h-4" />{cls.spots} {t('schedulePage.spots')}</span>
                        <Button variant="soft" size="sm" asChild><Link to="/register">{t('schedulePage.bookNow')}</Link></Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-body text-muted-foreground">{t('schedulePage.noClasses')}</p>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-16 p-8 rounded-3xl bg-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-semibold text-foreground">{t('schedulePage.monthlyOverview')}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-sage" />Kids</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-terracotta" />Teens</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gold" />Adults</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-forest" />Seniors</span>
                </div>
              </div>
              <p className="font-body text-muted-foreground mb-6">{t('schedulePage.monthlyDesc')}</p>
              <div className="grid grid-cols-7 gap-2">
                {weekDaysEn.map((day) => (
                  <div key={day} className="text-center">
                    <div className="font-body text-sm text-muted-foreground mb-2">{getTranslatedDay(day).slice(0, 3)}</div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sage to-gold" style={{ width: `${(scheduleData[day]?.length || 0) * 25}%` }} />
                    </div>
                    <div className="font-body text-xs text-muted-foreground mt-1">{scheduleData[day]?.length || 0} {t('schedulePage.classes')}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-gradient-sage">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">{t('schedulePage.ctaTitle')}</h2>
              <p className="font-body text-lg text-primary-foreground/80 mb-8">{t('schedulePage.ctaDesc')}</p>
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                <Link to="/register">{t('schedulePage.bookMySpot')}<Clock className="w-5 h-5" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
