import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Check, X, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TrainerAvailability {
  id: string;
  name: string;
  slots: {
    day: string;
    times: { time: string; available: boolean }[];
  }[];
}

const mockAvailability: TrainerAvailability[] = [
  {
    id: "1",
    name: "Master Dhan",
    slots: [
      { day: "Mon", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: false }] },
      { day: "Tue", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Wed", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Thu", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Fri", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: false }] },
      { day: "Sat", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: false }] },
    ],
  },
  {
    id: "2",
    name: "Master Rani",
    slots: [
      { day: "Mon", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Tue", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Wed", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Thu", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Fri", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Sat", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
    ],
  },
  {
    id: "3",
    name: "Master Arjun",
    slots: [
      { day: "Mon", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: true }] },
      { day: "Tue", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Wed", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: true }] },
      { day: "Thu", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Fri", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: true }] },
      { day: "Sat", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
    ],
  },
  {
    id: "4",
    name: "Master Lakshmi",
    slots: [
      { day: "Mon", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Tue", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Wed", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Thu", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: false }, { time: "4-6 PM", available: false }] },
      { day: "Fri", times: [{ time: "6-8 AM", available: false }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
      { day: "Sat", times: [{ time: "6-8 AM", available: true }, { time: "10-12 PM", available: true }, { time: "4-6 PM", available: true }] },
    ],
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = ["6-8 AM", "10-12 PM", "4-6 PM"];

const AvailabilityOverview = () => {
  const [availability, setAvailability] = useState(mockAvailability);
  const [editingTrainer, setEditingTrainer] = useState<string | null>(null);

  const toggleAvailability = (trainerId: string, dayIndex: number, timeIndex: number) => {
    if (editingTrainer !== trainerId) return;
    
    setAvailability((prev) =>
      prev.map((trainer) => {
        if (trainer.id === trainerId) {
          const newSlots = [...trainer.slots];
          newSlots[dayIndex] = {
            ...newSlots[dayIndex],
            times: newSlots[dayIndex].times.map((t, i) =>
              i === timeIndex ? { ...t, available: !t.available } : t
            ),
          };
          return { ...trainer, slots: newSlots };
        }
        return trainer;
      })
    );
  };

  const saveAvailability = (trainerId: string) => {
    setEditingTrainer(null);
    toast.success("Availability updated successfully!");
  };

  const getAvailabilityStats = (trainer: TrainerAvailability) => {
    let total = 0;
    let available = 0;
    trainer.slots.forEach((slot) => {
      slot.times.forEach((t) => {
        total++;
        if (t.available) available++;
      });
    });
    return { available, total, percentage: Math.round((available / total) * 100) };
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Availability Overview
          </h1>
          <p className="text-muted-foreground font-body">
            Manage trainer availability and schedule slots
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {availability.map((trainer, index) => {
            const stats = getAvailabilityStats(trainer);
            return (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-indigo-turquoise flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{trainer.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{stats.available}/{stats.total} slots</p>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="h-2 rounded-full bg-gradient-indigo-turquoise"
                  />
                </div>
                <p className="text-right font-body text-xs text-muted-foreground mt-1">{stats.percentage}% available</p>
              </motion.div>
            );
          })}
        </div>

        {/* Availability Grid */}
        <div className="space-y-6">
          {availability.map((trainer, trainerIndex) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: trainerIndex * 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              {/* Trainer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-indigo-turquoise flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{trainer.name}</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {getAvailabilityStats(trainer).available} available slots this week
                    </p>
                  </div>
                </div>
                <div>
                  {editingTrainer === trainer.id ? (
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => saveAvailability(trainer.id)}
                      title="Save availability changes"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTrainer(trainer.id)}
                      title="Edit availability"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Availability Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left font-body text-sm text-muted-foreground w-32">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time Slot
                        </div>
                      </th>
                      {days.map((day) => (
                        <th key={day} className="p-3 text-center font-body text-sm text-foreground font-medium">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time, timeIndex) => (
                      <tr key={time} className="border-b border-border last:border-b-0">
                        <td className="p-3 font-body text-sm text-muted-foreground">{time}</td>
                        {trainer.slots.map((slot, dayIndex) => {
                          const isAvailable = slot.times[timeIndex]?.available;
                          const isEditing = editingTrainer === trainer.id;
                          
                          return (
                            <td key={slot.day} className="p-3 text-center">
                              <motion.button
                                whileHover={isEditing ? { scale: 1.1 } : {}}
                                whileTap={isEditing ? { scale: 0.9 } : {}}
                                onClick={() => toggleAvailability(trainer.id, dayIndex, timeIndex)}
                                disabled={!isEditing}
                                className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                                  isAvailable
                                    ? "bg-turquoise/20 text-turquoise-dark border border-turquoise/30"
                                    : "bg-muted text-muted-foreground border border-border",
                                  isEditing && "cursor-pointer hover:shadow-md"
                                )}
                                title={`${slot.day} ${time}: ${isAvailable ? "Available" : "Unavailable"}`}
                                aria-label={`${isAvailable ? "Available" : "Unavailable"} - ${slot.day} ${time}`}
                              >
                                {isAvailable ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <X className="w-5 h-5" />
                                )}
                              </motion.button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AvailabilityOverview;
