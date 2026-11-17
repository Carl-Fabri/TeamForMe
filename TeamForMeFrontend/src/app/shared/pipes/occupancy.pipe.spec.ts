import { OccupancyPipe } from './occupancy.pipe';

describe('OccupancyPipe', () => {
  const pipe = new OccupancyPipe();

  it('returns "available" below 80% occupancy', () => {
    expect(pipe.transform({ filled: 3, capacity: 5 })).toBe('available');
  });

  it('returns "almost-full" from 80% up to (not including) 100%', () => {
    expect(pipe.transform({ filled: 4, capacity: 5 })).toBe('almost-full');
    expect(pipe.transform({ filled: 9, capacity: 10 })).toBe('almost-full');
  });

  it('returns "full" at exactly capacity and above', () => {
    expect(pipe.transform({ filled: 5, capacity: 5 })).toBe('full');
    expect(pipe.transform({ filled: 6, capacity: 5 })).toBe('full');
  });

  it('treats zero capacity as full', () => {
    expect(pipe.transform({ filled: 0, capacity: 0 })).toBe('full');
  });

  it('falls back to "available" for nullish input', () => {
    expect(pipe.transform(null)).toBe('available');
    expect(pipe.transform(undefined)).toBe('available');
  });
});
