import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Search, Filter, X, Wind, Zap, Heart, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const asanas = [
  { id: 1, name: "Tadasana", english: "Mountain Pose", difficulty: "Beginner", category: "Standing", duration: "30-60 seconds", description: "The foundation of all standing poses. Improves posture and body awareness.", benefits: ["Improves posture", "Strengthens thighs", "Increases awareness"], muscles: ["Thighs", "Knees", "Ankles", "Abdomen"], breathing: "Breathe deeply and evenly through the nose.", howTo: "Stand with feet together, ground through all four corners of your feet. Engage thighs, tuck tailbone, and extend through the crown of your head.", emoji: "🏔️" },
  { id: 2, name: "Vrikshasana", english: "Tree Pose", difficulty: "Beginner", category: "Balance", duration: "30-60 seconds each side", description: "A balancing pose that promotes focus and mental clarity.", benefits: ["Improves balance", "Strengthens legs", "Opens hips"], muscles: ["Thighs", "Calves", "Ankles", "Core"], breathing: "Steady, deep breaths to maintain balance.", howTo: "Stand on one leg, place the other foot on inner thigh or calf (not knee). Hands in prayer position or raised overhead.", emoji: "🌳" },
  { id: 3, name: "Adho Mukha Svanasana", english: "Downward Dog", difficulty: "Beginner", category: "Inversion", duration: "1-3 minutes", description: "A rejuvenating pose that stretches the entire body.", benefits: ["Full body stretch", "Calms the mind", "Energizes body"], muscles: ["Shoulders", "Hamstrings", "Calves", "Hands"], breathing: "Breathe deeply, pressing heels toward floor on exhale.", howTo: "From all fours, lift hips up and back. Straighten legs, press hands firmly into mat, create inverted V shape.", emoji: "🐕" },
  { id: 4, name: "Virabhadrasana I", english: "Warrior I", difficulty: "Intermediate", category: "Standing", duration: "30-60 seconds each side", description: "A powerful standing pose that builds strength and stamina.", benefits: ["Strengthens legs", "Opens chest", "Builds focus"], muscles: ["Quadriceps", "Shoulders", "Arms", "Back"], breathing: "Inhale as you raise arms, exhale to deepen the lunge.", howTo: "Step one foot back, bend front knee to 90°. Square hips forward, raise arms overhead. Gaze up between hands.", emoji: "⚔️" },
  { id: 5, name: "Balasana", english: "Child's Pose", difficulty: "Beginner", category: "Resting", duration: "1-5 minutes", description: "A gentle resting pose that calms the mind and relieves tension.", benefits: ["Relaxes body", "Calms nervous system", "Stretches back"], muscles: ["Back", "Hips", "Thighs", "Ankles"], breathing: "Slow, deep belly breaths. Let go with each exhale.", howTo: "Kneel on floor, sit back on heels. Fold forward, rest forehead on mat. Arms extended or by sides.", emoji: "🧒" },
  { id: 6, name: "Bhujangasana", english: "Cobra Pose", difficulty: "Beginner", category: "Backbend", duration: "15-30 seconds", description: "A gentle backbend that opens the chest and strengthens the spine.", benefits: ["Opens chest", "Strengthens spine", "Improves flexibility"], muscles: ["Spine", "Chest", "Shoulders", "Abdomen"], breathing: "Inhale to lift, exhale to release. Breathe fully into chest.", howTo: "Lie face down, hands under shoulders. Press up, keeping hips on floor. Lift chest, roll shoulders back.", emoji: "🐍" },
  { id: 7, name: "Trikonasana", english: "Triangle Pose", difficulty: "Intermediate", category: "Standing", duration: "30-60 seconds each side", description: "A deep stretch for the sides of the body and legs.", benefits: ["Stretches sides", "Strengthens legs", "Opens hips"], muscles: ["Hamstrings", "Groin", "Hips", "Spine"], breathing: "Breathe into the side body, expanding ribs on inhale.", howTo: "Stand with feet wide apart. Turn one foot out 90°. Extend arms, hinge at hip to reach toward front foot.", emoji: "📐" },
  { id: 8, name: "Savasana", english: "Corpse Pose", difficulty: "Beginner", category: "Resting", duration: "5-15 minutes", description: "The final relaxation pose that integrates the benefits of your practice.", benefits: ["Deep relaxation", "Reduces stress", "Calms mind"], muscles: ["Full body relaxation"], breathing: "Natural, effortless breathing. Let go completely.", howTo: "Lie flat on back, legs slightly apart, arms by sides with palms up. Close eyes and completely relax.", emoji: "😌" },
];

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
const categories = ["All", "Standing", "Balance", "Inversion", "Backbend", "Resting"];

const difficultyKeyMap: Record<string, string> = {
  All: "asanasPage.all", Beginner: "asanasPage.beginner",
  Intermediate: "asanasPage.intermediate", Advanced: "asanasPage.advanced",
};
const categoryKeyMap: Record<string, string> = {
  All: "asanasPage.all", Standing: "asanasPage.standing", Balance: "asanasPage.balance",
  Inversion: "asanasPage.inversion", Backbend: "asanasPage.backbend", Resting: "asanasPage.resting",
};

const Asanas = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAsana, setSelectedAsana] = useState<typeof asanas[0] | null>(null);

  const filteredAsanas = asanas.filter((asana) => {
    const matchesSearch = asana.name.toLowerCase().includes(searchTerm.toLowerCase()) || asana.english.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || asana.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "All" || asana.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-sage-light text-sage-dark";
      case "Intermediate": return "bg-gold-light text-gold";
      case "Advanced": return "bg-terracotta-light text-terracotta";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Asana Library – Yoga Poses Guide" description="Explore our comprehensive asana library with detailed instructions." keywords="yoga poses, asanas, yoga guide" canonicalPath="/asanas" />
      <FlashNewsTicker />
      <Navbar />
      
      <main className="pt-32 md:pt-36">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-4">{t('asanasPage.badge')}</span>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                {t('asanasPage.title')} <span className="text-gradient-sage">{t('asanasPage.titleHighlight')}</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground">{t('asanasPage.description')}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" placeholder={t('asanasPage.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all" />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">{t('asanasPage.difficulty')}</span>
                  <div className="flex gap-2">
                    {difficulties.map((diff) => (
                      <button key={diff} onClick={() => setSelectedDifficulty(diff)} className={`px-3 py-1 rounded-full text-sm font-body transition-all ${selectedDifficulty === diff ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {t(difficultyKeyMap[diff])}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-muted-foreground">{t('asanasPage.category')}</span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 rounded-full text-sm font-body transition-all ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {t(categoryKeyMap[cat])}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredAsanas.map((asana, index) => (
                  <motion.div key={asana.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }} whileHover={{ y: -5 }} onClick={() => setSelectedAsana(asana)} className="cursor-pointer group">
                    <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
                      <div className="text-5xl mb-4">{asana.emoji}</div>
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 ${getDifficultyColor(asana.difficulty)}`}>{asana.difficulty}</span>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-1">{asana.name}</h3>
                      <p className="font-body text-sm text-primary mb-2">{asana.english}</p>
                      <p className="font-body text-sm text-muted-foreground line-clamp-2">{asana.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-1 rounded bg-muted">{asana.category}</span>
                        <span className="px-2 py-1 rounded bg-muted">{asana.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {filteredAsanas.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="font-body text-lg text-muted-foreground">{t('asanasPage.noResults')}</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedAsana && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedAsana(null)}>
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-background rounded-3xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-6xl mb-4">{selectedAsana.emoji}</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedAsana.difficulty)}`}>{selectedAsana.difficulty}</span>
                    </div>
                    <button onClick={() => setSelectedAsana(null)} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-6 h-6" /></button>
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-foreground mb-1">{selectedAsana.name}</h2>
                  <p className="font-body text-lg text-primary mb-4">{selectedAsana.english}</p>
                  <p className="font-body text-muted-foreground mb-6">{selectedAsana.description}</p>
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <Wind className="w-5 h-5 text-primary mb-2" />
                      <h4 className="font-display font-semibold text-foreground mb-1">{t('asanasPage.breathing')}</h4>
                      <p className="font-body text-sm text-muted-foreground">{selectedAsana.breathing}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <Zap className="w-5 h-5 text-gold mb-2" />
                      <h4 className="font-display font-semibold text-foreground mb-1">{t('asanasPage.muscles')}</h4>
                      <p className="font-body text-sm text-muted-foreground">{selectedAsana.muscles.join(", ")}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Brain className="w-5 h-5 text-primary" />{t('asanasPage.howToDoIt')}</h4>
                    <p className="font-body text-muted-foreground bg-muted p-4 rounded-xl">{selectedAsana.howTo}</p>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Heart className="w-5 h-5 text-terracotta" />{t('asanasPage.benefits')}</h4>
                    <ul className="space-y-2">
                      {selectedAsana.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 font-body text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />{benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Asanas;
