export type CalendarEvent = {
  title: string;
  date: Date;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  location?: string;
  url?: string;
  description?: string;
  alarms: Record<number, boolean>;
};

export type ValidationError = {
  field: keyof CalendarEvent;
  message: string;
};
