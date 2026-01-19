import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Upload, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterTrainer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    email: "",
    experience: "",
    specialization: "",
    notes: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Trainer registered successfully!", {
      description: `${formData.fullName} has been added to the system.`,
    });
    
    setFormData({
      fullName: "",
      age: "",
      phone: "",
      email: "",
      experience: "",
      specialization: "",
      notes: "",
    });
    setResumeFile(null);
    setIsSubmitting(false);
  };

  const specializations = [
    "Hatha Yoga",
    "Vinyasa Flow",
    "Ashtanga Yoga",
    "Yin Yoga",
    "Kundalini Yoga",
    "Power Yoga",
    "Restorative Yoga",
    "Prenatal Yoga",
    "Kids Yoga",
    "Senior Yoga",
  ];

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-indigo-turquoise flex items-center justify-center mb-4"
          >
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Register New Trainer
          </h1>
          <p className="text-muted-foreground font-body">
            Add a new yoga instructor to your studio team
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter trainer's full name"
                title="Enter the trainer's full legal name"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="80"
                placeholder="Age"
                title="Enter the trainer's age (18-80)"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 123-4567"
                title="Enter contact phone number"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="trainer@example.com"
                title="Enter the trainer's email address"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                max="50"
                placeholder="Years"
                title="Enter years of teaching experience"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              />
            </div>

            {/* Specialization */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                title="Select the trainer's primary yoga specialization"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              >
                <option value="">Select a specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Resume Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Resume / CV
              </label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload resume or CV file"
                  aria-label="Upload resume or CV"
                />
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-body text-sm">{resumeFile.name}</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground font-body text-sm">
                    Drag and drop or click to upload (PDF, DOC, DOCX)
                  </p>
                )}
              </motion.div>
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional information about the trainer..."
                title="Enter any additional notes or information"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              title="Register the new trainer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Register Trainer
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default RegisterTrainer;
