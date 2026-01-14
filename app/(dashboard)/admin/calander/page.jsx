"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { get } from "@/lib/api";

const TaskCalendar = () => {
  const { companyId } = useSelector((state) => state.auth.auth);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [newTask, setNewTask] = useState({
    title: "",
    startDate: "",
    endDate: "",
    type: "task",
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await get(`/task?companyId=${companyId}`);

      const transformedTasks = res.data.map((task) => ({
        id: task.id,
        title: task.title || task.name || "Untitled Task",
        startDate: new Date(new Date(task.createdAt).toDateString()),
        endDate: new Date(new Date(task.dueDate).toDateString()),
        type: task.type || "task",
        variant: getVariantByType(task.type || "task"),
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantByType = (type) => {
    const variantMap = {
      meeting: "default",
      task: "secondary",
      ticket: "destructive",
      bug: "destructive",
      feature: "outline",
    };
    return variantMap[type?.toLowerCase()] || "secondary";
  };

  useEffect(() => {
    if (companyId) {
      fetchTasks();
    }
  }, [companyId]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (day) => {
    const today = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return isSameDay(date, today);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.startDate && newTask.endDate) {
      const variants = ["default", "secondary", "destructive", "outline"];
      const newTaskObj = {
        id: tasks.length + 1,
        title: newTask.title,
        startDate: new Date(newTask.startDate),
        endDate: new Date(newTask.endDate),
        type: newTask.type,
        variant: variants[Math.floor(Math.random() * variants.length)],
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask({ title: "", startDate: "", endDate: "", type: "task" });
      setIsDialogOpen(false);
    }
  };

  const toggleWeekExpansion = (week) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [week]: !prev[week],
    }));
  };

  const calculateTaskBars = () => {
    const taskBars = [];
    const weeksInMonth = Math.ceil((firstDayOfMonth + daysInMonth) / 7);

    tasks.forEach((task) => {
      const startDate = new Date(task.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(task.endDate);
      endDate.setHours(0, 0, 0, 0);

      for (let week = 0; week < weeksInMonth; week++) {
        const weekStartDay = week * 7 - firstDayOfMonth + 1;
        const weekEndDay = weekStartDay + 6;

        let barStart = null;
        let barEnd = null;

        for (
          let day = Math.max(1, weekStartDay);
          day <= Math.min(daysInMonth, weekEndDay);
          day++
        ) {
          const checkDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          checkDate.setHours(0, 0, 0, 0);

          const isInRange =
            checkDate.getTime() >= startDate.getTime() &&
            checkDate.getTime() <= endDate.getTime();

          if (isInRange) {
            if (barStart === null) {
              barStart = day;
            }
            barEnd = day;
          }
        }

        if (barStart !== null && barEnd !== null) {
          taskBars.push({
            task,
            week,
            startDay: barStart,
            endDay: barEnd,
            startCol: (barStart + firstDayOfMonth - 1) % 7,
            span: barEnd - barStart + 1,
          });
        }
      }
    });

    return taskBars;
  };

  const renderCalendarWithBars = () => {
    const weeks = [];
    const weeksInMonth = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
    const taskBars = calculateTaskBars();

    for (let week = 0; week < weeksInMonth; week++) {
      const weekDays = [];
      const weekTaskBars = taskBars.filter((bar) => bar.week === week);
      const isExpanded = expandedWeeks[week] || false;
      const maxVisibleTasks = 2;
      const visibleTaskBars = isExpanded
        ? weekTaskBars
        : weekTaskBars.slice(0, maxVisibleTasks);
      const hiddenTaskCount = weekTaskBars.length - maxVisibleTasks;

      // Render days
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const day = week * 7 + dayOfWeek - firstDayOfMonth + 1;
        const isCurrentMonth = day > 0 && day <= daysInMonth;

        weekDays.push(
          <div
            key={`${week}-${dayOfWeek}`}
            className={`border-r border-b border-border p-2 ${
              !isCurrentMonth ? "bg-muted/30" : "bg-background"
            } ${
              isToday(day) && isCurrentMonth
                ? "ring-2 ring-primary ring-inset"
                : ""
            }`}
          >
            {isCurrentMonth && (
              <div
                className={`text-sm font-semibold mb-1 ${
                  isToday(day) ? "text-primary" : "text-foreground"
                }`}
              >
                {day}
              </div>
            )}
          </div>
        );
      }

      const taskAreaHeight = isExpanded
        ? weekTaskBars.length * 28 + 32
        : Math.min(weekTaskBars.length, maxVisibleTasks) * 28 + 32;

      weeks.push(
        <div
          key={`week-${week}`}
          className="relative flex-1 flex flex-col overflow-hidden"
          style={{
            minHeight: `${taskAreaHeight}px`,
            height: isExpanded ? "auto" : undefined,
          }}
        >
          <div
            className="grid grid-cols-7 absolute inset-0"
            style={{ zIndex: 0 }}
          >
            {weekDays}
          </div>
          {/* Render task bars for this week */}
          {weekTaskBars.length > 0 && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ paddingTop: "32px", zIndex: 1 }}
            >
              <div className="relative">
                {visibleTaskBars.map((bar, idx) => (
                  <div
                    key={`${bar.task.id}-${week}`}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${(bar.startCol / 7) * 100}%`,
                      width: `${(bar.span / 7) * 100}%`,
                      top: `${idx * 28}px`,
                      height: "24px",
                      padding: "0 4px",
                    }}
                  >
                    <Badge
                      variant={bar.task.variant}
                      className="w-full h-full justify-start truncate text-xs px-2 cursor-pointer hover:opacity-80"
                      title={bar.task.title}
                    >
                      {bar.task.title}
                    </Badge>
                  </div>
                ))}
                {/* Show more/less button */}
                {weekTaskBars.length > maxVisibleTasks && (
                  <div
                    className="pointer-events-auto absolute"
                    style={{
                      left: "4px",
                      top: `${visibleTaskBars.length * 28 + 4}px`,
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleWeekExpansion(week)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          {hiddenTaskCount} more
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return weeks;
  };

  return (
    <div className="h-[90vh] flex flex-col bg-background p-2">
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/50 flex-shrink-0">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-semibold text-muted-foreground border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading tasks...</div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {renderCalendarWithBars()}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskCalendar;
