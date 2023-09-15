import ical, { ICalEventData } from 'ical-generator'
import sanitizeFilename from 'sanitize-filename'
import { CalendarEvent } from '@/types'
import { normalizeTime } from '@/lib/normalizeTime'

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
    if (allDay) return null
    const time = rawTime && normalizeTime(rawTime)
    if (!time) return null
    const dateWithoutTime = date.toISOString().split('T')[0]
    return new Date(`${dateWithoutTime}T${time}`)
  })

  return {
    start: start || date,
    end,
    summary: title.trim() || undefined,
    allDay,
    location: location?.trim() || undefined,
    url: url?.trim() || undefined,
    description: description?.trim() || undefined,
  }
}

export const downloadEvent = (event: CalendarEvent) => {
  const calendar = ical()
  calendar.createEvent(toICalData(event))
  const blob = calendar.toBlob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = sanitizeFilename(`${event.title}.ics`)
  anchor.click()
  URL.revokeObjectURL(url)
}
