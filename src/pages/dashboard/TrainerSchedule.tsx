import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  User,
  Clock,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay, addWeeks, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ScheduleSlot {
  id: string;
  trainer: string;
  session: string;
  startTime: string;
  endTime: string;
  color: string;
  date?: Date;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM",
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const getWeekDates = () => {
    const startOfWeekDate = startOfWeek(currentDate);
    return weekDays.map((day, index) => {
      const date = new Date(startOfWeekDate);
      date.setDate(startOfWeekDate.getDate() + index);
      return {
        day,
        date: date.getDate(),
        fullDate: date,
        month: format(date, "MMM"),
        isToday: isToday(date),
      };
    });
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction: "prev" | "next") => {
    if (direction === "next") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "next") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const getSlotPosition = (startTime: string) => {
    return timeSlots.indexOf(startTime);
  };

  const getSlotHeight = (startTime: string, endTime: string) => {
    const startIndex = getSlotPosition(startTime);
    const endIndex = getSlotPosition(endTime);
    return (endIndex - startIndex) * 60;
  };

  // Get calendar days for monthly view
  const getMonthDays = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  };

  const monthDays = getMonthDays();

  // Get sessions for a specific day
  const getSessionsForDay = (date: Date) => {
    const dayName = format(date, "EEE");
    return mockSchedule[dayName] || [];
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentDate(date);
    }
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
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

          <div className="flex flex-wrap items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setView("weekly")}
                className={cn(
                  "px-4 py-2 font-body text-sm transition-colors",
                  view === "weekly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Weekly view"
              >
                Weekly
              </button>
              <button
                onClick={() => setView("monthly")}
                className={cn(
                  "px-4 py-2 font-body text-sm transition-colors",
                  view === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Monthly view"
              >
                Monthly
              </button>
            </div>

            {/* Month/Year Selectors */}
            <div className="flex items-center gap-2">
              <Select value={months[currentDate.getMonth()]} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentDate.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" title="Pick a date">
                  <CalendarIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => (view === "weekly" ? navigateWeek("prev") : navigateMonth("prev"))}
                title={view === "weekly" ? "Previous week" : "Previous month"}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => (view === "weekly" ? navigateWeek("prev") : navigateMonth("prev"))}
                title="Previous"
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
                onClick={() => (view === "weekly" ? navigateWeek("next") : navigateMonth("next"))}
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => (view === "weekly" ? navigateWeek("next") : navigateMonth("next"))}
                title={view === "weekly" ? "Next week" : "Next month"}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Date Display */}
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            {view === "weekly"
              ? `Week of ${format(weekDates[0].fullDate, "MMMM d")} - ${format(weekDates[6].fullDate, "MMMM d, yyyy")}`
              : format(currentDate, "MMMM yyyy")}
          </h2>
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

        {/* Weekly Calendar View */}
        {view === "weekly" && (
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
                  <p
                    className={cn(
                      "font-display text-lg font-semibold",
                      date.isToday ? "text-primary" : "text-foreground"
                    )}
                  >
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
                    <div
                      key={time}
                      className="h-[60px] px-3 py-2 border-b border-border flex items-start"
                    >
                      <span className="font-body text-xs text-muted-foreground">{time}</span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((day) => (
                  <div key={day} className="relative border-r border-border last:border-r-0">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="h-[60px] border-b border-border hover:bg-secondary/20 transition-colors"
                      />
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
                          <p className="font-body text-[10px] opacity-80 truncate">
                            {slot.trainer}
                          </p>

                          {/* Hover Tooltip */}
                          {hoveredSlot === slot.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute left-full ml-2 top-0 z-20 bg-card border border-border rounded-xl p-3 shadow-elevated min-w-[200px]"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className="font-body text-sm font-medium">
                                  {slot.trainer}
                                </span>
                              </div>
                              <p className="font-body text-sm text-foreground mb-1">
                                {slot.session}
                              </p>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span className="font-body text-xs">
                                  {slot.startTime} - {slot.endTime}
                                </span>
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
        )}

        {/* Monthly Calendar View */}
        {view === "monthly" && (
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-body text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {monthDays.map((day, index) => {
                const sessions = getSessionsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={cn(
                      "min-h-[120px] p-2 border-r border-b border-border last:border-r-0 transition-colors",
                      !isCurrentMonth && "bg-muted/30",
                      isTodayDate && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center mb-2 font-body text-sm",
                        isTodayDate
                          ? "bg-primary text-primary-foreground"
                          : isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Sessions */}
                    <div className="space-y-1">
                      {sessions.slice(0, 3).map((session) => (
                        <motion.div
                          key={session.id}
                          whileHover={{ scale: 1.02 }}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-body truncate cursor-pointer border-l-2",
                            session.color
                          )}
                          title={`${session.trainer}: ${session.session} (${session.startTime} - ${session.endTime})`}
                        >
                          {session.session}
                        </motion.div>
                      ))}
                      {sessions.length > 3 && (
                        <p className="font-body text-[10px] text-muted-foreground px-2">
                          +{sessions.length - 3} more
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrainerSchedule;
