import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Calendar, Clock, MapPin, GraduationCap,
  Leaf, ArrowRight, CheckCircle, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const trainers = [
  { id: "t1", name: "Priya Sharma", specialty: "Vinyasa & Hatha", experience: "8 years", rating: 4.9, avatar: "🧘‍♀️", available: true },
  { id: "t2", name: "Amit Patel", specialty: "Power Yoga", experience: "12 years", rating: 4.8, avatar: "🧘‍♂️", available: true },
  { id: "t3", name: "Meera Krishnan", specialty: "Restorative & Yin", experience: "6 years", rating: 4.7, avatar: "🧘‍♀️", available: true },
  { id: "t4", name: "Lakshmi Rao", specialty: "Pranayama & Meditation", experience: "15 years", rating: 5.0, avatar: "🧘‍♀️", available: false },
  { id: "t5", name: "Ravi Kumar", specialty: "Ashtanga Yoga", experience: "10 years", rating: 4.6, avatar: "🧘‍♂️", available: true },
];

const programs = [
  { id: "p1", name: "Morning Flow", time: "6:00 AM - 7:00 AM", days: "Mon, Wed, Fri", level: "Beginner", spots: 8 },
  { id: "p2", name: "Power Vinyasa", time: "7:30 AM - 8:30 AM", days: "Tue, Thu, Sat", level: "Intermediate", spots: 5 },
  { id: "p3", name: "Gentle Hatha", time: "9:00 AM - 10:00 AM", days: "Mon-Fri", level: "All Levels", spots: 12 },
  { id: "p4", name: "Evening Meditation", time: "5:00 PM - 6:00 PM", days: "Mon, Wed, Fri", level: "All Levels", spots: 15 },
  { id: "p5", name: "Advanced Ashtanga", time: "6:30 PM - 8:00 PM", days: "Tue, Thu", level: "Advanced", spots: 3 },
  { id: "p6", name: "Weekend Wellness", time: "8:00 AM - 9:30 AM", days: "Sat, Sun", level: "All Levels", spots: 20 },
];

type Step = 1 | 2 | 3 | 4;

const StudentRegistration = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    emergencyContact: "",
    healthConditions: "",
    experience: "beginner",
    selectedTrainer: "",
    selectedProgram: "",
    goals: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (s: Step): boolean => {
    switch (s) {
      case 1:
        return !!(formData.fullName.trim() && formData.email.trim() && formData.phone.trim() && formData.age.trim());
      case 2:
        return !!formData.selectedProgram;
      case 3:
        return !!formData.selectedTrainer;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    // Store registration in localStorage for demo
    const registrations = JSON.parse(localStorage.getItem("studentRegistrations") || "[]");
    const newReg = {
      id: `reg-${Date.now()}`,
      ...formData,
      trainerName: trainers.find(t => t.id === formData.selectedTrainer)?.name || "",
      programName: programs.find(p => p.id === formData.selectedProgram)?.name || "",
      programTime: programs.find(p => p.id === formData.selectedProgram)?.time || "",
      programDays: programs.find(p => p.id === formData.selectedProgram)?.days || "",
      registeredAt: new Date().toISOString(),
      status: "active",
    };
    registrations.push(newReg);
    localStorage.setItem("studentRegistrations", JSON.stringify(registrations));

    toast({
      title: "🎉 Registration Successful!",
      description: "Welcome to your yoga journey. Check My Registrations for details.",
    });
    // Reset
    setStep(1);
    setFormData({
      fullName: "", email: "", phone: "", age: "", emergencyContact: "",
      healthConditions: "", experience: "beginner", selectedTrainer: "",
      selectedProgram: "", goals: "",
    });
  };

  const steps = [
    { num: 1, label: "Personal Info" },
    { num: 2, label: "Select Program" },
    { num: 3, label: "Choose Trainer" },
    { num: 4, label: "Review & Submit" },
  ];

  const selectedTrainerData = trainers.find(t => t.id === formData.selectedTrainer);
  const selectedProgramData = programs.find(p => p.id === formData.selectedProgram);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground">Class Registration</h1>
        <p className="text-muted-foreground mt-1">Register for yoga classes and begin your journey</p>
      </motion.div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: step >= s.num ? 1.1 : 1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  step > s.num ? "bg-primary text-primary-foreground" :
                  step === s.num ? "bg-primary text-primary-foreground shadow-soft" :
                  "bg-muted text-muted-foreground"
                )}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </motion.div>
              <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2", step > s.num ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={formData.fullName} onChange={e => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Age *</label>
                  <input type="number" value={formData.age} onChange={e => handleInputChange("age", e.target.value)}
                    placeholder="Enter your age" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Emergency Contact</label>
                <input value={formData.emergencyContact} onChange={e => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Emergency contact name & number" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Health Conditions (if any)</label>
                <textarea value={formData.healthConditions} onChange={e => handleInputChange("healthConditions", e.target.value)}
                  placeholder="Any injuries, medical conditions, or physical limitations..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[80px] resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Yoga Experience</label>
                <select value={formData.experience} onChange={e => handleInputChange("experience", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                  <option value="beginner">Beginner (0-6 months)</option>
                  <option value="intermediate">Intermediate (6 months - 2 years)</option>
                  <option value="advanced">Advanced (2+ years)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Select Program */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Select a Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programs.map(prog => (
                  <motion.button
                    key={prog.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("selectedProgram", prog.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      formData.selectedProgram === prog.id
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{prog.name}</h3>
                      <Badge variant={prog.spots < 5 ? "destructive" : "secondary"} className="text-xs">
                        {prog.spots} spots
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {prog.time}</p>
                      <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {prog.days}</p>
                      <p className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {prog.level}</p>
                    </div>
                    {formData.selectedProgram === prog.id && (
                      <div className="mt-2 flex items-center gap-1 text-primary text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Selected
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Choose Trainer */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Leaf className="w-5 h-5 text-primary" /> Choose Your Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainers.map(trainer => (
                  <motion.button
                    key={trainer.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => trainer.available && handleInputChange("selectedTrainer", trainer.id)}
                    disabled={!trainer.available}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4",
                      !trainer.available && "opacity-50 cursor-not-allowed",
                      formData.selectedTrainer === trainer.id
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl">
                      {trainer.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{trainer.name}</h3>
                        {!trainer.available && <Badge variant="destructive" className="text-xs">Unavailable</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{trainer.specialty}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>⭐ {trainer.rating}</span>
                        <span>📅 {trainer.experience}</span>
                      </div>
                    </div>
                    {formData.selectedTrainer === trainer.id && (
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Review & Confirm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Details */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Personal Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.fullName}</span></p>
                  <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.email}</span></p>
                  <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{formData.phone}</span></p>
                  <p><span className="text-muted-foreground">Age:</span> <span className="font-medium">{formData.age}</span></p>
                  <p><span className="text-muted-foreground">Experience:</span> <span className="font-medium capitalize">{formData.experience}</span></p>
                </div>
              </div>

              {/* Selected Program */}
              {selectedProgramData && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Selected Program</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-lg">{selectedProgramData.name}</p>
                    <p className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3.5 h-3.5" /> {selectedProgramData.time}</p>
                    <p className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-3.5 h-3.5" /> {selectedProgramData.days}</p>
                    <Badge variant="secondary">{selectedProgramData.level}</Badge>
                  </div>
                </div>
              )}

              {/* Selected Trainer */}
              {selectedTrainerData && (
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2"><Leaf className="w-4 h-4 text-primary" /> Selected Trainer</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedTrainerData.avatar}</span>
                    <div>
                      <p className="font-semibold">{selectedTrainerData.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedTrainerData.specialty}</p>
                      <p className="text-xs text-muted-foreground">⭐ {selectedTrainerData.rating} · {selectedTrainerData.experience}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Your Yoga Goals (optional)</label>
                <textarea value={formData.goals} onChange={e => handleInputChange("goals", e.target.value)}
                  placeholder="What do you hope to achieve? (e.g., flexibility, stress relief, weight loss...)"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[80px] resize-none" />
              </div>

              <div className="p-3 rounded-xl bg-accent/50 border border-accent flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  By registering, you agree to our terms and conditions. Please arrive 10 minutes before your first class. Wear comfortable clothing and bring a water bottle.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack} disabled={step === 1} className="min-w-[120px]">
          Back
        </Button>
        {step < 4 ? (
          <Button variant="hero" onClick={handleNext} className="min-w-[120px]">
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button variant="hero" onClick={handleSubmit} className="min-w-[160px]">
            ✅ Confirm Registration
          </Button>
        )}
      </div>
    </div>
  );
};

export default StudentRegistration;
