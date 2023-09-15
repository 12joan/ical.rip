import React, { useEffect, useState } from 'react';

import { EventForm } from '@/components/event-form';
import { downloadEvent } from '@/lib/downloadEvent';
import { validateEvent } from '@/lib/validateEvent';
import { CalendarEvent, ValidationError } from '@/types';

const VERSION = 1;
const STORAGE_KEY = `calendar-event-${VERSION}`;

const initialCalendarEvent: Partial<CalendarEvent> = {
  title: '',
  date: new Date(),
  allDay: false,
  startTime: '',
  endTime: '',
  location: '',
  url: '',
  description: 'Created with https://ical.rip/',
  alarms: {
    0: false,
    [15 * 60]: false,
    [30 * 60]: false,
    [60 * 60]: true,
    [2 * 60 * 60]: false,
    [24 * 60 * 60]: false,
  },
};

const getInitialCalendarEvent = (): Partial<CalendarEvent> => {
  const storedEvent = localStorage.getItem(STORAGE_KEY);

  if (storedEvent) {
    const parsedEvent = JSON.parse(storedEvent);

    return {
      ...parsedEvent,
      date: new Date(parsedEvent.date),
      alarms: Object.fromEntries(
        Object.entries(parsedEvent.alarms).map(([key, value]) => [
          parseInt(key, 10),
          value,
        ])
      ),
    } as Partial<CalendarEvent>;
  }

  return initialCalendarEvent;
};

export const App = () => {
  const [calendarEvent, setCalendarEvent] = useState(getInitialCalendarEvent());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendarEvent));
  }, [calendarEvent]);

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const handleSubmit = () => {
    const result = validateEvent(calendarEvent);

    if (result.valid) {
      try {
        downloadEvent(result.calendarEvent);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        // eslint-disable-next-line no-alert
        alert(
          'Something unexpected went wrong. Please check your inputs and try again.'
        );
      }

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
    <main className="p-3 w-full max-w-screen-sm mx-auto sm:my-auto">
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
