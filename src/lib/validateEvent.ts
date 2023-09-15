import { CalendarEvent, ValidationError } from '@/types'
import { normalizeTime } from '@/lib/normalizeTime'

const REQUIRED_FIELDS: (keyof CalendarEvent)[] = ['title', 'date', 'allDay']

export type ValidResult = {
  valid: true
  calendarEvent: CalendarEvent
}

export type InvalidResult = {
  valid: false
  errors: ValidationError[]
}

export type ValidationResult = ValidResult | InvalidResult

export const validateEvent = (calendarEvent: Partial<CalendarEvent>): ValidationResult => {
  const errors: ValidationError[] = []

  REQUIRED_FIELDS.forEach((field) => {
    const value = calendarEvent[field] ?? ''
    const valueAsString = value?.toString().trim()

    if (!valueAsString) {
      errors.push({
        field,
        message: 'This field is required',
      })
    }
  })

  if (!calendarEvent.allDay) {
    (['startTime', 'endTime'] as const).forEach((field) => {
      const time = calendarEvent[field] ?? ''
      const normalizedTime = normalizeTime(time)

      if (!normalizedTime) {
        errors.push({
          field,
          message: 'Invalid time',
        })
      }
    })
  }

  if (errors.length) {
    return {
      valid: false,
      errors,
    }
  }

  return {
    valid: true,
    calendarEvent: calendarEvent as CalendarEvent,
  }
}
