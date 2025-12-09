import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useApplications from "@/hooks/useApplications";
import {
  Bell,
  Briefcase,
  Building2,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  company: string;
  role: string;
  type: string;
  status: string;
}

const CalendarPage = () => {
  const appsQuery = useApplications();
  const applications = appsQuery.data ?? [];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showEventsDialog, setShowEventsDialog] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const navigate = useNavigate();

  // Debug: Log applications data
  console.log("Calendar - Applications:", applications);
  console.log(
    "Calendar - Apps with eventDate:",
    applications.filter((app: any) => app.eventDate)
  );

  // Generate events from applications that have eventDate set
  const events: CalendarEvent[] = useMemo(() => {
    const evts = applications
      .filter((app: any) => app.eventDate && app.nextStep)
      .map((app: any) => ({
        id: app.id || app._id,
        title: app.nextStep,
        date: new Date(app.eventDate),
        company: app.companyName,
        role: app.role,
        type: app.nextStep,
        status: app.status,
      }));
    console.log("Calendar - Generated events:", evts);
    return evts;
  }, [applications]);

  // Helper function to get local date key (YYYY-MM-DD) without timezone issues
  const getLocalDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Create a map of dates to events for quick lookup
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const dateKey = getLocalDateKey(event.date);
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(event);
    });
    return map;
  }, [events]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = getLocalDateKey(date);
    return eventsByDate[dateKey] || [];
  };

  // Check if a date has events
  const hasEvents = (date: Date): boolean => {
    const dateKey = getLocalDateKey(date);
    return dateKey in eventsByDate;
  };

  // Get the event type color class
  const getEventColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "interviewing":
        return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
      case "applied":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
      case "offer":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  // Get day highlight class based on event status
  const getDayHighlightClass = (date: Date): string => {
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length === 0) return "";

    // Priority: interviewing > offer > applied > rejected
    const hasInterviewing = dateEvents.some(
      (e) => e.status.toLowerCase() === "interviewing"
    );
    const hasOffer = dateEvents.some((e) => e.status.toLowerCase() === "offer");
    const hasApplied = dateEvents.some(
      (e) => e.status.toLowerCase() === "applied"
    );

    if (hasInterviewing)
      return "bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 rounded-full";
    if (hasOffer)
      return "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full";
    if (hasApplied)
      return "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full";
    return "bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded-full";
  };

  // Handle date click
  const handleDateClick = (date: Date | undefined) => {
    if (date && hasEvents(date)) {
      setSelectedDate(date);
      setShowEventsDialog(true);
    }
  };

  // Get selected date events
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Get upcoming events (next 30 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return events
      .filter((event) => event.date >= now && event.date <= thirtyDaysFromNow)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  // Get this week's events
  const thisWeekEvents = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return events.filter(
      (event) => event.date >= startOfWeek && event.date < endOfWeek
    );
  }, [events]);

  // Get next interview
  const nextInterview = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.status.toLowerCase() === "interviewing" && e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }, [events]);

  // Days until next event
  const daysUntilNextEvent = useMemo(() => {
    if (upcomingEvents.length === 0) return null;
    const now = new Date();
    const nextEvent = upcomingEvents[0];
    const diff = Math.ceil(
      (nextEvent.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  }, [upcomingEvents]);

  if (appsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Quick Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            Track interviews, deadlines & important events
          </p>
        </div>

        {/* Legend - Compact */}
        <div className="flex items-center gap-3 text-xs bg-muted/50 dark:bg-muted/20 rounded-full px-4 py-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Applied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Interview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span>Offer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Rejected</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {events.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {
                    events.filter(
                      (e) => e.status.toLowerCase() === "interviewing"
                    ).length
                  }
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {thisWeekEvents.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Next Event In</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {daysUntilNextEvent !== null ? `${daysUntilNextEvent}d` : "—"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Calendar + Sidebar */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Calendar - Takes more space */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-2 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs"
              >
                Today
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateClick}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md w-full"
              classNames={{
                months: "w-full",
                month: "w-full",
                table: "w-full",
                head_row: "flex w-full",
                head_cell: "flex-1 text-muted-foreground font-normal text-xs",
                row: "flex w-full mt-1",
                cell: "flex-1 text-center p-0 relative",
                day: "h-10 w-full font-normal",
                day_selected: "bg-primary text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
              }}
              modifiers={{
                hasEvent: (date) => hasEvents(date),
              }}
              modifiersClassNames={{
                hasEvent: "font-bold cursor-pointer",
              }}
              components={{
                DayContent: ({ date }) => (
                  <div
                    className={`h-10 w-10 mx-auto p-0 font-normal flex items-center justify-center transition-all ${getDayHighlightClass(
                      date
                    )} ${
                      hasEvents(date)
                        ? "cursor-pointer hover:scale-110 hover:shadow-md"
                        : ""
                    }`}
                  >
                    {date.getDate()}
                    {hasEvents(date) && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full" />
                    )}
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Next Interview Highlight */}
          {nextInterview && (
            <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/80 font-medium">
                      NEXT INTERVIEW
                    </p>
                    <h3 className="font-bold truncate">
                      {nextInterview.company}
                    </h3>
                    <p className="text-sm text-white/90 truncate">
                      {nextInterview.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-white/80">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {nextInterview.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Upcoming Events
                </div>
                <Badge variant="secondary" className="text-xs">
                  {upcomingEvents.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 6).map((event, idx) => (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-all cursor-pointer group ${
                        idx === 0 ? "bg-muted/30" : ""
                      }`}
                      onClick={() => {
                        setSelectedDate(event.date);
                        setShowEventsDialog(true);
                      }}
                    >
                      <div
                        className={`w-1 h-10 rounded-full flex-shrink-0 ${
                          event.status.toLowerCase() === "interviewing"
                            ? "bg-orange-500"
                            : event.status.toLowerCase() === "applied"
                            ? "bg-blue-500"
                            : event.status.toLowerCase() === "offer"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div className="min-w-[40px] text-center flex-shrink-0">
                        <div className="text-lg font-bold leading-none">
                          {event.date.getDate()}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">
                          {event.date.toLocaleString("default", {
                            month: "short",
                          })}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {event.company}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {event.title}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                      <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No upcoming events
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs mt-1"
                      onClick={() => navigate("/applications")}
                    >
                      Add events to your applications
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => navigate("/applications")}
              >
                <Briefcase className="h-4 w-4" />
                Manage Applications
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showEventsDialog} onOpenChange={setShowEventsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge className={getEventColorClass(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{event.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{event.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {event.date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events on this date
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
