import ical, { ICalEventData } from 'ical-generator';
import sanitizeFilename from 'sanitize-filename';

import { normalizeTime } from '@/lib/normalizeTime';
import { CalendarEvent } from '@/types';

const toICalData = ({
  title,
  date,
  allDay,
  startTime,
  endTime,
  location,
  url,
  description,
  alarms,
}: CalendarEvent): ICalEventData => {
  const [start, end] = [startTime, endTime].map((rawTime) => {
    if (allDay) return null;

    const time = rawTime && normalizeTime(rawTime);
    if (!time) return null;

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // This will be parsed in the user's time zone and converted to UTC
    return new Date(`${year}-${month}-${day} ${time}`);
  });

  return {
    start: start || date,
    end,
    summary: title.trim() || undefined,
    allDay,
    location: location?.trim() || undefined,
    url: url?.trim() || undefined,
    description: description?.trim() || undefined,
    alarms: allDay
      ? []
      : Object.entries(alarms)
          .filter(([, enabled]) => enabled)
          .map(
            ([offsetString]) =>
              ({
                type: 'display',
                // https://github.com/sebbo2002/ical-generator/issues/519
                trigger: parseInt(offsetString, 10) || 1,
              } as any)
          ),
  };
};

export const downloadEvent = (event: CalendarEvent) => {
  const calendar = ical();
  calendar.createEvent(toICalData(event));
  const blob = calendar.toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeFilename(`${event.title}.ics`);
  anchor.click();
  URL.revokeObjectURL(url);
};
