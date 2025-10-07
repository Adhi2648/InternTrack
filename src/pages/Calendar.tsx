
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const CalendarPage = () => {
  // Sample events data for the calendar
  const events = [
    {
      id: '1',
      title: 'Technical Interview with Google',
      date: new Date(2025, 4, 10),
      company: 'Google',
      type: 'Technical Interview'
    },
    {
      id: '2',
      title: 'HR Call with Microsoft',
      date: new Date(2025, 4, 12),
      company: 'Microsoft',
      type: 'HR Interview'
    },
    {
      id: '3',
      title: 'Application Deadline - Spotify',
      date: new Date(2025, 4, 15),
      company: 'Spotify',
      type: 'Deadline'
    }
  ];

  // Function to render event highlights on the calendar
  const getHighlightedDates = () => {
    return events.reduce((acc, event) => {
      const dateString = event.date.toISOString().split('T')[0];
      
      if (!acc[dateString]) {
        acc[dateString] = {
          type: event.type,
          company: event.company,
        };
      } else {
        // If there are multiple events on the same day
        acc[dateString].company += `, ${event.company}`;
      }
      
      return acc;
    }, {} as Record<string, { type: string, company: string }>);
  };

  // Function to determine the CSS class based on event type
  const getDayClassNames = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const highlightedDates = getHighlightedDates();
    
    if (highlightedDates[dateString]) {
      const { type } = highlightedDates[dateString];
      
      if (type.includes('Interview')) return 'bg-status-interviewing rounded-full';
      if (type.includes('Deadline')) return 'bg-status-applied rounded-full';
      return 'bg-status-offer rounded-full';
    }
    
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Keep track of your interviews, deadlines, and other important events.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="p-4">
            <Calendar
              mode="single"
              className="rounded-md"
              modifiers={{
                highlight: (date) => {
                  const dateString = date.toISOString().split('T')[0];
                  return dateString in getHighlightedDates();
                },
              }}
              modifiersClassNames={{
                highlight: "font-bold",
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className={`h-8 w-8 p-0 font-normal flex items-center justify-center ${getDayClassNames(date)}`}>
                    {date.getDate()}
                  </div>
                ),
              }}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4">Event Details</h2>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="p-3 border rounded-md">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.company} • {event.type}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
