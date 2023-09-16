import React, { useEffect, useState } from 'react';
import { GitHubLogoIcon as GitHubIcon } from '@radix-ui/react-icons';

import { EventForm } from '@/components/event-form';
import { buttonVariants } from '@/components/ui/button';
import { downloadEvent } from '@/lib/downloadEvent';
import { cn } from '@/lib/utils';
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
      date: parsedEvent.date ? new Date(parsedEvent.date) : undefined,
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
    <>
      <main className="w-full max-w-screen-sm mx-auto sm:my-auto">
        <div className="mb-3 sm:mb-6 space-y-2">
          <h1 className="font-bold text-2xl">Create a calendar event</h1>

          <p className="sm:text-lg font-light mb-3 sm:mb-6">
            Generate an iCal file that you can share with other attendees
          </p>
        </div>

        <EventForm
          calendarEvent={calendarEvent}
          setCalendarEvent={setCalendarEvent}
          validationErrors={validationErrors}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </main>

      <footer className="text-center sm:text-right">
        <a
          className={cn(buttonVariants({ variant: 'link' }), 'p-0 gap-1.5')}
          href="https://github.com/12joan/ical.rip"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GitHubIcon />
          GitHub
        </a>
      </footer>
    </>
  );
};
