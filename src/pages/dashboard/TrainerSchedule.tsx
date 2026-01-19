import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScheduleSlot {
  id: string;
  trainer: string;
  session: string;
  startTime: string;
  endTime: string;
  color: string;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];

// Mock schedule data
const mockSchedule: Record<string, ScheduleSlot[]> = {
  Mon: [
    { id: "1", trainer: "Master Dhan", session: "Hatha Yoga", startTime: "10 AM", endTime: "12 PM", color: "bg-indigo/20 border-indigo/40 text-indigo-dark" },
    { id: "2", trainer: "Master Lakshmi", session: "Power Yoga", startTime: "5 PM", endTime: "6 PM", color: "bg-lotus/20 border-lotus/40 text-lotus" },
  ],
  Tue: [
    { id: "3", trainer: "Master Rani", session: "Vinyasa Flow", startTime: "7 AM", endTime: "8 AM", color: "bg-turquoise/20 border-turquoise/40 text-turquoise-dark" },
    { id: "4", trainer: "Master Arjun", session: "Ashtanga", startTime: "2 PM", endTime: "4 PM", color: "bg-sunset/20 border-sunset/40 text-sunset" },
  ],
  Wed: [
    { id: "5", trainer: "Master Dhan", session: "Meditation", startTime: "6 AM", endTime: "7 AM", color: "bg-indigo/20 border-indigo/40 text-indigo-dark" },
    { id: "6", trainer: "Master Lakshmi", session: "Power Yoga", startTime: "3 PM", endTime: "4 PM", color: "bg-lotus/20 border-lotus/40 text-lotus" },
  ],
  Thu: [
    { id: "7", trainer: "Master Rani", session: "Vinyasa Flow", startTime: "9 AM", endTime: "10 AM", color: "bg-turquoise/20 border-turquoise/40 text-turquoise-dark" },
    { id: "8", trainer: "Master Arjun", session: "Ashtanga", startTime: "5 PM", endTime: "7 PM", color: "bg-sunset/20 border-sunset/40 text-sunset" },
  ],
  Fri: [
    { id: "9", trainer: "Master Dhan", session: "Hatha Yoga", startTime: "8 AM", endTime: "10 AM", color: "bg-indigo/20 border-indigo/40 text-indigo-dark" },
    { id: "10", trainer: "Master Lakshmi", session: "Restorative", startTime: "6 PM", endTime: "8 PM", color: "bg-lotus/20 border-lotus/40 text-lotus" },
  ],
  Sat: [
    { id: "11", trainer: "Master Rani", session: "Weekend Flow", startTime: "9 AM", endTime: "11 AM", color: "bg-turquoise/20 border-turquoise/40 text-turquoise-dark" },
  ],
  Sun: [],
};

const TrainerSchedule = () => {
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        isToday: new Date().toDateString() === date.toDateString(),
      };
    });
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getSlotPosition = (startTime: string) => {
    const hour = parseInt(startTime);
    const isPM = startTime.includes("PM");
    let hourIndex = hour === 12 ? 12 : isPM ? hour + 12 : hour;
    return timeSlots.indexOf(startTime);
  };

  const getSlotHeight = (startTime: string, endTime: string) => {
    const startIndex = getSlotPosition(startTime);
    const endIndex = getSlotPosition(endTime);
    return (endIndex - startIndex) * 60; // 60px per hour
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Trainer Schedule
            </h1>
            <p className="text-muted-foreground font-body">
              View and manage trainer sessions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setView("weekly")}
                className={cn(
                  "px-4 py-2 font-body text-sm transition-colors",
                  view === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="Weekly view"
              >
                Weekly
              </button>
              <button
                onClick={() => setView("monthly")}
                className={cn(
                  "px-4 py-2 font-body text-sm transition-colors",
                  view === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="Monthly view"
              >
                Monthly
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek("prev")}
                title="Previous week"
                aria-label="Go to previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
                title="Go to today"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek("next")}
                title="Next week"
                aria-label="Go to next week"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo/20 border border-indigo/40" />
            <span className="font-body text-sm text-muted-foreground">Master Dhan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-turquoise/20 border border-turquoise/40" />
            <span className="font-body text-sm text-muted-foreground">Master Rani</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sunset/20 border border-sunset/40" />
            <span className="font-body text-sm text-muted-foreground">Master Arjun</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-lotus/20 border border-lotus/40" />
            <span className="font-body text-sm text-muted-foreground">Master Lakshmi</span>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-4 bg-secondary/30 border-r border-border">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            {weekDates.map((date) => (
              <div
                key={date.day}
                className={cn(
                  "p-4 text-center border-r border-border last:border-r-0",
                  date.isToday && "bg-primary/10"
                )}
              >
                <p className="font-body text-xs text-muted-foreground uppercase">{date.day}</p>
                <p className={cn(
                  "font-display text-lg font-semibold",
                  date.isToday ? "text-primary" : "text-foreground"
                )}>
                  {date.date}
                </p>
                <p className="font-body text-xs text-muted-foreground">{date.month}</p>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-8">
              {/* Time Column */}
              <div className="border-r border-border">
                {timeSlots.map((time) => (
                  <div key={time} className="h-[60px] px-3 py-2 border-b border-border flex items-start">
                    <span className="font-body text-xs text-muted-foreground">{time}</span>
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {weekDays.map((day) => (
                <div key={day} className="relative border-r border-border last:border-r-0">
                  {timeSlots.map((time) => (
                    <div key={time} className="h-[60px] border-b border-border hover:bg-secondary/20 transition-colors" />
                  ))}
                  
                  {/* Schedule Slots */}
                  {mockSchedule[day]?.map((slot) => {
                    const topPosition = getSlotPosition(slot.startTime) * 60;
                    const height = getSlotHeight(slot.startTime, slot.endTime);
                    
                    return (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        onMouseEnter={() => setHoveredSlot(slot.id)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        style={{ top: topPosition, height }}
                        className={cn(
                          "absolute left-1 right-1 rounded-lg border-l-4 p-2 cursor-pointer transition-all duration-200",
                          slot.color
                        )}
                        title={`${slot.trainer}: ${slot.session} (${slot.startTime} - ${slot.endTime})`}
                      >
                        <p className="font-body text-xs font-medium truncate">{slot.session}</p>
                        <p className="font-body text-[10px] opacity-80 truncate">{slot.trainer}</p>
                        
                        {/* Hover Tooltip */}
                        {hoveredSlot === slot.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-full ml-2 top-0 z-20 bg-card border border-border rounded-xl p-3 shadow-elevated min-w-[200px]"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="font-body text-sm font-medium">{slot.trainer}</span>
                            </div>
                            <p className="font-body text-sm text-foreground mb-1">{slot.session}</p>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span className="font-body text-xs">{slot.startTime} - {slot.endTime}</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrainerSchedule;
