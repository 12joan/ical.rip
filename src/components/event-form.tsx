import React from 'react';
import { format } from 'date-fns';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Calendar as CalendarIcon } from 'lucide-react';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { labelVariants } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarEvent, ValidationError } from '@/types';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

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
    alarms,
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
        required
        validationErrors={validationErrors}
      >
        {(props) => (
          <Input
            value={title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="My fabulous event"
            autoFocus
            {...props}
          />
        )}
      </FormField>

      <FormField
        label="Date"
        field="date"
        required
        validationErrors={validationErrors}
      >
        {(props) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
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
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField
              label="Start time"
              field="startTime"
              required
              validationErrors={validationErrors}
            >
              {(props) => (
                <Input
                  value={startTime}
                  onChange={(e) => setField('startTime', e.target.value)}
                  placeholder="10:00"
                  aria-describedby="startTimeHint"
                  {...props}
                />
              )}
            </FormField>

            <FormField
              label="End time"
              field="endTime"
              required
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

          <p id="startTimeHint" className="text-sm text-muted-foreground">
            Use your local time zone (
            {Intl.DateTimeFormat().resolvedOptions().timeZone}). It will be
            converted automatically for people in other time zones.
          </p>

          <fieldset id="alarms">
            <legend className={cn(labelVariants(), 'mb-3')}>Alarms</legend>

            <div className="grid xs:grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(alarms ?? {}).map(([offsetString, enabled]) => (
                <FormField
                  key={`alarm-${offsetString}`}
                  label={(() => {
                    const offset = parseInt(offsetString, 10);
                    if (offset === 0) return 'At time of event';
                    const agoString = timeAgo.format(-offset * 1000, {
                      now: 0,
                    });
                    return agoString.replace('ago', 'before');
                  })()}
                  labelPosition="after"
                  field={`alarms.${offsetString}` as any}
                  validationErrors={validationErrors}
                >
                  {(props) => (
                    <Checkbox
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        setField('alarms', {
                          ...alarms,
                          [offsetString]: checked === true,
                        })
                      }
                      {...props}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </fieldset>
        </>
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
