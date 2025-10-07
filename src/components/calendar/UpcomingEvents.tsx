
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  company: string;
  type: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-[45px] px-2 py-1 bg-primary/10 text-primary text-center rounded-md">
                  <div className="text-xs font-medium">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.company} • {event.type}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
