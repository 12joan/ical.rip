import React, { useState } from 'react';

import { EventForm } from '@/components/event-form';
import { downloadEvent } from '@/lib/downloadEvent';
import { validateEvent } from '@/lib/validateEvent';
import { CalendarEvent, ValidationError } from '@/types';

const initialCalendarEvent: Partial<CalendarEvent> = {
  title: '',
  date: new Date(),
  allDay: false,
  startTime: '',
  endTime: '',
  location: '',
  url: '',
  description: 'Created with https://ical.rip/',
};

export const App = () => {
  const [calendarEvent, setCalendarEvent] = useState(initialCalendarEvent);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const handleSubmit = () => {
    const result = validateEvent(calendarEvent);

    if (result.valid) {
      downloadEvent(result.calendarEvent);
      setValidationErrors([]);
    } else {
      setValidationErrors(result.errors);
    }
  };

  const handleReset = () => {
    setCalendarEvent(initialCalendarEvent);
    setValidationErrors([]);
  };

  return (
    <main className="p-3 max-w-screen-sm mx-auto sm:my-auto">
      <h1 className="font-bold text-2xl sm:text-3xl mb-3 sm:mb-6">
        Create a calendar event
      </h1>

      <EventForm
        calendarEvent={calendarEvent}
        setCalendarEvent={setCalendarEvent}
        validationErrors={validationErrors}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </main>
  );
};
