import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarEvent, ValidationError } from '@/types';

export interface EventFormProps {
  calendarEvent: Partial<CalendarEvent>;
  setCalendarEvent: (calendarEvent: Partial<CalendarEvent>) => void;
  validationErrors: ValidationError[];
  onSubmit: () => void;
  onReset: () => void;
}

export const EventForm = ({
  calendarEvent,
  setCalendarEvent,
  validationErrors,
  onSubmit,
  onReset,
}: EventFormProps) => {
  const {
    title,
    date,
    location,
    allDay,
    startTime,
    endTime,
    url,
    description,
  } = calendarEvent;

  const setField = <K extends keyof CalendarEvent>(
    field: K,
    value?: CalendarEvent[K]
  ) => {
    setCalendarEvent({
      ...calendarEvent,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onReset();
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit} onReset={handleReset}>
      <FormField
        label="Title"
        field="title"
        validationErrors={validationErrors}
      >
        {(props) => (
          <Input
            value={title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="My fabulous event"
            autoFocus
            aria-required
            {...props}
          />
        )}
      </FormField>

      <FormField label="Date" field="date" validationErrors={validationErrors}>
        {(props) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
                aria-required
                {...props}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setField('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </FormField>

      <FormField
        label="All day"
        labelPosition="after"
        field="allDay"
        validationErrors={validationErrors}
      >
        {(props) => (
          <Checkbox
            checked={allDay}
            onCheckedChange={(checked) => setField('allDay', checked === true)}
            {...props}
          />
        )}
      </FormField>

      {!allDay && (
        <div className="grid sm:grid-cols-2 gap-3">
          <FormField
            label="Start time"
            field="startTime"
            validationErrors={validationErrors}
          >
            {(props) => (
              <Input
                value={startTime}
                onChange={(e) => setField('startTime', e.target.value)}
                placeholder="10:00"
                {...props}
              />
            )}
          </FormField>

          <FormField
            label="End time"
            field="endTime"
            validationErrors={validationErrors}
          >
            {(props) => (
              <Input
                value={endTime}
                onChange={(e) => setField('endTime', e.target.value)}
                placeholder="11:00"
                {...props}
              />
            )}
          </FormField>
        </div>
      )}

      <FormField
        label="Location"
        field="location"
        validationErrors={validationErrors}
      >
        {(props) => (
          <Input
            value={location}
            onChange={(e) => setField('location', e.target.value)}
            placeholder="Add a location"
            {...props}
          />
        )}
      </FormField>

      <FormField label="URL" field="url" validationErrors={validationErrors}>
        {(props) => (
          <Input
            type="url"
            value={url}
            onChange={(e) => setField('url', e.target.value)}
            placeholder="https://example.com"
            {...props}
          />
        )}
      </FormField>

      <FormField
        label="Description"
        field="description"
        validationErrors={validationErrors}
      >
        {(props) => (
          <Textarea
            value={description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Add a description"
            {...props}
          />
        )}
      </FormField>

      <div className="flex max-sm:flex-col gap-2">
        <Button type="submit">Download .ical file</Button>
        <Button variant="outline" type="reset">
          Reset form
        </Button>
      </div>
    </form>
  );
};
