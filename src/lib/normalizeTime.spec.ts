import { normalizeTime } from './normalizeTime';

describe('normalizeTime', () => {
  describe('when time is 00:00', () => {
    it('parses HH:MM:SS', () => {
      expect(normalizeTime('00:00:00')).toEqual('00:00:00');
    });

    it('parses HH:MM', () => {
      expect(normalizeTime('00:00')).toEqual('00:00:00');
    });

    it('parses H', () => {
      expect(normalizeTime('0')).toEqual('00:00:00');
    });

    it('parses HHMM', () => {
      expect(normalizeTime('0000')).toEqual('00:00:00');
    });

    it('parses Ham', () => {
      expect(normalizeTime('12am')).toEqual('00:00:00');
    });

    it('parses HH:MMam', () => {
      expect(normalizeTime('12:00am')).toEqual('00:00:00');
    });

    it('parses HH:MM:SSam', () => {
      expect(normalizeTime('12:00:00am')).toEqual('00:00:00');
    });
  });

  describe('when time is between 01:00 and 11:59', () => {
    it('parses HH:MM:SS', () => {
      expect(normalizeTime('06:15:30')).toEqual('06:15:30');
    });

    it('parses HH:MM', () => {
      expect(normalizeTime('06:15')).toEqual('06:15:00');
    });

    it('parses H', () => {
      expect(normalizeTime('6')).toEqual('06:00:00');
    });

    it('parses HHMM', () => {
      expect(normalizeTime('0615')).toEqual('06:15:00');
    });

    it('parses Ham', () => {
      expect(normalizeTime('6am')).toEqual('06:00:00');
    });

    it('parses HH:MMam', () => {
      expect(normalizeTime('6:15am')).toEqual('06:15:00');
    });

    it('parses HH:MM:SSam', () => {
      expect(normalizeTime('6:15:30am')).toEqual('06:15:30');
    });
  });

  describe('when time is 12:00', () => {
    it('parses HH:MM:SS', () => {
      expect(normalizeTime('12:00:00')).toEqual('12:00:00');
    });

    it('parses HH:MM', () => {
      expect(normalizeTime('12:00')).toEqual('12:00:00');
    });

    it('parses H', () => {
      expect(normalizeTime('12')).toEqual('12:00:00');
    });

    it('parses HHMM', () => {
      expect(normalizeTime('1200')).toEqual('12:00:00');
    });

    it('parses Hpm', () => {
      expect(normalizeTime('12pm')).toEqual('12:00:00');
    });

    it('parses HH:MMpm', () => {
      expect(normalizeTime('12:00pm')).toEqual('12:00:00');
    });

    it('parses HH:MM:SSpm', () => {
      expect(normalizeTime('12:00:00pm')).toEqual('12:00:00');
    });
  });

  describe('when time is between 13:00 and 23:59', () => {
    it('parses HH:MM:SS', () => {
      expect(normalizeTime('18:15:30')).toEqual('18:15:30');
    });

    it('parses HH:MM', () => {
      expect(normalizeTime('18:15')).toEqual('18:15:00');
    });

    it('parses H', () => {
      expect(normalizeTime('18')).toEqual('18:00:00');
    });

    it('parses HHMM', () => {
      expect(normalizeTime('1815')).toEqual('18:15:00');
    });

    it('parses Hpm', () => {
      expect(normalizeTime('6pm')).toEqual('18:00:00');
    });

    it('parses HH:MMpm', () => {
      expect(normalizeTime('6:15pm')).toEqual('18:15:00');
    });

    it('parses HH:MM:SSpm', () => {
      expect(normalizeTime('6:15:30pm')).toEqual('18:15:30');
    });
  });

  describe('when time cannot be parsed', () => {
    it('returns null for empty string', () => {
      expect(normalizeTime('')).toEqual(null);
    });

    it('returns null for time containing no numbers', () => {
      expect(normalizeTime('abc')).toEqual(null);
    });

    it('returns null for time containing invalid 24-hour hour', () => {
      expect(normalizeTime('24:00:00')).toEqual(null);
    });

    it('returns null for time containing invalid PM hour', () => {
      expect(normalizeTime('13:00:00pm')).toEqual(null);
    });

    it('returns null for time containing invalid minutes', () => {
      expect(normalizeTime('13:60:00')).toEqual(null);
    });

    it('returns null for time containing invalid seconds', () => {
      expect(normalizeTime('13:00:60')).toEqual(null);
    });
  });
});
