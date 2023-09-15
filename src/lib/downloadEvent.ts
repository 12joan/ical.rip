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
}: CalendarEvent): ICalEventData => {
  const [start, end] = [startTime, endTime].map((rawTime) => {
    if (allDay) return null;

    const time = rawTime && normalizeTime(rawTime);
    if (!time) return null;

    const dateWithoutTime = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    // This will be parsed in the user's time zone and converted to UTC
    return new Date(`${dateWithoutTime} ${time}`);
  });

  return {
    start: start || date,
    end,
    summary: title.trim() || undefined,
    allDay,
    location: location?.trim() || undefined,
    url: url?.trim() || undefined,
    description: description?.trim() || undefined,
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
