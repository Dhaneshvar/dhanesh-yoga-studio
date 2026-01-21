import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Check, X, Edit2, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TrainerAvailability {
  id: string;
  name: string;
  slots: {
    day: string;
    times: TimeSlot[];
  }[];
}

const defaultTimeSlots = ["6-8 AM", "8-10 AM", "10-12 PM", "12-2 PM", "2-4 PM", "4-6 PM", "6-8 PM"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const mockAvailability: TrainerAvailability[] = [
  {
    id: "1",
    name: "Master Dhan",
    slots: days.map(day => ({
      day,
      times: [
        { time: "6-8 AM", available: day === "Mon" || day === "Wed" || day === "Fri" },
        { time: "10-12 PM", available: day !== "Tue" && day !== "Thu" },
        { time: "4-6 PM", available: day === "Wed" },
      ],
    })),
  },
  {
    id: "2",
    name: "Master Rani",
    slots: days.map(day => ({
      day,
      times: [
        { time: "6-8 AM", available: day === "Tue" || day === "Thu" || day === "Sat" },
        { time: "10-12 PM", available: day === "Tue" || day === "Thu" || day === "Sat" },
        { time: "4-6 PM", available: day === "Tue" || day === "Thu" || day === "Sat" },
      ],
    })),
  },
  {
    id: "3",
    name: "Master Arjun",
    slots: days.map(day => ({
      day,
      times: [
        { time: "6-8 AM", available: day !== "Sat" && day !== "Sun" },
        { time: "10-12 PM", available: day === "Tue" || day === "Thu" },
        { time: "4-6 PM", available: day !== "Sat" && day !== "Sun" },
      ],
    })),
  },
  {
    id: "4",
    name: "Master Lakshmi",
    slots: days.map(day => ({
      day,
      times: [
        { time: "6-8 AM", available: day === "Sat" },
        { time: "10-12 PM", available: day === "Mon" || day === "Wed" || day === "Fri" || day === "Sat" },
        { time: "4-6 PM", available: day === "Mon" || day === "Wed" || day === "Fri" || day === "Sat" },
      ],
    })),
  },
];

const AvailabilityOverview = () => {
  const [availability, setAvailability] = useState(mockAvailability);
  const [editingTrainer, setEditingTrainer] = useState<string | null>(null);
  const [addSlotDialog, setAddSlotDialog] = useState<{ open: boolean; trainerId: string | null }>({
    open: false,
    trainerId: null,
  });
  const [newSlot, setNewSlot] = useState({ day: "Mon", time: "8-10 AM" });
  const [quickEditMode, setQuickEditMode] = useState(false);

  const toggleAvailability = (trainerId: string, dayIndex: number, timeIndex: number) => {
    if (editingTrainer !== trainerId && !quickEditMode) return;

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

    if (quickEditMode) {
      toast.success("Availability updated!");
    }
  };

  const addTimeSlot = (trainerId: string) => {
    setAvailability((prev) =>
      prev.map((trainer) => {
        if (trainer.id === trainerId) {
          const newSlots = trainer.slots.map((slot) => {
            if (slot.day === newSlot.day) {
              // Check if slot already exists
              if (slot.times.some((t) => t.time === newSlot.time)) {
                return slot;
              }
              return {
                ...slot,
                times: [...slot.times, { time: newSlot.time, available: true }].sort(
                  (a, b) => defaultTimeSlots.indexOf(a.time) - defaultTimeSlots.indexOf(b.time)
                ),
              };
            }
            return slot;
          });
          return { ...trainer, slots: newSlots };
        }
        return trainer;
      })
    );
    setAddSlotDialog({ open: false, trainerId: null });
    toast.success("Time slot added!");
  };

  const removeTimeSlot = (trainerId: string, dayIndex: number, timeIndex: number) => {
    setAvailability((prev) =>
      prev.map((trainer) => {
        if (trainer.id === trainerId) {
          const newSlots = [...trainer.slots];
          newSlots[dayIndex] = {
            ...newSlots[dayIndex],
            times: newSlots[dayIndex].times.filter((_, i) => i !== timeIndex),
          };
          return { ...trainer, slots: newSlots };
        }
        return trainer;
      })
    );
    toast.success("Time slot removed!");
  };

  const saveAvailability = (trainerId: string) => {
    setEditingTrainer(null);
    toast.success("Availability saved successfully!");
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
    return { available, total, percentage: total > 0 ? Math.round((available / total) * 100) : 0 };
  };

  const getAllTimeSlots = (trainer: TrainerAvailability) => {
    const allSlots = new Set<string>();
    trainer.slots.forEach((slot) => {
      slot.times.forEach((t) => allSlots.add(t.time));
    });
    return Array.from(allSlots).sort(
      (a, b) => defaultTimeSlots.indexOf(a) - defaultTimeSlots.indexOf(b)
    );
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Availability Overview
            </h1>
            <p className="text-muted-foreground font-body">
              Manage trainer availability and schedule slots
            </p>
          </div>

          {/* Quick Edit Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant={quickEditMode ? "hero" : "outline"}
              onClick={() => {
                setQuickEditMode(!quickEditMode);
                if (!quickEditMode) {
                  toast.info("Quick edit mode enabled - click any slot to toggle!");
                }
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Quick Edit {quickEditMode ? "On" : "Off"}
            </Button>
          </div>
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
                    <p className="font-body text-xs text-muted-foreground">
                      {stats.available}/{stats.total} slots
                    </p>
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
                <p className="text-right font-body text-xs text-muted-foreground mt-1">
                  {stats.percentage}% available
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Availability Grid */}
        <div className="space-y-6">
          {availability.map((trainer, trainerIndex) => {
            const timeSlots = getAllTimeSlots(trainer);

            return (
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
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {trainer.name}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground">
                        {getAvailabilityStats(trainer).available} available slots this week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Add Time Slot Button */}
                    <Dialog
                      open={addSlotDialog.open && addSlotDialog.trainerId === trainer.id}
                      onOpenChange={(open) =>
                        setAddSlotDialog({ open, trainerId: open ? trainer.id : null })
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" title="Add time slot">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Slot
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Time Slot for {trainer.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Day</Label>
                            <Select
                              value={newSlot.day}
                              onValueChange={(value) => setNewSlot({ ...newSlot, day: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {days.map((day) => (
                                  <SelectItem key={day} value={day}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Time Slot</Label>
                            <Select
                              value={newSlot.time}
                              onValueChange={(value) => setNewSlot({ ...newSlot, time: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {defaultTimeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setAddSlotDialog({ open: false, trainerId: null })}
                          >
                            Cancel
                          </Button>
                          <Button variant="hero" onClick={() => addTimeSlot(trainer.id)}>
                            Add Slot
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

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
                          <th
                            key={day}
                            className="p-3 text-center font-body text-sm text-foreground font-medium"
                          >
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
                            const slotData = slot.times.find((t) => t.time === time);
                            const isAvailable = slotData?.available ?? false;
                            const isEditing = editingTrainer === trainer.id || quickEditMode;
                            const slotIndex = slot.times.findIndex((t) => t.time === time);

                            if (!slotData) {
                              return (
                                <td key={slot.day} className="p-3 text-center">
                                  <div className="w-10 h-10 mx-auto rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground/50">
                                    —
                                  </div>
                                </td>
                              );
                            }

                            return (
                              <td key={slot.day} className="p-3 text-center">
                                <div className="relative group">
                                  <motion.button
                                    whileHover={isEditing ? { scale: 1.1 } : {}}
                                    whileTap={isEditing ? { scale: 0.9 } : {}}
                                    onClick={() =>
                                      toggleAvailability(trainer.id, dayIndex, slotIndex)
                                    }
                                    disabled={!isEditing}
                                    className={cn(
                                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                                      isAvailable
                                        ? "bg-turquoise/20 text-turquoise-dark border border-turquoise/30"
                                        : "bg-muted text-muted-foreground border border-border",
                                      isEditing && "cursor-pointer hover:shadow-md"
                                    )}
                                    title={`${slot.day} ${time}: ${
                                      isAvailable ? "Available" : "Unavailable"
                                    }`}
                                    aria-label={`${isAvailable ? "Available" : "Unavailable"} - ${
                                      slot.day
                                    } ${time}`}
                                  >
                                    {isAvailable ? (
                                      <Check className="w-5 h-5" />
                                    ) : (
                                      <X className="w-5 h-5" />
                                    )}
                                  </motion.button>

                                  {/* Delete button on hover */}
                                  {editingTrainer === trainer.id && (
                                    <AnimatePresence>
                                      <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() =>
                                          removeTimeSlot(trainer.id, dayIndex, slotIndex)
                                        }
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove slot"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </motion.button>
                                    </AnimatePresence>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick Actions */}
                {editingTrainer === trainer.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 border-t border-border bg-secondary/20"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAvailability((prev) =>
                            prev.map((t) => {
                              if (t.id === trainer.id) {
                                return {
                                  ...t,
                                  slots: t.slots.map((s) => ({
                                    ...s,
                                    times: s.times.map((time) => ({ ...time, available: true })),
                                  })),
                                };
                              }
                              return t;
                            })
                          );
                        }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark All Available
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAvailability((prev) =>
                            prev.map((t) => {
                              if (t.id === trainer.id) {
                                return {
                                  ...t,
                                  slots: t.slots.map((s) => ({
                                    ...s,
                                    times: s.times.map((time) => ({ ...time, available: false })),
                                  })),
                                };
                              }
                              return t;
                            })
                          );
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Mark All Unavailable
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AvailabilityOverview;
