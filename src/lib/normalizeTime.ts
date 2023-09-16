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
  const trimmedTime = time.replace(/\s/g, '').replace(/\./g, ':').toLowerCase();

  const strippedTime = trimmedTime.replace(/[^0-9]/g, '');

  const match = /^(\d{1,2})(\d{2})?(\d{2})?$/.exec(strippedTime);
  if (!match) return null;

  const [rawHours, minutes = 0, seconds = 0] = match
    .slice(1)
    .map((x) => (x === undefined ? undefined : parseInt(x, 10)));
  if (rawHours === undefined) return null;

  const hours = (() => {
    if (rawHours === 0) return 0;

    if (rawHours === 12) {
      if (trimmedTime.endsWith('am')) return 0;
      return 12;
    }

    if (trimmedTime.endsWith('pm')) return rawHours + 12;
    return rawHours;
  })();

  if (hours > 23 || minutes > 59 || seconds > 59) return null;

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};
