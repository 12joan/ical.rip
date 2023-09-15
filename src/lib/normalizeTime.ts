/**
 * Valid formats:
 *  - 12
 *  - 12:00
 *  - 12.00
 *  - 1200
 *  - 12:00:00
 *  - 12am
 *  - 12 pm
 *  - 12:00am
 *  - 12:00:00am
 */

export const normalizeTime = (time: string): string | null => {
  const trimmedTime = time
    .replace(/\s/g, '')
    .replace(/\./g, ':')
    .toLowerCase()
    .replace(/am$/, '')

  const strippedTime = trimmedTime.replace(/[^0-9]/g, '')

  const match = /^(\d{1,2})(\d{2})?(\d{2})?$/.exec(strippedTime)
  if (!match) return null

  const [rawHours, minutes = 0, seconds = 0] = match.slice(1).map(Number)
  const hours = (trimmedTime.endsWith('pm') && rawHours < 12) ? rawHours + 12 : rawHours

  if (hours > 23 || minutes > 59 || seconds > 59) return null

  return `${hours}:${minutes}:${seconds}`
}
